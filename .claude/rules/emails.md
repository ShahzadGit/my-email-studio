---
paths:
  - "campaigns/**/emails/*.md"
---

# Rules for every email file

These rules apply to every email file in every campaign, including the group versions under `groups/<group>/emails/`. Each email file must follow them exactly.

1. **Subject and Preview first.** Line 1 is `Subject: ...`, 50 characters or fewer. Line 2 is `Preview: ...`, 90 characters or fewer. Count the whole line, including `Subject: ` or `Preview: `. Write one subject only, with no lists of options.
2. **Greet the reader by name.** The greeting uses `{{first_name}}`, for example `Dear {{first_name}},`.
3. **Exactly one main link.** Write it as a Markdown link to the admissions page:
   `[Button text](https://imcghumak.example/admissions)`
   Choose button text that fits the email, for example `[Apply now](https://imcghumak.example/admissions)`. No other links anywhere in the email.
4. **End with the sign-off, then the footer.** First the sign-off from `brand/voice.md`, exactly as written there. Then this two-line footer as plain text, not inside a code block or quote:

You're getting this because you submitted your form for admission.
IMCG, Humak, {{company_address}} · Unsubscribe: {{unsubscribe_url}}

Nothing comes after the footer. No notes, no alternative subject lines, no design tips. The file holds only the email itself.
