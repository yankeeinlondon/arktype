import type {
	conform,
	extend,
	instanceOf,
	listable,
	mutable
} from "@arktype/util"
import { hasDomain } from "@arktype/util"
import { UnitNode } from "./bases/unit.js"
import { type Root } from "./root.js"
import {
	type ConstraintDeclarationsByKind,
	type ConstraintKind,
	IntersectionNode,
	type IntersectionSchema,
	type parseIntersection,
	type validateIntersectionInput
} from "./sets/intersection.js"
import {
	MorphNode,
	type MorphSchema,
	type parseMorph,
	type validateMorphInput
} from "./sets/morph.js"
import { type SetDeclarationsByKind } from "./sets/set.js"
import {
	type BranchSchema,
	type ExpandedUnionSchema,
	type UnionInner,
	UnionNode
} from "./sets/union.js"

const parseNode = (...schemas: [ExpandedUnionSchema] | BranchSchema[]) => {
	const result = {} as mutable<UnionInner>
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
			? new MorphNode(branch as never)
			: new IntersectionNode(branch as never)
	)
	return new UnionNode(result)
}

type RootNodeParser = {
	<const branches extends readonly unknown[]>(
		...branches: {
			[i in keyof branches]: validateBranchInput<branches[i]>
		}
	): Root<inferNodeBranches<branches>>
}

// const parseKind = <kind extends NodeKind, schema extends Schema<kind>>(
// 	kind: kind,
// 	schema: schema
// ) => new TypeNode(kind, schema) as Node<kind, unknown>

const parseUnits = <const branches extends readonly unknown[]>(
	...values: branches
) => {
	const uniqueValues: unknown[] = []
	for (const value of values) {
		if (!uniqueValues.includes(value)) {
			uniqueValues.push(value)
		}
	}
	// TODO: bypass reduction
	return new UnionNode<branches[number]>({
		branches: uniqueValues.map((unit) => new UnitNode({ unit }))
	})
}

export const node = Object.assign(parseNode as RootNodeParser, {
	units: parseUnits
	// kind: parseKind
})

export type RootInput = listable<IntersectionSchema | MorphSchema>

export type inferNodeBranches<branches extends readonly unknown[]> = {
	[i in keyof branches]: parseBranch<branches[i]>
}[number]

export type validateBranchInput<input> = conform<
	input,
	"morphs" extends keyof input
		? validateMorphInput<input>
		: validateIntersectionInput<input>
>

export type parseBranch<branch> = branch extends MorphSchema
	? parseMorph<branch>
	: branch extends IntersectionSchema
	? parseIntersection<branch>
	: unknown

type reifyIntersections<lKind extends NodeKind, intersectionMap> = {
	[rKind in keyof intersectionMap]: (
		l: Node<lKind>,
		r: Node<intersectionGroupOf<rKind>>
	) => reifyIntersectionResult<intersectionMap[rKind]>
}

type intersectionGroupOf<rKind> = rKind extends NodeKind
	? rKind
	: rKind extends "constraint"
	? ConstraintKind
	: never

type reifyIntersectionResult<result> = result extends NodeKind
	? Inner<result>
	: result

export type NodeDeclarationsByKind = extend<
	ConstraintDeclarationsByKind,
	SetDeclarationsByKind
>

export type NodeKind = keyof NodeDeclarationsByKind

export type NodeClass<kind extends NodeKind = NodeKind> =
	NodeDeclarationsByKind[kind]["class"]
5
export type Schema<kind extends NodeKind> =
	NodeDeclarationsByKind[kind]["schema"]

export type Inner<kind extends NodeKind> = NodeDeclarationsByKind[kind]["inner"]

export type LeftIntersections<kind extends NodeKind> = reifyIntersections<
	kind,
	NodeDeclarationsByKind[kind]["intersections"]
>

export type IntersectionMap<kind extends NodeKind> =
	NodeDeclarationsByKind[kind]["intersections"]

export type Node<kind extends NodeKind = NodeKind> = instanceOf<NodeClass<kind>>
