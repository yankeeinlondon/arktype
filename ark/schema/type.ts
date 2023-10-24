import {
	type conform,
	type evaluate,
	hasDomain,
	hasKey,
	isArray,
	type listable,
	type mutable
} from "@arktype/util"
import { type ConstraintKind } from "./constraints/constraint.js"
import { UnitNode } from "./constraints/unit.js"
import { Disjoint } from "./disjoint.js"
import {
	MorphNode,
	type MorphSchema,
	type parseMorph,
	type validateMorphInput
} from "./morph.js"
import type { BaseAttributes, Node, Schema } from "./node.js"
import { BaseNode } from "./node.js"
import { inferred } from "./utils.js"
import {
	constraintClassesByKind,
	type IntersectionSchema,
	type parseIntersection,
	type validateIntersectionInput,
	ValidatorNode
} from "./validator.js"

export type BranchNode = ValidatorNode | MorphNode

export interface ExpandedTypeSchema<
	branches extends readonly BranchSchema[] = readonly BranchSchema[]
> extends BaseAttributes {
	readonly branches: branches
}

export type TypeSchema = listable<BranchSchema> | ExpandedTypeSchema

export interface TypeChildren extends BaseAttributes {
	readonly branches: readonly BranchNode[]
}

export type BranchSchema = IntersectionSchema | MorphSchema

export class TypeNode<t = unknown> extends BaseNode<
	TypeChildren,
	typeof TypeNode
> {
	declare infer: t;
	declare [inferred]: t
	declare readonly condition: string

	static readonly kind = "type"

	constructor(children: TypeChildren) {
		super(children)
	}

	static readonly keyKinds = this.declareKeys({
		branches: "in"
	})

	private static intersectBranch = (l: TypeNode, r: BranchNode) => {
		const resultBranches = intersectBranches(l.branches, [r])
		if (resultBranches instanceof Disjoint) {
			return resultBranches
		}
		return { branches: resultBranches }
	}

	static readonly intersections = this.defineIntersections({
		type: (l, r) => {
			if (
				(l.branches.length === 0 || r.branches.length === 0) &&
				l.branches.length !== r.branches.length
			) {
				// if exactly one operand is never, we can use it to discriminate based on presence
				return Disjoint.from(
					"presence",
					l.branches.length !== 0,
					r.branches.length !== 0
				)
			}
			const resultBranches = intersectBranches(l.branches, r.branches)
			if (resultBranches instanceof Disjoint) {
				return resultBranches
			}
			return { branches: resultBranches }
		},
		morph: this.intersectBranch,
		validator: this.intersectBranch,
		constraint: (l, r) => {
			const branches: BranchNode[] = []
			for (const branch of l.branches) {
				const branchResult = branch.intersect(r)
				if (!(branchResult instanceof Disjoint)) {
					branches.push(branchResult)
				}
			}
			return branches.length === 0
				? Disjoint.from("union", l.branches, r)
				: {
						branches
				  }
		}
	})

	static from<const branches extends readonly unknown[]>(
		...branches: {
			[i in keyof branches]: validateBranchInput<branches[i]>
		}
	): parseNode<branches>
	static from<const branches extends readonly BranchSchema[]>(
		schema: ExpandedTypeSchema<branches>
	): parseNode<branches>
	static from(...schemas: [ExpandedTypeSchema] | BranchSchema[]) {
		const result = {} as mutable<TypeChildren>
		let schemaBranches: readonly BranchSchema[]
		if (hasDomain(schemas[0], "object") && "branches" in schemas[0]) {
			const { branches, ...attributes } = schemas[0]
			Object.assign(result, attributes)
			schemaBranches = branches
		} else {
			schemaBranches = schemas
		}
		result.branches = schemaBranches.map((branch) =>
			typeof branch === "object" && "morph" in branch
				? MorphNode.from(branch)
				: ValidatorNode.from(branch)
		)
		return new TypeNode(result)
	}

	static fromUnits<const branches extends readonly unknown[]>(
		...branches: branches
	): TypeNode<branches[number]>
	static fromUnits(...values: unknown[]) {
		// TODO: unique list, bypass validation
		const branches = values.map(
			(value) => new ValidatorNode({ unit: new UnitNode({ unit: value }) })
		)
		return new TypeNode({ branches })
	}

	static writeDefaultDescription(children: TypeChildren) {
		return children.branches.length === 0
			? "never"
			: children.branches.join(" or ")
	}

	only = this.branches.length === 1 ? this.branches[0] : undefined

	unwrapOnly<kind extends UnwrappableKind>(kind: kind): Node<kind> | undefined
	unwrapOnly(kind: UnwrappableKind) {
		if (!this.only) {
			return
		}
		if (kind === "morph") {
			return this.only.kind === "morph" ? this.only : undefined
		}
		const onlyValidator = this.only.kind === "validator" ? this.only : undefined
		if (kind === "validator") {
			return onlyValidator
		}
		const onlyConstraintOfKind = onlyValidator?.[kind]
		return isArray(onlyConstraintOfKind)
			? onlyConstraintOfKind.length === 1
				? onlyConstraintOfKind[0]
				: undefined
			: onlyConstraintOfKind
	}

	constrain<kind extends ConstraintKind>(
		kind: kind,
		definition: Schema<kind>
	): TypeNode {
		const result = this.intersect(
			(constraintClassesByKind[kind].from as any)(definition)
		)
		return result instanceof Disjoint ? result.throw() : result
	}

	// references() {
	// 	return this.branches.flatMap((branch) => branch.references())
	// }

	keyof() {
		return this
		// return this.rule.reduce(
		// 	(result, branch) => result.and(branch.keyof()),
		// 	builtins.unknown()
		// )
	}

	allows(data: unknown) {
		return true
	}

	// TODO: inferIntersection
	and<other extends TypeNode>(other: other): TypeNode<t & other["infer"]> {
		const result = this.intersect(other)
		return result instanceof Disjoint ? result.throw() : (result as never)
	}

	or<other extends TypeNode>(other: other): TypeNode<t | other["infer"]> {
		return this as never
	}

	isUnknown(): this is TypeNode<unknown> {
		return this.unwrapOnly("validator")?.constraints.length === 0
	}

	isNever(): this is TypeNode<never> {
		return this.branches.length === 0
	}

	getPath() {
		return this
	}

	array(): TypeNode<t[]> {
		return this as never
	}

	extends<other>(other: TypeNode<other>): this is TypeNode<other> {
		const intersection = this.intersect(other)
		return !(intersection instanceof Disjoint) && this.equals(intersection)
	}
}

export type TypeInput = listable<IntersectionSchema | MorphSchema>

export type UnwrappableKind = BranchNode["kind"] | ConstraintKind

export const node = Object.assign(TypeNode.from, {
	units: TypeNode.fromUnits
})

type parseNode<branches extends readonly unknown[]> = TypeNode<
	{
		[i in keyof branches]: parseBranch<branches[i]>
	}[number]
>

export type validateBranchInput<input> = conform<
	input,
	"morphs" extends keyof input
		? validateMorphInput<input>
		: validateIntersectionInput<input>
>

type parseBranch<branch> = branch extends MorphSchema
	? parseMorph<branch>
	: branch extends IntersectionSchema
	? parseIntersection<branch>
	: unknown

export type TypeClassesByKind = {
	type: typeof TypeNode
	morph: typeof MorphNode
	validator: typeof ValidatorNode
}

export type TypeKind = evaluate<keyof TypeClassesByKind>

export const intersectBranches = (
	l: readonly BranchNode[],
	r: readonly BranchNode[]
): readonly BranchNode[] | Disjoint => {
	// Branches that are determined to be a subtype of an opposite branch are
	// guaranteed to be a member of the final reduced intersection, so long as
	// each individual set of branches has been correctly reduced to exclude
	// redundancies.
	const finalBranches: BranchNode[] = []
	// Each rBranch is initialized to an empty array to which distinct
	// intersections will be appended. If the rBranch is identified as a
	// subtype or equal of any lBranch, the corresponding value should be
	// set to null so we can avoid including previous/future intersections
	// in the final result.
	const candidatesByR: (BranchNode[] | null)[] = r.map(() => [])
	for (let lIndex = 0; lIndex < l.length; lIndex++) {
		const lBranch = l[lIndex]
		let currentCandidateByR: { [rIndex in number]: BranchNode } = {}
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
	if (finalBranches.length === 0) {
		return Disjoint.from("union", l, r)
	}
	return finalBranches
}

// // discriminate is cached so we don't have to worry about this running multiple times
// get discriminant() {
// 	return discriminate(this.branches)
// }

export const reduceBranches = (branches: BranchNode[]) => {
	if (branches.length < 2) {
		return branches
	}
	const uniquenessByIndex: Record<number, boolean> = branches.map(() => true)
	for (let i = 0; i < branches.length; i++) {
		for (
			let j = i + 1;
			j < branches.length && uniquenessByIndex[i] && uniquenessByIndex[j];
			j++
		) {
			if (branches[i] === branches[j]) {
				// if the two branches are equal, only "j" is marked as
				// redundant so at least one copy could still be included in
				// the final set of branches.
				uniquenessByIndex[j] = false
				continue
			}
			const intersection = branches[i].intersect(branches[j])
			if (intersection === branches[i]) {
				uniquenessByIndex[i] = false
			} else if (intersection === branches[j]) {
				uniquenessByIndex[j] = false
			}
		}
	}
	return branches.filter((_, i) => uniquenessByIndex[i])
}

// export const compileDiscriminant = (
// 	discriminant: Discriminant,
// 	ctx: CompilationContext
// ) => {
// 	if (discriminant.isPureRootLiteral) {
// 		// TODO: ctx?
// 		return compileDiscriminatedLiteral(discriminant.cases)
// 	}
// 	let compiledPath = In
// 	for (const segment of discriminant.path) {
// 		// we need to access the path as optional so we don't throw if it isn't present
// 		compiledPath += compilePropAccess(segment, true)
// 	}
// 	const condition =
// 		discriminant.kind === "domain" ? `typeof ${compiledPath}` : compiledPath
// 	let compiledCases = ""
// 	for (const k in discriminant.cases) {
// 		const caseCondition = k === "default" ? "default" : `case ${k}`
// 		const caseBranches = discriminant.cases[k]
// 		ctx.discriminants.push(discriminant)
// 		const caseChecks = isArray(caseBranches)
// 			? compileIndiscriminable(caseBranches, ctx)
// 			: compileDiscriminant(caseBranches, ctx)
// 		ctx.discriminants.pop()
// 		compiledCases += `${caseCondition}: {
//     ${caseChecks ? `${caseChecks}\n     break` : "break"}
// }`
// 	}
// 	if (!discriminant.cases.default) {
// 		// TODO: error message for traversal
// 		compiledCases += `default: {
//     return false
// }`
// 	}
// 	return `switch(${condition}) {
//     ${compiledCases}
// }`
// }

// const compileDiscriminatedLiteral = (cases: DiscriminatedCases) => {
// 	// TODO: error messages for traversal
// 	const caseKeys = Object.keys(cases)
// 	if (caseKeys.length === 2) {
// 		return `if( ${In} !== ${caseKeys[0]} && ${In} !== ${caseKeys[1]}) {
//     return false
// }`
// 	}
// 	// for >2 literals, we fall through all cases, breaking on the last
// 	const compiledCases =
// 		caseKeys.map((k) => `    case ${k}:`).join("\n") + "        break"
// 	// if none of the cases are met, the check fails (this is optimal for perf)
// 	return `switch(${In}) {
//     ${compiledCases}
//     default:
//         return false
// }`
// }

// export const compileIndiscriminable = (
// 	branches: readonly Predicate[],
// 	ctx: CompilationContext
// ) => {
// 	if (branches.length === 0) {
// 		return compileFailureResult("custom", "nothing", ctx)
// 	}
// 	if (branches.length === 1) {
// 		return branches[0].compile(ctx)
// 	}
// 	return branches
// 		.map(
// 			(branch) => `(() => {
// ${branch.compile(ctx)}
// return true
// })()`
// 		)
// 		.join(" || ")
// }