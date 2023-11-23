import { compilePropAccess, compileSerializedValue } from "../../io/compile.js"
import { In, type Problem } from "../../shared/compilation.js"
import type { withAttributes } from "../../shared/declare.js"
import { rootKinds, type RootKind } from "../../shared/define.js"
import { Disjoint } from "../../shared/disjoint.js"
import type { Inner, Node, Schema } from "../../shared/node.js"
import {
	createValidBasisAssertion,
	defineRefinement,
	type declareRefinement
} from "../shared.js"
import type { PropKind } from "./prop.js"
import type { NamedPropAttachments } from "./shared.js"

export type RequiredPropSchema = withAttributes<{
	readonly key: string | symbol
	readonly value: Schema<RootKind>
}>

export type RequiredPropInner = withAttributes<{
	readonly key: string | symbol
	readonly value: Node<RootKind>
}>

export type RequiredDeclaration = declareRefinement<{
	kind: "required"
	schema: RequiredPropSchema
	operands: object
	inner: RequiredPropInner
	intersections: {
		required: "required" | Disjoint | null
		optional: "required" | Disjoint | null
	}
	attach: NamedPropAttachments
}>

const intersectNamed = (
	l: Node<PropKind>,
	r: Node<PropKind>
): Inner<PropKind> | Disjoint | null => {
	if (l.key !== r.key) {
		return null
	}
	const required = l.key
	const value = l.value.intersect(r.value)
	if (value instanceof Disjoint) {
		return value
	}
	return {
		key: required,
		value
	}
}

export const RequiredImplementation = defineRefinement({
	kind: "required",
	keys: {
		key: {},
		value: {
			parse: (schema, ctx) => ctx.cls.parseRootFromKinds(rootKinds, schema)
		}
	},
	operands: ["object"],
	intersections: {
		required: intersectNamed,
		optional: intersectNamed
	},
	normalize: (schema) => schema,
	writeDefaultDescription: (inner) => `${String(inner.key)}: ${inner.value}`,
	attach: (node) => ({
		serializedKey: compileSerializedValue(node.key),
		assertValidBasis: createValidBasisAssertion(node)
	}),
	compile: (node, ctx) => `if(${node.serializedKey} in ${In}) {
		return ${
			node.value.compile({
				...ctx,
				path: [...ctx.path, node.serializedKey]
			}).reference
		}(${In}${compilePropAccess(
			typeof node.key === "string" ? node.key : node.serializedKey
		)}) 
	} else {
		return ${
			ctx.onFail === "true"
				? "true"
				: JSON.stringify([
						{
							path: [...ctx.path, node.serializedKey],
							message: `Must be provided`
						} satisfies Problem
				  ])
		}
	}`
})
