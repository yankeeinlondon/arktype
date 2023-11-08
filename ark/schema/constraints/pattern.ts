import { throwParseError } from "@arktype/util"
import { BaseNode, type declareNode, type withAttributes } from "../base.js"
import type { BasisKind } from "../bases/basis.js"
import type { DomainNode } from "../bases/domain.js"
import { builtins } from "../builtins.js"
import { type Node } from "../nodes.js"
import { IntersectionNode } from "../sets/intersection.js"
import {
	type BaseConstraint,
	getBasisName,
	intersectOrthogonalConstraints
} from "./shared.js"

export type PatternInner = withAttributes<{
	readonly pattern: string
	readonly flags: string
}>

export type PatternSchema = RegexLiteral | RegExp | PatternInner

export type PatternDeclaration = declareNode<{
	kind: "pattern"
	schema: PatternSchema
	inner: PatternInner
	intersections: {
		pattern: "pattern" | "intersection"
	}
}>

export class PatternNode
	extends BaseNode<PatternDeclaration>
	implements BaseConstraint
{
	static readonly kind = "pattern"
	static readonly declaration: PatternDeclaration

	readonly implicitBasis: DomainNode<string> = builtins().string

	static readonly definition = this.define({
		kind: "pattern",
		keys: {
			pattern: {},
			flags: {}
		},
		intersections: {
			// For now, non-equal regex are naively intersected
			pattern: (l, r) =>
				new IntersectionNode({
					intersection: [l.implicitBasis, l, r]
				}),
			default: intersectOrthogonalConstraints
		},
		parseSchema: (schema) =>
			typeof schema === "string"
				? parseRegexLiteral(schema)
				: schema instanceof RegExp
				? { pattern: schema.source, flags: schema.flags }
				: schema,
		compileCondition: (inner) =>
			`/${inner.pattern}/${inner.flags}.test(${this.argName})`,
		writeDefaultDescription: (inner) => `matched by ${inner.pattern}`
	})

	static writeInvalidBasisMessage(basis: Node<BasisKind> | undefined) {
		return `Match operand ${getBasisName(basis)} must be a string`
	}
}

// converting a regex to a string alphabetizes the flags for us
export const serializeRegex = (regex: RegExp) => `${regex}` as RegexLiteral

export type RegexLiteral = `/${string}/${string}`

const regexLiteralMatcher = /^\/(.+)\/([a-z]*)$/

export const parseRegexLiteral = (literal: string): PatternInner => {
	const match = regexLiteralMatcher.exec(literal)
	if (!match || !match[1]) {
		return throwParseError(
			`'${literal}' is not a valid RegexLiteral (should be /source/flags)`
		)
	}
	return {
		pattern: match[1],
		flags: match[2]
	}
}
