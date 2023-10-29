import { cached } from "@arktype/util"
import { node } from "./nodes.js"
import { type Root } from "./root.js"

export const builtins = cached(
	() =>
		({
			never: node(),
			unknown: node({}),
			object: node("object"),
			number: node("number"),
			nonVariadicArrayIndex: node("number"),
			arrayIndexTypeNode: node("number"),
			string: node("string"),
			array: node(Array)
		}) satisfies Record<string, Root>
)
