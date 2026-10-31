// Load biến môi trường cho script chạy bằng tsx (không có Vite).
// Ưu tiên: biến đã set sẵn trong shell > sanity-studio/.env.local > .env ở gốc repo.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STUDIO_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(STUDIO_ROOT, '..')

function parseEnvFile(file: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!fs.existsSync(file)) return out
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    // bỏ dấu nháy bao ngoài nếu có
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

export function loadScriptEnv(): void {
  const files = [
    path.join(REPO_ROOT, '.env'),
    path.join(STUDIO_ROOT, '.env.local'),
    path.join(STUDIO_ROOT, '.env'),
  ]
  for (const file of files) {
    for (const [key, value] of Object.entries(parseEnvFile(file))) {
      if (!(key in process.env)) process.env[key] = value
    }
  }
}
