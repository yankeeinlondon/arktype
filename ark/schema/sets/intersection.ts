import type {
	conform,
	ErrorMessage,
	exactMessageOnError,
	mutable
} from "@arktype/util"
import {
	includes,
	isArray,
	throwInternalError,
	throwParseError
} from "@arktype/util"
import {
	type BaseAttributes,
	BaseNode,
	constraintKinds,
	type declareNode,
	type withAttributes
} from "../base.js"
import { type BasisKind, maybeParseBasis, parseBasis } from "../bases/basis.js"
import {
	type constraintInputsByKind,
	type ConstraintKind,
	type discriminableConstraintSchema,
	parseConstraint
} from "../constraints/constraint.js"
import { Disjoint } from "../disjoint.js"
import {
	type DiscriminableSchema,
	type Node,
	type RuleKind,
	type Schema
} from "../nodes.js"
import { BaseRoot, type Root } from "../root.js"
import { type ParseContext } from "../utils.js"

export type IntersectionInner = withAttributes<{
	readonly intersection: CollapsedIntersectionInner
}>

export type CollapsedIntersectionInner =
	| readonly [Node<BasisKind>, ...Node<ConstraintKind>[]]
	| readonly Node<ConstraintKind>[]

export type IntersectionDeclaration = declareNode<{
	kind: "intersection"
	schema: IntersectionSchema
	inner: IntersectionInner
	intersections: {
		intersection: "intersection" | Disjoint
		rule: "intersection" | Disjoint
	}
	reductions: "intersection" | BasisKind
}>

export class IntersectionNode<t = unknown> extends BaseRoot<
	IntersectionDeclaration,
	t
> {
	static readonly kind = "intersection"
	static readonly declaration: IntersectionDeclaration
	readonly basis: Root<unknown, BasisKind> | undefined =
		this.intersection[0]?.isBasis() ? this.intersection[0] : undefined
	readonly constraints: readonly Node<ConstraintKind>[] = this.basis
		? this.intersection.slice(1)
		: (this.intersection as any)

	constructor(inner: IntersectionInner) {
		super(inner)
		assertValidConstraints(this.basis, this.constraints)
	}

	static readonly definition = this.define({
		kind: "intersection",
		keys: {
			intersection: "in"
		},
		intersections: {
			intersection: (l, r) => {
				let result: IntersectionInner | Disjoint = l
				for (const constraint of r.constraints) {
					if (result instanceof Disjoint) {
						break
					}
					result = intersectRule(result.intersection, constraint)
				}
				return result
			},
			rule: (l, r) => intersectRule(l.intersection, r)
		},
		parseSchema: (schema) => {
			if (isArray(schema)) {
				return {
					intersection: parseListedRules(schema)
				}
			}
			const { alias, description, ...rules } = schema
			const intersectionInner = {} as mutable<IntersectionInner>
			if (alias) {
				intersectionInner.alias = alias
			}
			if (description) {
				intersectionInner.description = description
			}
			intersectionInner.intersection =
				"intersection" in rules
					? parseListedRules(rules.intersection)
					: parseMappedRules(rules)
			return intersectionInner
		},
		reduceToNode: (inner) => {
			if (inner.intersection.length === 1 && inner.intersection[0].isBasis()) {
				// TODO: collapse description?
				return inner.intersection[0]
			}
			return new IntersectionNode(inner)
		},
		compileCondition: (inner) => {
			let condition = inner.intersection
				.map((rule) => rule.condition)
				.join(") && (")
			if (inner.intersection.length > 1) {
				condition = `(${condition})`
			}
			return condition || "true"
		},
		writeDefaultDescription: (inner) => {
			return inner.intersection.length === 0
				? "a value"
				: inner.intersection.join(" and ")
		},
		children: (inner) =>
			Object.values(inner)
				.flat()
				.filter((value): value is Node<RuleKind> => value instanceof BaseNode)
	})
}

const parseListedRules = (
	schemas: CollapsedIntersectionSchema
): CollapsedIntersectionInner => {
	const basis = schemas[0] ? maybeParseBasis(schemas[0]) : undefined
	const rules: mutable<CollapsedIntersectionInner> = basis ? [basis] : []
	const constraintContext: ParseContext = { basis }
	for (let i = basis ? 1 : 0; i < schemas.length; i++) {
		rules.push(parseConstraint(schemas[i] as never, constraintContext))
	}
	return rules
}

const parseMappedRules = ({
	basis: basisSchema,
	...constraintSchemasByKind
}: MappedIntersectionSchema<any> & {
	// at this point each key should be "basis" or a constraint kind
	[k in keyof BaseAttributes]?: never
}): CollapsedIntersectionInner => {
	const basis = basisSchema ? parseBasis(basisSchema) : undefined
	const rules: mutable<CollapsedIntersectionInner> = basis ? [basis] : []
	const constraintContext: ParseContext = { basis }
	for (const k in constraintSchemasByKind) {
		if (!includes(constraintKinds, k)) {
			return throwParseError(`'${k}' is not a valid constraint kind`)
		}
		const schemas = constraintSchemasByKind[k]
		if (isArray(schemas)) {
			rules.push(
				...schemas.map((schema) =>
					BaseNode.classesByKind[k].parse(schema as never, constraintContext)
				)
			)
		} else {
			rules.push(
				BaseNode.classesByKind[k].parse(schemas as never, constraintContext)
			)
		}
	}
	return rules
}

const intersectRule = (
	base: readonly Node<RuleKind>[],
	rule: Node<RuleKind>
): IntersectionInner | Disjoint => {
	const result: Node<RuleKind>[] = []
	let includesConstraint = false
	for (let i = 0; i < base.length; i++) {
		const elementResult = rule.intersect(base[i])
		if (elementResult === null) {
			result.push(base[i])
		} else if (elementResult instanceof Disjoint) {
			return elementResult
		} else if (!includesConstraint) {
			result.push(elementResult)
			includesConstraint = true
		} else if (!base.includes(elementResult)) {
			return throwInternalError(
				`Unexpectedly encountered multiple distinct intersection results for constraint ${elementResult}`
			)
		}
	}
	if (!includesConstraint) {
		result.push(rule)
	}
	return {
		intersection: result as never
	}
}

const assertValidConstraints = (
	basis: Node<BasisKind> | undefined,
	constraints: readonly Node<ConstraintKind>[]
) => {
	for (const constraint of constraints) {
		if (
			!constraint.nodeClass.basis.isUnknown() &&
			(!basis || !basis.extends(constraint.nodeClass.basis))
		) {
			throwParseError(constraint.nodeClass.writeInvalidBasisMessage(basis))
		}
	}
}

export type MappedIntersectionSchema<
	basis extends Schema<BasisKind> = Schema<BasisKind>
> = {
	basis?: basis
} & constraintInputsByKind<parseBasis<basis>["infer"]> &
	BaseAttributes

export type ListedIntersectionSchema<
	basis extends Schema<BasisKind> = Schema<BasisKind>
> = {
	intersection: CollapsedIntersectionSchema<basis>
} & BaseAttributes

export type CollapsedIntersectionSchema<
	basis extends Schema<BasisKind> = Schema<BasisKind>
> =
	| readonly [
			basis,
			// currently unable to infer basis here, but we still include this
			// conditional to avoid a union complexity error that otherwise can
			// occur (remove in future if possible)
			...(parseBasis<basis>["infer"] extends unknown
				? discriminableConstraintSchema<any>[]
				: never[])
	  ]
	| readonly DiscriminableSchema<"predicate">[]

export type IntersectionSchema<
	basis extends Schema<BasisKind> = Schema<BasisKind>
> = ExpandedIntersectionSchema<basis> | CollapsedIntersectionSchema<basis>

export type ExpandedIntersectionSchema<
	basis extends Schema<BasisKind> = Schema<BasisKind>
> = MappedIntersectionSchema<basis> | ListedIntersectionSchema<basis>

type exactBasisMessageOnError<branch, expected> = {
	[k in keyof branch]: k extends keyof expected
		? conform<branch[k], expected[k]>
		: ErrorMessage<`'${k & string}' is not allowed by ${branch[keyof branch &
				BasisKind] extends string
				? `basis '${branch[keyof branch & BasisKind]}'`
				: `this schema's basis`}`>
}

export type validateIntersectionSchema<schema> =
	schema extends ExpandedIntersectionSchema<infer basis>
		? schema extends ListedIntersectionSchema
			? exactMessageOnError<schema, ListedIntersectionSchema<basis>>
			: exactBasisMessageOnError<schema, MappedIntersectionSchema<basis>>
		: IntersectionSchema

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