import {
	includes,
	isArray,
	throwInternalError,
	throwParseError,
	type ErrorMessage,
	type conform,
	type extend,
	type listable,
	type mutable
} from "@arktype/util"
import {
	getBasisKindOrThrow,
	type BasisKind,
	type parseBasis
} from "../bases/basis.js"
import type { BaseSchemaParseContext, UnknownNode } from "../node.js"
import type { refinementInputsByKind } from "../refinements/refinement.js"
import { getBasisName } from "../refinements/shared.js"
import type {
	BaseAttributes,
	declareNode,
	withAttributes
} from "../shared/declare.js"
import {
	closedRefinementKinds,
	defineNode,
	openRefinementKinds,
	type ClosedRefinementKind,
	type ConstraintKind,
	type OpenRefinementKind,
	type RefinementKind
} from "../shared/define.js"
import { Disjoint } from "../shared/disjoint.js"
import type { Implementation, Node, Schema } from "../shared/node.js"
import type { SetAttachments } from "./set.js"

export type IntersectionInner = withAttributes<
	{ basis?: Node<BasisKind> } & {
		[k in RefinementKind]?: k extends OpenRefinementKind
			? readonly Node<k>[]
			: Node<k>
	}
>

export type IntersectionSchema<
	basis extends Schema<BasisKind> | undefined = Schema<BasisKind> | undefined
> = {
	basis?: basis
} & refinementInputsByKind<
	basis extends Schema<BasisKind> ? parseBasis<basis>["infer"] : unknown
> &
	BaseAttributes

export type ConstraintSet = readonly Node<ConstraintKind>[]

export type IntersectionAttachments = extend<
	SetAttachments,
	{
		constraints: ConstraintSet
		refinements: readonly Node<RefinementKind>[]
	}
>

export type IntersectionDeclaration = declareNode<{
	kind: "intersection"
	schema: IntersectionSchema
	context: {
		basis: Node<BasisKind> | undefined
	}
	inner: IntersectionInner
	intersections: {
		intersection: "intersection" | Disjoint
		default: "intersection" | Disjoint
	}
	attach: IntersectionAttachments
}>

export const IntersectionImplementation = defineNode({
	kind: "intersection",
	normalize: (schema) => schema,
	addContext: (ctx) => {
		const basisSchema = ctx.schema.basis
		if (basisSchema === undefined) {
			return { basis: undefined }
		}
		const basisKind = getBasisKindOrThrow(basisSchema)
		return { basis: ctx.cls.parseSchema(basisKind, basisSchema, {}) }
	},
	keys: {
		basis: {
			// the basis has already been preparsed and added to context
			parse: (_, ctx) => ctx.basis
		},
		divisor: {
			parse: (schema, ctx) => parseClosedRefinement("divisor", schema, ctx)
		},
		max: {
			parse: (schema, ctx) => parseClosedRefinement("max", schema, ctx)
		},
		min: {
			parse: (schema, ctx) => parseClosedRefinement("min", schema, ctx)
		},
		pattern: {
			parse: (schema, ctx) => parseOpenRefinement("pattern", schema, ctx)
		},
		predicate: {
			parse: (schema, ctx) => parseOpenRefinement("predicate", schema, ctx)
		},
		optional: {
			parse: (schema, ctx) => parseOpenRefinement("optional", schema, ctx)
		},
		required: {
			parse: (schema, ctx) => parseOpenRefinement("required", schema, ctx)
		}
	},
	intersections: {
		intersection: (l, r) => {
			let result: readonly Node<ConstraintKind>[] | Disjoint = l.constraints
			for (const refinement of r.refinements) {
				if (result instanceof Disjoint) {
					break
				}
				result = addConstraint(result, refinement)
			}
			return result instanceof Disjoint ? result : unflattenConstraints(result)
		},
		default: (l, r) => {
			const result = addConstraint(l.constraints, r)
			return result instanceof Disjoint ? result : unflattenConstraints(result)
		}
	},
	reduce: (inner, ctx) => {
		const { description, alias, ...constraintsByKind } = inner
		const inputConstraints = Object.values(
			constraintsByKind
		).flat() as ConstraintSet
		const reducedConstraints = reduceConstraints([], inputConstraints)
		if (reducedConstraints instanceof Disjoint) {
			return reducedConstraints.throw()
		}
		if (reducedConstraints.length === 1 && reducedConstraints[0].isBasis()) {
			// TODO: description?
			return reducedConstraints[0]
		}
		if (reducedConstraints.length === inputConstraints.length) {
			return
		}
		const reducedConstraintsByKind = unflattenConstraints(
			reducedConstraints
		) as mutable<IntersectionInner>
		if (description) {
			reducedConstraintsByKind.description = description
		}
		if (alias) {
			reducedConstraintsByKind.alias = alias
		}
		return ctx.cls.parsePrereduced("intersection", reducedConstraintsByKind)
	},
	attach: (node) => {
		const attachments: mutable<IntersectionAttachments, 2> = {
			constraints: [],
			refinements: [],
			compile: (cfg) =>
				attachments.constraints
					.map(
						(constraint) => `if(!(${constraint.condition})) {
	return false
}`
					)
					.join("\n") + "\nreturn true"
		}
		for (const [k, v] of node.entries) {
			if (k === "basis") {
				attachments.constraints.push(v)
			} else if (includes(openRefinementKinds, k)) {
				attachments.constraints.push(...(v as any))
				attachments.refinements.push(...(v as any))
			} else if (includes(closedRefinementKinds, k)) {
				attachments.constraints.push(v as never)
				attachments.refinements.push(v as never)
			}
		}
		return attachments
	},
	writeDefaultDescription: (node) => {
		return node.constraints.length === 0
			? "an unknown value"
			: node.constraints.join(" and ")
	}
})

const assertValidBasis = (
	refinementNode: Node<RefinementKind>,
	basis: Node<BasisKind> | undefined
) => {
	if (
		refinementNode.implicitBasis &&
		(basis === undefined || !basis.extends(refinementNode.implicitBasis))
	) {
		const message = (
			refinementNode.implementation as Implementation<RefinementKind>
		).writeInvalidBasisMessage(getBasisName(basis))
		throwParseError(message)
	}
}

export const parseClosedRefinement = <kind extends ClosedRefinementKind>(
	kind: kind,
	input: Schema<kind>,
	intersectionContext: BaseSchemaParseContext<"intersection">
): Node<kind> => {
	const basis = intersectionContext.inner?.basis
	const childContext = { basis }
	const refinement = intersectionContext.cls.parseSchema(
		kind,
		input,
		childContext
	) as Node<RefinementKind>
	assertValidBasis(refinement, basis)
	return refinement as never
}

export const parseOpenRefinement = <kind extends OpenRefinementKind>(
	kind: kind,
	input: listable<Schema<kind>>,
	intersectionContext: BaseSchemaParseContext<"intersection">
) => {
	const basis = intersectionContext.inner?.basis
	const childContext = { basis }
	if (isArray(input)) {
		if (input.length === 0) {
			// Omit empty lists as input
			return
		}
		const refinements = input
			.map((refinement) =>
				intersectionContext.cls.parseSchema(kind, refinement, childContext)
			)
			.sort((l, r) => (l.id < r.id ? -1 : 1))
		assertValidBasis(refinements[0], basis)
		return refinements
	}
	const refinement = intersectionContext.cls.parseSchema(
		kind,
		input,
		childContext
	)
	assertValidBasis(refinement, basis)
	return [refinement]
}

const reduceConstraints = (
	l: readonly Node<ConstraintKind>[],
	r: readonly Node<ConstraintKind>[]
) => {
	let result: readonly Node<ConstraintKind>[] | Disjoint = l
	for (const refinement of r) {
		if (result instanceof Disjoint) {
			break
		}
		result = addConstraint(result, refinement)
	}
	return result instanceof Disjoint ? result : result
}

export const flattenConstraints = (inner: IntersectionInner): ConstraintSet =>
	Object.values(inner).flatMap((v) =>
		typeof v === "object" ? (v as UnknownNode) : []
	)

export const unflattenConstraints = (
	constraints: ConstraintSet
): IntersectionInner => {
	const inner: mutable<IntersectionInner> = {}
	for (const constraint of constraints) {
		if (constraint.isBasis()) {
			inner.basis = constraint
		} else if (constraint.isOpenRefinement()) {
			inner[constraint.kind] ??= [] as any
			;(inner as any)[constraint.kind].push(constraint)
		} else if (constraint.isClosedRefinement()) {
			if (inner[constraint.kind]) {
				return throwInternalError(
					`Unexpected intersection of closed refinements of kind ${constraint.kind}`
				)
			}
			inner[constraint.kind] = constraint as never
		}
	}
	return inner
}

export const addConstraint = (
	base: readonly Node<ConstraintKind>[],
	constraint: Node<ConstraintKind>
): Node<ConstraintKind>[] | Disjoint => {
	const result: Node<ConstraintKind>[] = []
	let includesRefinement = false
	for (let i = 0; i < base.length; i++) {
		const elementResult = constraint.intersectClosed(base[i])
		if (elementResult === null) {
			result.push(base[i])
		} else if (elementResult instanceof Disjoint) {
			return elementResult
		} else if (!includesRefinement) {
			result.push(elementResult)
			includesRefinement = true
		} else if (!result.includes(elementResult)) {
			return throwInternalError(
				`Unexpectedly encountered multiple distinct intersection results for refinement ${elementResult}`
			)
		}
	}
	if (!includesRefinement) {
		result.push(constraint)
	}
	return result
}

export type IntersectionBasis = {
	basis?: Schema<BasisKind>
}

type exactBasisMessageOnError<branch, expected> = {
	[k in keyof branch]: k extends keyof expected
		? conform<branch[k], expected[k]>
		: ErrorMessage<`'${k & string}' is not allowed by ${branch[keyof branch &
				BasisKind] extends string
				? `basis '${branch[keyof branch & BasisKind]}'`
				: `this schema's basis`}`>
}

export type validateIntersectionSchema<schema> =
	schema extends IntersectionBasis
		? exactBasisMessageOnError<schema, IntersectionSchema<schema["basis"]>>
		: exactBasisMessageOnError<schema, IntersectionSchema<undefined>>

export type parseIntersectionSchema<schema> =
	schema extends Required<IntersectionBasis>
		? keyof schema & RefinementKind extends never
			? // if there are no refinement keys, reduce to the basis node
			  parseBasis<schema["basis"]>
			: Node<"intersection", parseBasis<schema["basis"]>["infer"]>
		: Node<"intersection">

// export class ArrayPredicate extends composePredicate(
// 	Narrowable<"object">,
// 	Instantiatable<typeof Array>,
// 	Boundable
// ) {
// 	// TODO: add minLength prop that would result from collapsing types like [...number[], number]
// 	// to a single variadic number prop with minLength 1
// 	// Figure out best design for integrating with named props.

// 	readonly prefix?: readonly TypeRoot[]
// 	readonly variadic?: TypeRoot
// 	readonly postfix?: readonly TypeRoot[]
// }

// export class DatePredicate extends composePredicate(
// 	Narrowable<"object">,
// 	Instantiatable<typeof Date>,
// 	Boundable
// ) {}
