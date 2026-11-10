#!/usr/bin/env node
// Start Claude Code in live Resend mode, on Windows, macOS or Linux.
// Reads .env from the project root, adds its values to this process only,
// then runs `claude`. Nothing is saved to your system environment.
//
// Usage:  node scripts/claude-live.mjs [any claude arguments]

import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

function fail(message) {
  console.error(`claude-live: ${message}`);
  process.exit(1);
}

if (!existsSync(envPath)) {
  fail('no .env file found. Copy .env.example to .env and fill in your values.');
}

// Simple KEY=VALUE parser: skips blank lines and # comments, strips quotes.
const values = {};
for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const text = line.trim();
  if (!text || text.startsWith('#')) continue;
  const eq = text.indexOf('=');
  if (eq === -1) continue;
  const key = text.slice(0, eq).trim();
  let value = text.slice(eq + 1).trim();
  if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
  values[key] = value;
}

const key = values.RESEND_API_KEY || '';
if (!key.startsWith('re_') || key === 're_your_key_here') {
  fail('RESEND_API_KEY in .env is missing or still the placeholder.');
}
if (!values.MY_EMAIL || values.MY_EMAIL === 'you@example.com') {
  fail('MY_EMAIL in .env is missing or still the placeholder.');
}
values.RESEND_BASE_URL ||= 'https://api.resend.com';

console.log(`claude-live: LIVE mode. Real emails go out via ${values.RESEND_BASE_URL}.`);
console.log(`claude-live: the send guard allows only ${values.MY_EMAIL} and @resend.dev.`);

// On Windows, npm installs claude as claude.cmd, which needs a shell to run.
const child = spawn('claude', process.argv.slice(2), {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, ...values },
  shell: process.platform === 'win32',
});
child.on('error', (err) => fail(`could not start claude: ${err.message}`));
child.on('exit', (code) => process.exit(code ?? 0));
