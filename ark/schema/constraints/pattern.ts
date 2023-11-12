import { throwParseError } from "@arktype/util"
import { type declareNode, defineNode, type withAttributes } from "../base.ts"
import { builtins } from "../builtins.ts"
import { In } from "../io/compile.ts"
import { type ConstraintAttachments } from "./constraint.ts"

export type PatternInner = withAttributes<{
	readonly pattern: string
	readonly flags: string
}>

export type CollapsedPatternSchema = RegexLiteral | RegExp

export type ExpandedPatternSchema = PatternInner

export type PatternDeclaration = declareNode<{
	kind: "pattern"
	collapsedSchema: CollapsedPatternSchema
	expandedSchema: PatternInner
	inner: PatternInner
	intersections: {
		pattern: "pattern" | null
	}
	attach: ConstraintAttachments<string>
}>

export const PatternImplementation = defineNode({
	kind: "pattern",
	keys: {
		pattern: {},
		flags: {}
	},
	intersections: {
		// For now, non-equal regex are naively intersected
		pattern: () => null
	},
	expand: (schema) =>
		typeof schema === "string"
			? parseRegexLiteral(schema)
			: schema instanceof RegExp
			? { pattern: schema.source, flags: schema.flags }
			: schema,
	writeDefaultDescription: (inner) => `matched by ${inner.pattern}`,
	attach: (inner) => ({
		implicitBasis: builtins().string,
		condition: `/${inner.pattern}/${inner.flags}.test(${In})`
	})
})

// readonly implicitBasis: DomainNode<string> = builtins().string

// static writeInvalidBasisMessage(basis: Node<BasisKind> | undefined) {
// 	return `Match operand ${getBasisName(basis)} must be a string`
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
	return {
		pattern: match[1],
		flags: match[2]
	}
}
