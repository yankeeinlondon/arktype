import { throwParseError } from "@arktype/util"
import type { ConstraintSchema } from "./constraint.js"
import { ConstraintNode } from "./constraint.js"

export interface PatternSchema extends ConstraintSchema {
	source: string
	flags: string
}

export class PatternNode extends ConstraintNode<
	PatternSchema,
	typeof PatternNode
> {
	readonly kind = "regex"

	static parse(input: RegexLiteral | RegExp | PatternSchema) {
		return typeof input === "string"
			? parseRegexLiteral(input)
			: input instanceof RegExp
			? {
					source: input.source,
					flags: input.flags
			  }
			: input
	}

	instance = new RegExp(this.source, this.flags)
	literal = serializeRegex(this.instance)

	hash() {
		return ""
	}

	writeDefaultDescription() {
		return `matched by ${this.literal}`
	}

	// For now, non-equal regex are naively intersected
	reduceWith() {
		return null
	}
}

// converting a regex to a string alphabetizes the flags for us
export const serializeRegex = (regex: RegExp) => `${regex}` as RegexLiteral

export type RegexLiteral = `/${string}/${string}`

const regexLiteralMatcher = /^\/(.+)\/([a-z]*)$/

// export const patternConstraint = (input: PatternInput): PatternDefinition =>
// 	typeof input === "string" ? parseRegexLiteral(input) : input

export const parseRegexLiteral = (literal: string): PatternSchema => {
	const match = regexLiteralMatcher.exec(literal)
	if (!match || !match[1]) {
		return throwParseError(
			`'${literal}' is not a valid RegexLiteral (should be /source/flags)`
		)
	}
	return {
		source: match[1],
		flags: match[2]
	}
}
