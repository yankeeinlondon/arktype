import type { extend } from "@arktype/util"
import type { Disjoint } from "../disjoint.js"
import type { BaseSchema } from "../schema.js"
import { BaseNode } from "../schema.js"
import type {
	BasesByKind,
	BasisClassesByKind,
	BasisInputsByKind
} from "./basis.js"
import type {
	RefinementClassesByKind,
	RefinementInputsByKind,
	RefinementsByKind
} from "./refinement.js"

export type ConstraintClassesByKind = extend<
	BasisClassesByKind,
	RefinementClassesByKind
>

export type ConstraintInputsByKind = extend<
	BasisInputsByKind,
	RefinementInputsByKind
>

export type ConstraintsByKind = extend<BasesByKind, RefinementsByKind>

export type ConstraintKind = keyof ConstraintsByKind

export type Constraint<kind extends ConstraintKind = ConstraintKind> =
	ConstraintsByKind[kind]

export type ConstraintInput<kind extends ConstraintKind = ConstraintKind> =
	ConstraintInputsByKind[kind]

export interface ConstraintSchema extends BaseSchema {}

export abstract class ConstraintNode<
	schema extends ConstraintSchema
> extends BaseNode<schema> {
	reduce(other: Constraint): Constraint | Disjoint | null {
		return this as never
	}

	// TODO: only own keys
	abstract reduceWith(other: Constraint): schema | null | Disjoint
}
