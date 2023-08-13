import type {
	AbstractableConstructor,
	extend,
	PickPartial
} from "@arktype/util"
import type { UniversalAttributes } from "./attributes/attribute.js"
import type { DivisorConstraint } from "./constraints/divisibility.js"
import type {
	DomainConstraint,
	NonEnumerableDomain
} from "./constraints/domain.js"
import type { IdentityConstraint } from "./constraints/identity.js"
import type { InstanceOfConstraint } from "./constraints/instanceOf.js"
import type { NarrowConstraint } from "./constraints/narrow.js"
import type { PropConstraint } from "./constraints/prop/prop.js"
import type { RangeConstraint } from "./constraints/range.js"
import type { PatternConstraint } from "./constraints/regex.js"
import { Disjoint } from "./disjoint.js"
import { BaseNode } from "./node.js"
import { assertOverlapping } from "./utils.js"

export class PredicateNode extends BaseNode<{
	rule: ConstraintsByKind
	attributes: {}
	intersections: Disjoint
}> {
	readonly kind = "predicate"

	static from(constraints: ConstraintsByKind, attributes: UniversalAttributes) {
		return new PredicateNode(constraints, attributes)
	}

	// readonly references: readonly TypeNode[] = this.props?.references ?? []

	writeDefaultDescription() {
		const flat = Object.values(this.rule).flat()
		return flat.join(" and ")
	}

	intersectRules(other: PredicateNode): ConstraintsByKind | Disjoint {
		const intersection: ConstraintsByKind = { ...this.rule, ...other.rule }
		let k: ConstraintKind
		for (k in intersection) {
			if (k in this.rule && k in other.rule) {
				const subresult = this.rule[k].intersect(other.rule[k] as never)
				if (subresult instanceof Disjoint) {
					return subresult
				}
				// TODO: narrow record type to kinds so this isn't casted
				intersection[k] = subresult as never
			}
		}
		return intersection
	}

	constrain(constraint: Constraint): PredicateNode {
		const result =
			constraint.kind in this.rule
				? assertOverlapping(this.rule[constraint.kind].intersect(constraint))
				: constraint
		return new PredicateNode(
			{
				...this.rule,
				[constraint.kind]: result
			},
			this.attributes
		)
	}

	// keyof(): TypeNode {
	// 	if (!this.basis) {
	// 		return builtins.never()
	// 	}
	// 	const propsKey = this.props?.keyof()
	// 	return propsKey?.or(this.basis.keyof()) ?? this.basis.keyof()
	// }
}

// throwParseError(
//     `'${k}' is not a valid constraint name (must be one of ${Object.keys(
//         constraintsByPrecedence
//     ).join(", ")})`
// )

export type ConstraintsByKind = Readonly<{
	identity: IdentityConstraint
	domain: DomainConstraint
	instanceOf: InstanceOfConstraint
	divisor: DivisorConstraint
	range: RangeConstraint
	pattern: PatternConstraint
	prop: PropConstraint
	narrow: NarrowConstraint
}>

export type UnitConstraints = Pick<ConstraintsByKind, "identity">

export type UnknownConstraints = PickPartial<ConstraintsByKind, "narrow">

export type DomainConstraints<
	domain extends NonEnumerableDomain = NonEnumerableDomain
> = extend<UnknownConstraints, Pick<ConstraintsByKind, "domain">>

export type NumberConstraints = extend<
	DomainConstraints<"number">,
	PickPartial<ConstraintsByKind, "range" | "divisor">
>

export type InstanceConstraints<
	constructor extends AbstractableConstructor = AbstractableConstructor
> = extend<
	DomainConstraints<"object">,
	{ readonly instance: InstanceOfConstraint }
>

export type StringConstraints = extend<
	DomainConstraints<"string">,
	PickPartial<ConstraintsByKind, "range" | "pattern">
>

// TODO: add minLength prop that would result from collapsing types like [...number[], number]
// to a single variadic number prop with minLength 1
// Figure out best design for integrating with named props.
export type ArrayConstraints = extend<
	InstanceConstraints<typeof Array>,
	{
		readonly range?: RangeConstraint
		readonly prefix?: readonly BaseNode[]
		readonly variadic?: BaseNode
		readonly postfix?: readonly BaseNode[]
	}
>

export type DateConstraints = extend<
	InstanceConstraints<typeof Date>,
	{
		readonly range?: RangeConstraint
	}
>

// // TODO: naming
// export const constraintsByPrecedence: Record<
// 	BasisKind | RefinementKind,
// 	number
// > = {
// 	// basis
// 	domain: 0,
// 	class: 0,
// 	unit: 0,
// 	// shallow
// 	bound: 1,
// 	divisor: 1,
// 	regex: 1,
// 	// deep
// 	props: 2,
// 	// narrow
// 	narrow: 3
// }

// TODO: make sure in cases like range, the result is sorted
// const addConstraint = (
// 	members: readonly ConstraintSet[],
// 	constraint: ConstraintSet
// ) => {
// 	const result: ConstraintSet[] = []
// 	let includesConstraint = false
// 	for (let i = 0; i < members.length; i++) {
// 		const elementResult = members[i].intersect(constraint as never)
// 		if (elementResult === (orthogonal as never)) {
// 			result.push(members[i])
// 		} else if (elementResult instanceof Disjoint) {
// 			return elementResult
// 		} else if (!includesConstraint) {
// 			result.push(elementResult)
// 			includesConstraint = true
// 		} else if (!result.includes(elementResult)) {
// 			return throwInternalError(
// 				`Unexpectedly encountered multiple distinct intersection results for constraint ${elementResult}`
// 			)
// 		}
// 	}
// 	if (!includesConstraint) {
// 		result.push(constraint)
// 	}
// 	return result
// }
