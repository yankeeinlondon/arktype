import { throwParseError } from "@arktype/util"
import { In } from "../io/compile.js"
import type { declareNode, withAttributes } from "../shared/declare.js"
import type { RefinementAttachments } from "./refinement.js"
import { defineRefinement } from "./shared.js"

export type PatternInner = withAttributes<{
	readonly pattern: string
	readonly flags?: string
}>

export type PatternSchema = PatternInner | RegexLiteral | RegExp

export type PatternDeclaration = declareNode<{
	kind: "pattern"
	schema: PatternSchema
	inner: PatternInner
	intersections: {
		pattern: "pattern" | null
	}
	attach: RefinementAttachments<string>
}>

export const PatternImplementation = defineRefinement({
	kind: "pattern",
	keys: {
		pattern: {},
		flags: {}
	},
	intersections: {
		// For now, non-equal regex are naively intersected
		pattern: () => null
	},
	normalize: (schema) =>
		typeof schema === "string"
			? parseRegexLiteral(schema)
			: schema instanceof RegExp
			  ? schema.flags
					? { pattern: schema.source, flags: schema.flags }
					: { pattern: schema.source }
			  : schema,
	writeInvalidBasisMessage: writeUnmatchableBasisMessage,
	writeDefaultDescription: (inner) => `matched by ${inner.pattern}`,
	attach: (node) => {
		return {
			implicitBasis: node.cls.builtins.string,
			condition: `/${node.pattern}/${node.flags ?? ""}.test(${In})`
		}
	}
})

export function writeUnmatchableBasisMessage(basis: string) {
	return `Match operand ${basis} must be a string`
}

// static writeInvalidBasisMessage(basis: Node<BasisKind> | undefined) {
// 	return
// }

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
	return match[2]
		? {
				pattern: match[1],
				flags: match[2]
		  }
		: {
				pattern: match[1]
		  }
}
