---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize

Write one copy of each campaign email for each lead group.

The campaign folder is: $ARGUMENTS

## Step 1: Check the input

- If no campaign folder was given above, **stop**. Use Glob on `campaigns/*/` to find the campaign folders, and reply only with:
  "Please give a campaign folder, for example `/personalize campaigns/<name>`. Campaign folders found:" followed by the list. Write nothing.
- If the folder has no `emails/` folder, or `emails/` holds no `*.md` files, stop and say so. Write nothing.

## Step 2: Gather what you need

1. Read `leads/leads.csv`. Find the distinct values in the `group` column. These are the groups. Don't assume a fixed list: use whatever groups the file contains.
2. Read every email in `<campaign folder>/emails/*.md`. Only the top level: never read from or write to `groups/`.
3. Read `brand/voice.md` and `.claude/rules/emails.md`. Every version must follow both.
4. If the campaign folder has a `plan.md`, read it to learn what each group cares about.

## Step 3: Write the versions

For each email and each group, write a copy to:

`<campaign folder>/groups/<group>/emails/<same file name>`

**Change only two things:**
1. **The opening line,** the first sentence after the greeting. Rewrite it so it speaks to that group's interests.
2. **One example,** a single sentence or bullet in the body. Swap it for one that fits that group.

**Keep everything else exactly the same:** the `Subject:` and `Preview:` lines, the `{{first_name}}` greeting, the one link (same URL and same button text), all other paragraphs, the sign-off and the footer. Placeholders like `{{first_name}}`, `{{company_address}}` and `{{unsubscribe_url}}` stay as they are.

The new lines must follow `brand/voice.md`: no words or claims it forbids, and the tone it sets for the audience. Don't invent facts, dates, fees or numbers that aren't in the original email or the plan.

If a version already exists, overwrite it.

## Step 4: Reply with a short summary only

Don't show the emails, diffs or your working. Reply with only:

- How many files you wrote, for example "Wrote 12 files: 4 emails × 3 groups."
- One example opening line per group, taken from email 01.
