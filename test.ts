/* eslint-disable @typescript-eslint/no-restricted-imports */
import { node } from "./ark/schema/main.js"

// 2, 3, 6, 9
const l = node(
	{
		divisor: 2,
		domain: "number"
	},
	{
		domain: "number",
		divisor: 5
	}
)

const n = node("number")

console.log(n.allows.toString())

const o = n.allows(5) //?

const f = n.allows(true) //?

n.json //?

// z.condition //?

// // const result = compile(l) //?

// l.json //?
