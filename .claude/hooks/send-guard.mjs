#!/usr/bin/env node
// Send guard: a PreToolUse hook for the resend MCP server (matcher mcp__resend__.*).
// Reads the tool call as JSON on stdin. Exit 0 allows the call; exit 2 blocks it,
// and whatever we print to stderr is shown to Claude as the reason.

const ALLOWED_DOMAIN = '@resend.dev';
const MY_EMAIL = (process.env.MY_EMAIL || '').trim().toLowerCase();

// Tools that send to addresses we can check.
const CHECKED = new Set(['send-email', 'send-batch-emails', 'forward-inbox-thread-email']);

// Tools that can reach whole lists, or recipients we can't see. Always blocked.
const ALWAYS_BLOCKED = {
  'send-broadcast': 'broadcasts go to a whole audience list',
  'create-automation': 'automations can email whole lists of people on their own',
  'send-inbox-draft': 'inbox drafts can be addressed to anyone',
  'send-new-inbox-email': 'new inbox emails can be addressed to anyone',
  'reply-to-inbox-thread-email': 'replies go to whoever is in the thread',
};

function block(reason) {
  process.stderr.write(`Send guard blocked this: ${reason}\n`);
  process.exit(2);
}

// Accept "a@b.com", "Name <a@b.com>", a list, or a comma-separated string.
function addresses(value) {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  return list
    .map((a) => String(a).trim())
    .filter(Boolean)
    .map((a) => (a.match(/<([^>]+)>/)?.[1] ?? a).trim().toLowerCase());
}

function isAllowed(address) {
  return address.endsWith(ALLOWED_DOMAIN) || (MY_EMAIL !== '' && address === MY_EMAIL);
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let call;
  try {
    call = JSON.parse(raw);
  } catch {
    block('could not read the tool call, so it was not allowed.');
  }

  const tool = String(call.tool_name || '').replace(/^mcp__resend__/, '');
  const input = call.tool_input || {};

  if (tool in ALWAYS_BLOCKED) {
    block(`"${tool}" is never allowed: ${ALWAYS_BLOCKED[tool]}.`);
  }

  if (!CHECKED.has(tool)) process.exit(0);

  // send-batch-emails holds a list of emails; the others are a single email.
  const emails = tool === 'send-batch-emails' ? input.emails || [] : [input];
  const recipients = emails.flatMap((e) => [
    ...addresses(e.to),
    ...addresses(e.cc),
    ...addresses(e.bcc),
  ]);

  if (recipients.length === 0) block(`"${tool}" has no recipients to check.`);

  const refused = [...new Set(recipients.filter((a) => !isAllowed(a)))];
  if (refused.length > 0) {
    const me = MY_EMAIL ? ` or ${MY_EMAIL}` : ' (MY_EMAIL is not set)';
    block(
      `${refused.join(', ')} ${refused.length === 1 ? 'is' : 'are'} not allowed. ` +
        `Emails may only go to addresses ending in ${ALLOWED_DOMAIN}${me}.`,
    );
  }

  process.exit(0);
});
