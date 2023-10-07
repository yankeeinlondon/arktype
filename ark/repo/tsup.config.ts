import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["main.ts"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true
})