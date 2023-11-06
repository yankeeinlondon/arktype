import * as assert from "node:assert/strict"
import { rmSync } from "node:fs"
import { join } from "node:path"
import { attest } from "@arktype/attest"
import { dirName, readJson, writeJson } from "@arktype/fs"
import { afterEach, beforeEach, describe, test } from "mocha"
import { attestInternal } from "../../assert/attest.js"
const testDir = dirName()
const testFile = "externalSnapshots.test.ts"
const o = { re: "do" }

const defaultFileName = "assert.snapshots.json"
const defaultSnapPath = join(testDir, defaultFileName)
const defaultSnapFileContents = {
	[testFile]: {
		toFile: {
			re: "do"
		},
		toFileUpdate: {
			re: "oldValue"
		}
	}
}

const customFileName = "custom.snapshots.json"
const customSnapPath = join(testDir, customFileName)
const defaultSnapContentsAtCustomPath = {
	[testFile]: {
		toCustomFile: { re: "do" }
	}
}

describe("snapToFile", () => {
	beforeEach(() => {
		writeJson(defaultSnapPath, defaultSnapFileContents)
		writeJson(customSnapPath, defaultSnapContentsAtCustomPath)
	})

	afterEach(() => {
		rmSync(defaultSnapPath, { force: true })
		rmSync(customSnapPath, { force: true })
	})

	test("create", () => {
		attest(o).snap.toFile("toFile")
		assert.throws(
			() => attest({ re: "kt" }).snap.toFile("toFile"),
			assert.AssertionError,
			"kt"
		)
		attest(1337).snap.toFile("toFileNew")
		const contents = readJson(defaultSnapPath)
		attest(contents).equals({
			[testFile]: {
				...defaultSnapFileContents[testFile],
				toFileNew: 1337
			}
		})
	})
	test("update existing", () => {
		attestInternal(
			{ re: "dew" },
			{ cfg: { updateSnapshots: true } }
		).snap.toFile("toFileUpdate")
		const updatedContents = readJson(defaultSnapPath)
		const expectedContents = {
			[testFile]: {
				...defaultSnapFileContents[testFile],
				toFileUpdate: { re: "dew" }
			}
		}
		assert.deepEqual(updatedContents, expectedContents)
	})

	test("with path", () => {
		attest(o).snap.toFile("toCustomFile", {
			path: customFileName
		})
		assert.throws(
			() =>
				attest({ re: "kt" }).snap.toFile("toCustomFile", {
					path: customFileName
				}),
			assert.AssertionError,
			"kt"
		)
		attest(null).snap.toFile("toCustomFileNew", {
			path: customFileName
		})
		const contents = readJson(customSnapPath)
		attest(contents).equals({
			[testFile]: {
				...defaultSnapContentsAtCustomPath[testFile],
				toCustomFileNew: null
			}
		})
	})
})