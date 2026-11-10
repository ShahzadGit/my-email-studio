# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this studio is for

This studio plans and writes email campaigns for a small organisation: **Islamabad Model College for Girls, Humak (IMCG Humak)**, near DHA Phase 2, Islamabad (https://www.imcghumak.edu.pk/). Our emails go to three audiences: **parents**, **officials** (education department and partner bodies), and **faculty**.

We build the studio by following the course in `docs/email-studio-lab-guide.md`. Its prompts use a sample tea shop, Kettlebird Tea. Here, always swap in IMCG Humak and its audiences instead. Each step has a build prompt and a check prompt. Check prompts run in a fresh session and must not change any files.

## Brand voice

@brand/voice.md

## Folders

- `brand/`: how the college sounds in writing: voice, words to use and avoid, claims we must never make.
- `leads/`: made-up practice contacts to send test campaigns to. Never real people.
- `campaigns/`: one folder per campaign, holding its plan and its emails.
- `notes/`: research, decisions and scratch work.
- `docs/`: the course guide we follow.

## Rules

- **Write in plain English.** Short sentences, everyday words, no jargon.
- **Never send email to real people.** That includes real parents, students, staff or officials of the college. Practice contacts use made-up names and `@example.com` addresses only. Don't put real people's names or details, taken from the college website or anywhere else, into leads or test emails.
  - **Sending through Resend** (the `resend` MCP server in `.mcp.json`) is allowed only to Resend's test addresses, which end in `@resend.dev`, and to my own email address, the `MY_EMAIL` value in `.claude/settings.local.json`. Never send to anyone else, including the `@example.com` practice contacts. A send guard (a hook) will enforce this from the next step. If it blocks a send, don't try to get around it.
- **Ask me before deleting anything.**
- **No Claude attribution in git.** Don't add `Co-Authored-By` or "Generated with Claude Code" lines to commit messages or pull requests.

## Plugin

Anthropic's `marketing` plugin is installed for this project only, from the `knowledge-work-plugins` marketplace (see `.claude/settings.json`). Its commands start with `/marketing:`, for example `/marketing:campaign-plan`, `/marketing:email-sequence` and `/marketing:brand-review`.
