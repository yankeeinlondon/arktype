import type { exact, listable, satisfy, Thunk } from "@arktype/util"
import { hasKey, isArray } from "@arktype/util"
import type { UniversalAttributes } from "../attributes/attribute.js"
import { Disjoint } from "../disjoint.js"
import type { CompilationContext } from "../io/compile.js"
import { compileFailureResult, compilePropAccess, In } from "../io/compile.js"
import type { NodeDefinition } from "../node.js"
import { BaseNode } from "../node.js"
import { builtins } from "../utils.js"
import type { Discriminant, DiscriminatedCases } from "./discriminate.js"
import type { PredicateNode } from "./predicate.js"
import type { RootNode } from "./type.js"
import { TypeNode } from "./type.js"

export type UnionNodeDefinition = satisfy<
	NodeDefinition,
	{
		kind: "union"
		rule: readonly PredicateNode[]
		attributes: UniversalAttributes
		instance: UnionNode
	}
>

export class UnionNode<t = unknown> extends TypeNode<t, UnionNodeDefinition> {
	readonly kind = "union"

	writeDefaultDescription(): string {
		return this.rule.length === 0 ? "never" : this.rule.join(" or ")
	}

	references() {
		return this.rule.flatMap((branch) => branch.references())
	}

	intersect(other: RootNode): RootNode | Disjoint {
		const resultBranches = intersectBranches(
			this.rule,
			other.hasKind("union") ? other.rule : [other]
		)
		return resultBranches.length === 0
			? Disjoint.from("union", this, other)
			: resultBranches.length === 1
			? resultBranches[0]
			: new UnionNode(resultBranches)
	}

	// // discriminate is cached so we don't have to worry about this running multiple times
	// get discriminant() {
	// 	return discriminate(this.branches)
	// }

	keyof() {
		return this.rule.reduce(
			(result, branch) => result.and(branch.keyof()),
			builtins.unknown()
		) as TypeNode<keyof t>
	}
}

export const reduceBranches = (branchNodes: PredicateNode[]) => {
	if (branchNodes.length < 2) {
		return branchNodes
	}
	const uniquenessByIndex: Record<number, boolean> = branchNodes.map(() => true)
	for (let i = 0; i < branchNodes.length; i++) {
		for (
			let j = i + 1;
			j < branchNodes.length && uniquenessByIndex[i] && uniquenessByIndex[j];
			j++
		) {
			if (branchNodes[i] === branchNodes[j]) {
				// if the two branches are equal, only "j" is marked as
				// redundant so at least one copy could still be included in
				// the final set of branches.
				uniquenessByIndex[j] = false
				continue
			}
			const intersection = branchNodes[i].intersect(branchNodes[j])
			if (intersection === branchNodes[i]) {
				uniquenessByIndex[i] = false
			} else if (intersection === branchNodes[j]) {
				uniquenessByIndex[j] = false
			}
		}
	}
	return branchNodes.filter((_, i) => uniquenessByIndex[i])
}

type inferPredicateDefinition<t> = t

export type inferBranches<branches extends readonly ConstraintInputs[]> = {
	[i in keyof branches]: inferPredicateDefinition<branches[i]>
}[number]

export type inferTypeInput<input extends TypeInput> =
	input extends readonly ConstraintInputs[]
		? inferBranches<input>
		: input extends ConstraintInputs
		? inferPredicateDefinition<input>
		: input extends BaseNode<infer t>
		? t
		: never

export type TypeInput = listable<ConstraintInputs>

export type validatedTypeNodeInput<
	input extends List<ConstraintInputs>,
	bases extends BasisInput[]
> = {
	[i in keyof input]: exact<
		input[i],
		ConstraintInputs //<bases[i & keyof bases]>
	>
}

export type extractBases<
	branches,
	result extends BasisInput[] = []
> = branches extends [infer head, ...infer tail]
	? extractBases<
			tail,
			[
				...result,
				head extends {
					basis: infer basis extends BasisInput
				}
					? basis
					: BasisInput
			]
	  >
	: result

// TODO: bestway to handle?
const getEmptyScope = cached(() => Scope.root({}))

const createAnonymousParseContext = (): ParseContext => ({
	baseName: "anonymous",
	path: [],
	args: {},
	scope: getEmptyScope()
})

const typeNode = <const input extends listable<ConstraintInputs>>(
	input: input,
	// TODO: check all usages to ensure metadata is being propagated
	meta = {}
) =>
	new BaseNode(
		listFrom(input).map((branch) => predicateNode(branch)),
		meta
	)

// TODO: could every node have the same functionality as type node?
const unit = <const values extends readonly unknown[]>(...values: values) =>
	typeNode(values.map((value) => ({ basis: ["===", value] }))) as BaseNode<
		values[number]
	>

export const node = Object.assign(typeNode, { unit })

export const intersectBranches = (
	l: readonly PredicateNode[],
	r: readonly PredicateNode[]
): readonly PredicateNode[] => {
	// Branches that are determined to be a subtype of an opposite branch are
	// guaranteed to be a member of the final reduced intersection, so long as
	// each individual set of branches has been correctly reduced to exclude
	// redundancies.
	const finalBranches: PredicateNode[] = []
	// Each rBranch is initialized to an empty array to which distinct
	// intersections will be appended. If the rBranch is identified as a
	// subtype or equal of any lBranch, the corresponding value should be
	// set to null so we can avoid including previous/future intersections
	// in the final result.
	const candidatesByR: (PredicateNode[] | null)[] = r.map(() => [])
	for (let lIndex = 0; lIndex < l.length; lIndex++) {
		const lBranch = l[lIndex]
		let currentCandidateByR: { [rIndex in number]: PredicateNode } = {}
		for (let rIndex = 0; rIndex < r.length; rIndex++) {
			const rBranch = r[rIndex]
			if (!candidatesByR[rIndex]) {
				// we've identified rBranch as a subtype of
				// an lBranch and will not yield any distinct intersections.
				continue
			}
			if (lBranch === rBranch) {
				// Combination of subtype and supertype cases
				finalBranches.push(lBranch)
				candidatesByR[rIndex] = null
				currentCandidateByR = {}
				break
			}
			const branchIntersection = lBranch.intersect(rBranch)
			if (branchIntersection instanceof Disjoint) {
				// doesn't tell us about any redundancies or add a distinct intersection
				continue
			}
			if (branchIntersection === lBranch) {
				// If l is a subtype of the current r branch, intersections
				// with previous and remaining branches of r won't lead to
				// distinct intersections, so empty currentCandidatesByR and break
				// from the inner loop.
				finalBranches.push(lBranch)
				currentCandidateByR = {}
				break
			}
			if (branchIntersection === rBranch) {
				// If r is a subtype of the current l branch, set its
				// intersections to null, removing any previous
				// intersections and preventing any of its
				// remaining intersections from being computed.
				finalBranches.push(rBranch)
				candidatesByR[rIndex] = null
				continue
			}
			// If neither l nor r is a subtype of the other, add their
			// intersection as a candidate to the current batch (could
			// still be removed if it is determined l or r is a subtype
			// of a remaining branch).
			currentCandidateByR[rIndex] = branchIntersection
		}
		for (const rIndex in currentCandidateByR) {
			// candidatesByR at rIndex should never be null if it is in currentCandidates
			candidatesByR[rIndex]!.push(currentCandidateByR[rIndex])
		}
	}
	// All remaining candidates are distinct, so include them in the final result
	for (const candidates of candidatesByR) {
		candidates?.forEach((candidate) => finalBranches.push(candidate))
	}
	return finalBranches
}

export const compileDiscriminant = (
	discriminant: Discriminant,
	ctx: CompilationContext
) => {
	if (discriminant.isPureRootLiteral) {
		// TODO: ctx?
		return compileDiscriminatedLiteral(discriminant.cases)
	}
	let compiledPath = In
	for (const segment of discriminant.path) {
		// we need to access the path as optional so we don't throw if it isn't present
		compiledPath += compilePropAccess(segment, true)
	}
	const condition =
		discriminant.kind === "domain" ? `typeof ${compiledPath}` : compiledPath
	let compiledCases = ""
	for (const k in discriminant.cases) {
		const caseCondition = k === "default" ? "default" : `case ${k}`
		const caseBranches = discriminant.cases[k]
		ctx.discriminants.push(discriminant)
		const caseChecks = isArray(caseBranches)
			? compileIndiscriminable(caseBranches, ctx)
			: compileDiscriminant(caseBranches, ctx)
		ctx.discriminants.pop()
		compiledCases += `${caseCondition}: {
    ${caseChecks ? `${caseChecks}\n     break` : "break"}
}`
	}
	if (!discriminant.cases.default) {
		// TODO: error message for traversal
		compiledCases += `default: {
    return false
}`
	}
	return `switch(${condition}) {
    ${compiledCases}
}`
}

const compileDiscriminatedLiteral = (cases: DiscriminatedCases) => {
	// TODO: error messages for traversal
	const caseKeys = Object.keys(cases)
	if (caseKeys.length === 2) {
		return `if( ${In} !== ${caseKeys[0]} && ${In} !== ${caseKeys[1]}) {
    return false
}`
	}
	// for >2 literals, we fall through all cases, breaking on the last
	const compiledCases =
		caseKeys.map((k) => `    case ${k}:`).join("\n") + "        break"
	// if none of the cases are met, the check fails (this is optimal for perf)
	return `switch(${In}) {
    ${compiledCases}
    default:
        return false
}`
}

export const compileIndiscriminable = (
	branches: readonly PredicateNode[],
	ctx: CompilationContext
) => {
	if (branches.length === 0) {
		return compileFailureResult("custom", "nothing", ctx)
	}
	if (branches.length === 1) {
		return branches[0].compile(ctx)
	}
	return branches
		.map(
			(branch) => `(() => {
${branch.compile(ctx)}
return true
})()`
		)
		.join(" || ")
}
