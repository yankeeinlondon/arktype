import {
	CastableBase,
	CompiledFunction,
	type Dict,
	entriesOf,
	type evaluate,
	type extend,
	hasDomain,
	includes,
	isArray,
	type Json,
	type JsonData,
	type listable,
	type optionalizeKeys,
	ParseError,
	stringify,
	throwInternalError,
	throwParseError
} from "@arktype/util"
import { type BasisKind } from "./bases/basis.ts"
import { type ConstraintKind } from "./constraints/constraint.ts"
import { Disjoint } from "./disjoint.ts"
import { compileSerializedValue, In } from "./io/compile.ts"
import { registry } from "./io/registry.ts"
import { unflattenRules } from "./main.ts"
import {
	type Attachments,
	type ExpandedSchema,
	type Inner,
	type Node,
	type NodeDeclarationsByKind,
	NodeImplementationByKind,
	type NodeKind,
	type reifyIntersections,
	type RootKind,
	type RuleKind,
	type Schema
} from "./nodes.ts"
import { type ValidatorNode } from "./sets/morph.ts"
import { type SetKind } from "./sets/set.ts"
import {
	type parseSchemaBranches,
	type validateSchemaBranch
} from "./sets/union.ts"
import {
	basisKinds,
	constraintKinds,
	createParseContext,
	inferred,
	type OrderedNodeKinds,
	orderedNodeKinds,
	type ParseContext,
	rootKinds,
	ruleKinds,
	setKinds
} from "./utils.ts"

export type BaseAttributes = {
	readonly alias?: string
	readonly description?: string
}

export type withAttributes<o extends object> = extend<BaseAttributes, o>

export type BaseIntersectionMap = {
	[lKey in NodeKind]: evaluate<
		{
			[requiredKey in lKey]:
				| lKey
				| Disjoint
				| (lKey extends ConstraintKind ? null : never)
		} & {
			[rKey in rightOf<lKey> | "default"]?:
				| lKey
				| Disjoint
				| (lKey extends RuleKind ? null : never)
		}
	>
}

export type UnknownNode = BaseNode<any>

export type DeclarationInput<kind extends NodeKind> = {
	kind: kind
	collapsedSchema?: unknown
	expandedSchema: BaseAttributes
	inner: BaseAttributes
	intersections: BaseIntersectionMap[kind]
	attach: Dict
}

export type BaseNodeDeclaration = {
	kind: NodeKind
	collapsedSchema?: unknown
	expandedSchema: BaseAttributes
	inner: BaseAttributes
	intersections: {
		[k in NodeKind | "default"]?: NodeKind | Disjoint | null
	}
	attach: Dict
}

export type declareNode<
	types extends {
		[k in keyof BaseNodeDeclaration]: types extends {
			kind: infer kind extends NodeKind
		}
			? DeclarationInput<kind>[k]
			: never
	} & { [k in Exclude<keyof types, keyof BaseNodeDeclaration>]?: never }
> = types

export type instantiateNodeImplementation<definition> = evaluate<
	definition & {
		keys: {
			[k in keyof BaseAttributes]: NodeKeyDefinition<BaseNodeDeclaration, k>
		}
	}
>

export type InnerKeyDefinitions<d extends BaseNodeDeclaration> = {
	[k in Exclude<keyof d["inner"], keyof BaseAttributes>]: NodeKeyDefinition<
		d,
		k
	>
}

export type RuleAttachments = {
	readonly condition: string
}

export type NodeKeyDefinition<
	d extends BaseNodeDeclaration,
	k extends keyof d["inner"]
> = {
	meta?: true
	children?: readonly NodeKind[]
	parse?: (
		schema: k extends keyof ExpandedSchema<d["kind"]>
			? ExpandedSchema<d["kind"]>[k]
			: undefined,
		ctx: ParseContext
	) => d["inner"][k]
	// require parse or children if we can't guarantee the schema value will be valid on inner
} & (ExpandedSchema<d["kind"]>[k] extends d["inner"][k]
	? {}
	: { parse: {} } | { children: {} })

export type NodeImplementation<d extends BaseNodeDeclaration> = {
	kind: d["kind"]
	keys: InnerKeyDefinitions<d>
	intersections: reifyIntersections<d["kind"], d["intersections"]>
	writeDefaultDescription: (inner: Node<d["kind"]>) => string
	attach: (inner: Node<d["kind"]>) => {
		[k in unsatisfiedAttachKey<d>]: d["attach"][k]
	}
	reduce?: (
		inner: d["inner"]
	) => Node<Extract<RootKind, rightOf<d["kind"]>>> | d["inner"]
	expand?: (
		schema: d["collapsedSchema"] | d["expandedSchema"]
	) => d["expandedSchema"]
	// require expand if collapsedSchema is defined
} & ("collapsedSchema" extends keyof d ? { expand: {} } : {})

type UnknownNodeImplementation = optionalizeKeys<
	instantiateNodeImplementation<
		NodeImplementation<BaseNodeDeclaration> & {
			keys: Dict<string, NodeKeyDefinition<any, any>>
		}
	>,
	"expand"
>

type unsatisfiedAttachKey<d extends BaseNodeDeclaration> = {
	[k in keyof d["attach"]]: k extends keyof d["inner"]
		? d["inner"][k] extends d["attach"][k]
			? never
			: k
		: k
}[keyof d["attach"]]

const $ark = registry()

const defaultValueSerializer = (v: unknown): JsonData => {
	if (
		typeof v === "string" ||
		typeof v === "boolean" ||
		typeof v === "number" ||
		v === null
	) {
		return v
	}
	return compileSerializedValue(v)
}

export class BaseNode<
	kind extends NodeKind = NodeKind,
	t = unknown
> extends CastableBase<Inner<kind> & Attachments<kind>> {
	// TODO: standardize name with type
	declare infer: t;
	declare [inferred]: t

	// static from<const branches extends readonly unknown[]>(
	// 	schema: {
	// 		branches: {
	// 			[i in keyof branches]: validateBranchInput<branches[i]>
	// 		}
	// 	} & ExpandedUnionSchema
	// ) {
	// 	return new UnionNode<inferNodeBranches<branches>>({
	// 		...schema,
	// 		branches: schema.branches.map((branch) => branch as never)
	// 	})
	// }

	static parseConstraint<kind extends ConstraintKind>(
		kind: kind,
		schema: Schema<kind>
	): Node<kind> {
		return this.parseNodeKind(kind, schema) as never
	}

	static parseRoot<kind extends RootKind>(
		schema: Schema<kind>,
		allowed: readonly kind[] = rootKinds as never
	): Node<RootKind & (kind | rightOf<kind>)> {
		return this.parseNode(allowed, schema) as never
	}

	protected static parseNode(
		allowed: readonly NodeKind[],
		schema: unknown
	): UnknownNode {
		// constraints should only ever have one kind
		if (allowed.length === 1) {
			return this.parseNodeKind(allowed[0], schema)
		}
		const kind = this.rootKindOfSchema(schema as never)
		if (!includes(allowed, kind)) {
			return throwParseError(
				`Schema ${stringify(
					schema
				)} of kind ${kind} is not allowed here. Valid kinds are: ${allowed}`
			)
		}
		return this.parseNodeKind(kind, schema) as never
	}

	protected static parseNodeKind(
		kind: NodeKind,
		schema: unknown
		// TODO: reducible
	): UnknownNode {
		if (schema instanceof BaseNode && schema.kind === kind) {
			return schema
		}
		const implementation: UnknownNodeImplementation = NodeImplementationByKind[
			kind
		] as never
		const expandedSchema = implementation.expand?.(schema) ?? schema
		const keyDefinitions = implementation.keys
		const inner: Record<string, any> = {}
		const ctx = createParseContext()
		for (const [k, v] of Object.entries(expandedSchema as Dict)) {
			if (!keyDefinitions[k]) {
				return throwParseError(`Key ${k} is not valid on ${kind} schema`)
			}
			const keyDefinition = keyDefinitions[k]
			if (keyDefinition.children) {
				inner[k] = isArray(v)
					? v.map((childSchema) =>
							this.parseNode(keyDefinition.children!, childSchema)
					  )
					: this.parseNode(keyDefinition.children, v)
			} else if (keyDefinition.parse) {
				inner[k] = keyDefinition.parse(v, ctx)
			} else {
				inner[k] = v
			}
		}
		const reducedInner = implementation.reduce?.(inner) ?? inner
		return reducedInner instanceof BaseNode
			? reducedInner
			: new BaseNode(kind, reducedInner)
	}

	static parseUnits<const branches extends readonly unknown[]>(
		values: branches
	) {
		const uniqueValues: unknown[] = []
		for (const value of values) {
			if (!uniqueValues.includes(value)) {
				uniqueValues.push(value)
			}
		}
		return new BaseNode<"union", branches[number]>("union", {
			union: uniqueValues.map((unit) => new BaseNode("unit", { is: unit }))
		})
	}

	protected readonly implementation: UnknownNodeImplementation
	readonly ctor = BaseNode
	readonly alias: string
	readonly description: string
	readonly json: Json
	readonly typeJson: Json
	protected collapsibleJson: Json
	readonly children: UnknownNode[]
	readonly entries: entriesOf<Inner<kind>>
	readonly id: string
	readonly typeId: string
	readonly includesMorph: boolean
	readonly references: readonly UnknownNode[]
	readonly contributesReferences: readonly UnknownNode[]
	readonly allows: (data: unknown) => data is t

	private constructor(
		public kind: kind,
		public inner: Inner<kind>
	) {
		super()
		this.alias = $ark.register(this, this.inner.alias)
		this.implementation = NodeImplementationByKind[kind] as never
		this.entries = entriesOf(this.inner)
		this.json = {}
		this.typeJson = {}
		this.children = []
		for (const [k, v] of this.entries) {
			if (!(k in this.implementation.keys)) {
				throw new ParseError(`'${k}' is not a valid ${this.kind} key`)
			}
			const keyDefinition = (
				this.implementation.keys as InnerKeyDefinitions<any>
			)[k]
			if (keyDefinition.children) {
				const children = v as listable<UnknownNode>
				if (isArray(children)) {
					this.json[k] = children.map((child) => child.collapsibleJson)
					this.typeJson[k] = children.map((child) => child.collapsibleJson)
					this.children.push(...children)
				} else {
					this.json[k] = children.collapsibleJson
					this.typeJson[k] = children.collapsibleJson
					this.children.push(children)
				}
			} else {
				this.json[k] = defaultValueSerializer(v)
				if (!keyDefinition.meta) {
					this.typeJson[k] = this.json[k]
				}
			}
			if (this[k] !== undefined) {
				// if we attempt to overwrite an existing node key, throw unless
				// it is expected and can be safely ignored.
				if (k !== "in" && k !== "out") {
					throwInternalError(
						`Unexpected attempt to overwrite existing node key ${k} from ${kind} inner`
					)
				}
			} else {
				this[k] = v as never
			}
		}
		if (
			this.entries.length === 1 &&
			// the presence expand function indicates a single default key that is collapsible
			// this helps avoid nodes like `unit` which would otherwise be indiscriminable
			this.implementation.expand
		) {
			this.collapsibleJson = this.json[kind] as never
			if (hasDomain(this.collapsibleJson, "object")) {
				this.json = this.collapsibleJson
				this.typeJson = this.collapsibleJson
			}
		} else {
			this.collapsibleJson = this.json
		}
		this.id = JSON.stringify(this.json)
		this.typeId = JSON.stringify(this.typeJson)
		this.includesMorph =
			this.kind === "morph" ||
			this.children.some((child) => child.includesMorph)
		this.references = this.children.flatMap(
			(child) => child.contributesReferences
		)
		this.contributesReferences = [this, ...this.references]
		const attachments = this.implementation.attach(this as never)
		// important this is last as writeDefaultDescription could rely on attached
		Object.assign(this, attachments)
		this.allows = new CompiledFunction(
			In,
			this.isRule()
				? `return ${this.condition}`
				: (this as {} as Node<SetKind>).compile({
						successKind: "true",
						failureKind: "false"
				  })
		)
		this.description =
			this.inner.description ??
			this.implementation.writeDefaultDescription(this as never)
	}

	inCache?: UnknownNode;
	get in(): this["kind"] extends "morph" ? ValidatorNode : UnknownNode {
		if (!this.inCache) {
			this.inCache = this.getIo("in")
		}
		return this.inCache as never
	}

	outCache?: UnknownNode
	get out(): this["kind"] extends "morph" ? ValidatorNode : UnknownNode {
		if (!this.outCache) {
			this.outCache = this.getIo("out")
		}
		return this.outCache as never
	}

	private getIo(kind: "in" | "out"): UnknownNode {
		if (!this.includesMorph) {
			return this
		}
		const ioInner: Record<string, unknown> = {}
		for (const [k, v] of this.entries) {
			const keyDefinition = this.implementation.keys[k as keyof BaseAttributes]!
			if (keyDefinition.children) {
				ioInner[k] = Array.isArray(v)
					? v.map((child) => child[kind])
					: (v as UnknownNode)[kind]
			} else if (!keyDefinition.meta) {
				ioInner[k] = this.inner[k]
			}
		}
		return BaseNode.parseRoot(ioInner) as never
	}

	toJSON() {
		return this.json
	}

	equals(other: UnknownNode) {
		return this.typeId === other.typeId
	}

	hasKind<kind extends NodeKind>(kind: kind): this is Node<kind> {
		return this.kind === (kind as never)
	}

	isBasis(): this is Node<BasisKind> {
		return includes(basisKinds, this.kind)
	}

	isConstraint(): this is Node<ConstraintKind> {
		return includes(constraintKinds, this.kind)
	}

	isRule(): this is Node<RuleKind> {
		return includes(ruleKinds, this.kind)
	}

	isSet(): this is Node<SetKind> {
		return includes(setKinds, this.kind)
	}

	toString() {
		return this.description
	}

	// TODO: add input kind, caching
	intersect<other extends Node>(
		other: other
	): intersectionOf<kind, other["kind"]>
	intersect(other: UnknownNode): UnknownNode | Disjoint {
		const closedResult = this.intersectClosed(other as never)
		if (closedResult !== null) {
			return closedResult as UnknownNode | Disjoint
		}
		if (!this.isRule() || !other.isRule()) {
			return throwInternalError(
				`Unexpected null intersection between non-rules ${this.kind} and ${other.kind}`
			)
		}
		return new BaseNode("intersection", unflattenRules([this as never, other]))
	}

	intersectClosed<other extends Node>(
		other: other
	): BaseNode<kind> | Node<other["kind"]> | Disjoint | null {
		if (this.equals(other)) {
			// TODO: meta
			return this as never
		}
		const l = leftOperandOf(this, other)
		const thisIsLeft = l === this
		const r: UnknownNode = thisIsLeft ? other : this
		const intersections = l.implementation.intersections
		const intersector = (intersections as any)[r.kind] ?? intersections.default
		const result = intersector?.(l, r)
		if (result) {
			if (result instanceof Disjoint) {
				return thisIsLeft ? result : result.invert()
			}
			// TODO: meta
			return BaseNode.parseNodeKind(l.kind, result)
		}
		return null
	}

	constrain<constraintKind extends ConstraintKind>(
		this: Node<RootKind>,
		kind: constraintKind,
		definition: Schema<constraintKind>
	): Exclude<intersectionOf<this["kind"], constraintKind>, Disjoint> {
		const result = this.intersect(
			new BaseNode(kind, definition as never) as {} as Node
		)
		return result instanceof Disjoint ? result.throw() : (result as never)
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
	): Exclude<intersectionOf<kind, other["kind"]>, Disjoint> {
		const result = this.intersect(other)
		return result instanceof Disjoint ? result.throw() : (result as never)
	}

	or<other extends Node>(
		other: other
	): Node<
		"union" | Extract<kind | other["kind"], RootKind>,
		t | other["infer"]
	> {
		return this as never
	}

	isUnknown(): this is BaseNode<"intersection", unknown> {
		return this.hasKind("intersection") && this.children.length === 0
	}

	isNever(): this is BaseNode<"union", never> {
		return this.hasKind("union") && this.children.length === 0
	}

	getPath() {
		return this
	}

	array(): BaseNode<"intersection", t[]> {
		return this as never
	}

	extends<other extends Node>(
		other: other
	): this is Node<kind, other["infer"]> {
		const intersection = this.intersect(other)
		return (
			!(intersection instanceof Disjoint) && this.equals(intersection as never)
		)
	}

	static rootKindOfSchema(schema: Schema<RootKind>): RootKind {
		switch (typeof schema) {
			case "string":
				return "domain"
			case "function":
				return "proto"
			case "object":
				if (schema instanceof BaseNode) {
					if (!includes(rootKinds, schema.kind)) {
						break
					}
					return schema.kind
				} else if ("domain" in schema) {
					return "domain"
				} else if ("proto" in schema) {
					return "proto"
				} else if ("is" in schema) {
					return "unit"
				} else if ("morph" in schema) {
					return "morph"
				} else if ("union" in schema || isArray(schema)) {
					return "union"
				}
				return "intersection"
		}
		return throwParseError(`${typeof schema} is not a valid schema type`)
	}

	static builtins = {
		never: new BaseNode<"union", never>("union", { union: [] }),
		unknown: new BaseNode<"intersection", unknown>("intersection", {}),
		object: new BaseNode<"domain", object>("domain", {
			domain: "object"
		}),
		number: new BaseNode<"domain", number>("domain", {
			domain: "number"
		}),
		string: new BaseNode<"domain", string>("domain", {
			domain: "string"
		}),
		array: new BaseNode<"proto", readonly unknown[]>("proto", {
			proto: Array
		}),
		date: new BaseNode<"proto", Date>("proto", { proto: Date })
	}
}

export type Builtins = typeof BaseNode.builtins

export type NodeParser = {
	<branches extends readonly unknown[]>(
		...branches: {
			[i in keyof branches]: validateSchemaBranch<branches[i]>
		}
	): parseSchemaBranches<branches>
}

const parseRoot: NodeParser = (...branches) =>
	BaseNode.parseRoot(branches) as never

const parseUnits = <const branches extends readonly unknown[]>(
	...values: branches
) => BaseNode.parseUnits(values)

export const node = Object.assign(parseRoot, {
	units: parseUnits
})

const leftOperandOf = (l: UnknownNode, r: UnknownNode) => {
	for (const kind of orderedNodeKinds) {
		if (l.kind === kind) {
			return l
		} else if (r.kind === kind) {
			return r
		}
	}
	return throwInternalError(
		`Unable to order unknown node kinds '${l.kind}' and '${r.kind}'.`
	)
}

export type rightOf<kind extends NodeKind> = RightsByKind[kind]

export type RightsByKind = accumulateRightKinds<OrderedNodeKinds, {}>

type accumulateRightKinds<
	remaining extends readonly NodeKind[],
	result
> = remaining extends readonly [
	infer head extends NodeKind,
	...infer tail extends NodeKind[]
]
	? accumulateRightKinds<tail, result & { [k in head]: tail[number] }>
	: result

export type IntersectionMaps = {
	[k in NodeKind]: NodeDeclarationsByKind[k]["intersections"]
}

export type intersectionOf<l extends NodeKind, r extends NodeKind> = [
	l,
	r
] extends [r, l]
	? instantiateIntersection<l>
	: asymmetricIntersectionOf<l, r> | asymmetricIntersectionOf<r, l>

type asymmetricIntersectionOf<
	l extends NodeKind,
	r extends NodeKind
> = l extends unknown
	? r extends unknown
		? r extends keyof IntersectionMaps[l]
			? instantiateIntersection<IntersectionMaps[l][r]>
			: "default" extends keyof IntersectionMaps[l]
			? r extends rightOf<l>
				? instantiateIntersection<IntersectionMaps[l]["default"]>
				: never
			: never
		: r
	: never

type instantiateIntersection<result> = result extends NodeKind
	? Node<result>
	: result
