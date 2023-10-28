import {
	type BaseAttributes,
	BaseNode,
	type IntersectionResult,
	type NodeDeclaration,
	type StaticBaseNode,
	type UnknownNode
} from "./base.js"
import { builtins } from "./builtins.js"
import type { ConstraintKind } from "./constraints/constraint.js"
import { Disjoint } from "./disjoint.js"
import { constraintClassesByKind } from "./intersection.js"
import { type Node, type Root, type RootKind, type Schema } from "./node.js"

export interface StaticRootNode<declaration extends NodeDeclaration>
	extends StaticBaseNode<declaration> {}

export abstract class RootNode<
	declaration extends NodeDeclaration,
	t = unknown
> extends BaseNode<declaration, t> {
	constrain<kind extends ConstraintKind>(
		kind: kind,
		definition: Schema<kind>
	): Root {
		const result: Disjoint | Node<RootKind> = this.intersect(
			(constraintClassesByKind[kind].from as any)(definition)
		)
		return result instanceof Disjoint ? result.throw() : result
	}

	keyof() {
		return this
		// return this.rule.reduce(
		// 	(result, branch) => result.and(branch.keyof()),
		// 	builtins.unknown()
		// )
	}

	// TODO: inferIntersection
	and<other extends Node>(
		other: other
	): IntersectionResult<this["kind"], other["kind"]> {
		const result = this.intersect(other)
		return result instanceof Disjoint ? result.throw() : (result as never)
	}

	or<other extends UnknownNode>(
		other: other
	): Root<
		t | other["infer"],
		"union" | this["kind"] | (other["kind"] & RootKind)
	> {
		return this as never
	}

	isUnknown(): this is Root<unknown> {
		return this.equals(builtins.unknown())
	}

	isNever(): this is Root<never> {
		return this.equals(builtins.never())
	}

	getPath() {
		return this
	}

	array(): Root<t[]> {
		return this as never
	}

	extends<other>(other: Root<other>): this is Root<other> {
		const intersection = this.intersect(other)
		return !(intersection instanceof Disjoint) && this.equals(intersection)
	}
}
