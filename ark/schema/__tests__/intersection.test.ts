import { attest } from "@arktype/attest"
import { rootNode, schema, type TypeNode } from "@arktype/schema"
import { wellFormedNumberMatcher } from "@arktype/util"
import type { Disjoint } from "../shared/disjoint.js"

describe("intersections", () => {
	it("parse pattern", () => {
		const t = schema({ basis: "string", pattern: ".*" })
		attest<TypeNode<string, "intersection">>(t)
		attest(t.json).snap({ basis: "string", pattern: [".*"] })
	})
	it("multiple constraints", () => {
		const l = schema({
			basis: "number",
			divisor: 3,
			min: 5
		})
		const r = schema({
			basis: "number",
			divisor: 5
		})
		const result = l.and(r)
		attest(result.json).snap({
			basis: "number",
			divisor: 15,
			min: 5
		})
	})
	it("union", () => {
		const l = schema(
			{
				basis: "number",
				divisor: 2
			},
			{
				basis: "number",
				divisor: 3
			}
		)
		const r = schema({
			basis: "number",
			divisor: 5
		})
		const result = l.and(r)
		attest(result.json).snap([
			{ basis: "number", divisor: 10 },
			{ basis: "number", divisor: 15 }
		])
	})
	it("in/out", () => {
		const parseNumber = schema({
			in: {
				basis: "string",
				pattern: wellFormedNumberMatcher,
				description: "a well-formed numeric string"
			},
			morph: (s: string) => parseFloat(s)
		})
		attest(parseNumber.in.json).snap({
			basis: "string",
			pattern: ["^(?!^-0$)-?(?:0|[1-9]\\d*)(?:\\.\\d*[1-9])?$"],
			description: "a well-formed numeric string"
		})
		attest(parseNumber.out.json).snap({})
	})
	it("reduces union", () => {
		const n = schema("number", {}, { unit: 5 })
		attest(n.json).snap({})
	})
	it("in/out union", () => {
		const n = schema(
			{
				in: "string",
				morph: (s: string) => parseFloat(s)
			},
			"number"
		)
		attest(n.in.json).snap(["number", "string"])
		attest(n.out.json).snap({})
	})
	it("errors on unknown intersection key", () => {
		// @ts-expect-error
		attest(() => schema({ foo: "bar", description: "baz" }))
			.throws.snap("Error: Key foo is not valid on intersection schema")
			.type.errors.snap("Type 'string' is not assignable to type 'never'.")
	})
	// TODO: Error here
	// it("errors on unknown morph key", () => {
	// 	// @ts-expect-error
	// 	attest(() => schema({ morph: () => true, foo: "string" }))
	// 		.throws.snap()
	// 		.type.errors.snap()
	// })
	it("union of all types reduced to unknown", () => {
		const n = schema(
			"string",
			"number",
			"object",
			"bigint",
			"symbol",
			{ unit: true },
			{ unit: false },
			{ unit: null },
			{ unit: undefined }
		)
		attest(n.json).snap({})
	})
	it("normalizes refinement order", () => {
		const l = schema({
			basis: "number",
			divisor: 3,
			min: 5
		})
		const r = schema({
			basis: "number",
			min: 5,
			divisor: 3
		})
		attest(l.innerId).equals(r.innerId)
	})
	it("normalizes prop order", () => {
		const l = schema({
			basis: "object",
			required: [
				{ key: "a", value: "string" },
				{ key: "b", value: "number" }
			]
		})
		const r = schema({
			basis: "object",
			required: [
				{ key: "b", value: "number" },
				{ key: "a", value: "string" }
			]
		})
		attest(l.innerId).equals(r.innerId)
	})
	it("normalizes union order", () => {
		const l = schema("number", "string")
		const r = schema("string", "number")
		attest(l.innerId).equals(r.innerId)
	})
	it("doesn't normalize ordered unions", () => {
		const l = schema.union({
			branches: ["string", "number"],
			ordered: true
		})
		const r = schema.union({
			branches: ["number", "string"],
			ordered: true
		})
		attest(l.equals(r)).equals(false)
	})
	it("orthogonal refinements intersect as null", () => {
		const l = rootNode("divisor", 5)
		const r = rootNode("max", 100)
		const result = l.intersect(r)
		attest<null>(result).equals(null)
	})
	it("possibly disjoint refinements", () => {
		const l = rootNode("min", 2)
		const r = rootNode("max", 1)
		const lrResult = l.intersect(r)
		attest<Disjoint | null>(lrResult)
		const rlResult = r.intersect(l)
		attest<Disjoint | null>(rlResult)
	})
	it("doesn't equate optional and required props", () => {
		const l = rootNode("required", { key: "a", value: "number" })
		const r = rootNode("optional", { key: "a", value: "number" })
		attest(l.equals(r)).equals(false)
	})
	it("compiles allows", () => {
		const n = schema({
			basis: "number",
			divisor: 3,
			min: 5
		})
		attest(n.traverse(6)).snap(true)
		attest(n.traverse(7)).snap(false)
	})
	it("compiles problems", () => {
		const n = schema({
			basis: "number",
			divisor: 3,
			min: 5
		})
		attest(n.apply(6)).snap({ data: 6 })
		attest(n.apply(7).problems?.summary).snap("Must be a multiple of 3")
	})
	it("compiles path problems", () => {
		const n = schema({
			basis: "object",
			required: {
				key: "a",
				value: {
					basis: "number",
					divisor: 3,
					min: 5
				}
			}
		})
		attest(n.apply({ a: 6 })).snap({ data: { a: 6 } })
		attest(n.apply({ b: 6 }).problems?.summary).snap("Must be provided")
		attest(n.apply({ a: 7 }).problems?.summary).snap(
			"a must be a multiple of 3"
		)
	})
	it("runtime benchmark", () => {
		const validInput = {
			number: 1,
			negNumber: -1,
			maxNumber: Number.MAX_VALUE,
			string: "string",
			longString:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivendum intellegat et qui, ei denique consequuntur vix. Semper aeterno percipit ut his, sea ex utinam referrentur repudiandae. No epicuri hendrerit consetetur sit, sit dicta adipiscing ex, in facete detracto deterruisset duo. Quot populo ad qui. Sit fugit nostrum et. Ad per diam dicant interesset, lorem iusto sensibus ut sed. No dicam aperiam vis. Pri posse graeco definitiones cu, id eam populo quaestio adipiscing, usu quod malorum te. Ex nam agam veri, dicunt efficiantur ad qui, ad legere adversarium sit. Commune platonem mel id, brute adipiscing duo an. Vivendum intellegat et qui, ei denique consequuntur vix. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
			boolean: true,
			deeplyNested: {
				foo: "bar",
				num: 1,
				bool: false
			}
		}

		const invalidInput = {
			number: 1,
			negNumber: -1,
			maxNumber: Number.MAX_VALUE,
			string: "string",
			longString:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivendum intellegat et qui, ei denique consequuntur vix. Semper aeterno percipit ut his, sea ex utinam referrentur repudiandae. No epicuri hendrerit consetetur sit, sit dicta adipiscing ex, in facete detracto deterruisset duo. Quot populo ad qui. Sit fugit nostrum et. Ad per diam dicant interesset, lorem iusto sensibus ut sed. No dicam aperiam vis. Pri posse graeco definitiones cu, id eam populo quaestio adipiscing, usu quod malorum te. Ex nam agam veri, dicunt efficiantur ad qui, ad legere adversarium sit. Commune platonem mel id, brute adipiscing duo an. Vivendum intellegat et qui, ei denique consequuntur vix. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
			boolean: true,
			deeplyNested: {
				foo: "bar",
				num: 1,
				bool: 5
			}
		}

		const arkType = schema({
			basis: "object",
			required: [
				{ key: "number", value: "number" },
				{ key: "negNumber", value: "number" },
				{ key: "maxNumber", value: "number" },
				{ key: "string", value: "string" },
				{ key: "longString", value: "string" },
				{ key: "boolean", value: [{ unit: true }, { unit: false }] },
				{
					key: "deeplyNested",
					value: {
						basis: "object",
						required: [
							{ key: "foo", value: "string" },
							{ key: "num", value: "number" },
							{ key: "bool", value: [{ unit: true }, { unit: false }] }
						]
					}
				}
			]
		})
		attest(arkType.traverse(validInput)).equals(true)
		attest(arkType.traverse(invalidInput)).equals(false)
	})
	// TODO:
	// it("strict intersection", () => {
	// 	const T = type(
	// 		{
	// 			a: "number",
	// 			b: "number"
	// 		},
	// 		{ keys: "strict" }
	// 	)
	// 	const U = type(
	// 		{
	// 			a: "number"
	// 		},
	// 		{ keys: "strict" }
	// 	)

	// 	const i = intersection(T, U)
	// 	//  const i: Type<{ a: number; b: number;}>
	// })
})
