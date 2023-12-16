import { cleanup, setup } from "../attest/main.js"
import { shell } from "../attest/src/shell.js"

process.env.ATTEST_CONFIG = JSON.stringify({ skipTypes: true })
setup()
shell("pnpm vitest run dev/test/*.test.*")
cleanup()
