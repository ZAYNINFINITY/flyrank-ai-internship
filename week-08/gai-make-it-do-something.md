# Plain-Words Explainer — The Contact Form

**Assignment:** General AI Fluency — "Make It Do Something" (Week 6)
**Intern:** Zain Ul Abideen
**Live feature:** https://plinth-cyan.vercel.app/about (the "Get in touch" section)

## What a backend is (in my own words)

A backend is the part of a website that runs on a server instead of in your
browser. When you fill in a form, your browser is only a messenger — it can
show you fields and collect what you type, but it has no permanent home for
your message. The backend is the part that receives your message, decides what
to do with it, and actually delivers it somewhere (like an inbox).

You can imagine it as a receptionist at an office: your message is the visitor,
and the backend is the person who takes the visitor and routes them to the
right office. Without that person, the visitor just stands in the lobby.

## What my feature does

Foyer's contact form is one real, working feature: a visitor types their name,
email, and message, and clicking "Send message" delivers it straight to my
inbox. It's not pretend — a real submission genuinely reaches me.

## How the data flows

1. **The browser collects the form.** The user fills in Name, Email, and
   Message. The browser checks they're all filled in correctly (a valid email
   format, no empty message) before it lets the request go — that's the
   HTML5 validation, so bad input never leaves the page.

2. **The browser sends the form.** A small piece of JavaScript takes those
   three values, packages them as a request, and POSTs them to Formspree's
   endpoint (a free-tier, third-party backend).

3. **Formspree forwards it.** Formspree's servers receive the message, run a
   quick spam check (a hidden "honeypot" field catches bots), and email it to
   my inbox.

4. **The browser confirms to the user.** While the request is in flight, the
   button shows "Sending…", then either "Message sent ✓" or an error asking
   them to try again. The user always knows what happened.

## Why I chose this over building my own server

The point of the feature is that it works, is free, and is honest. Using
Formspree's free tier means:
- **No server, no database, no secret keys** to manage or leak
- **Free tier** — it costs nothing to run
- **A real submission reaches me** — proof it actually does the job
- It's one small self-contained component, not a whole infrastructure

## Where the code lives

- `week-03/app/components/ops/contact-form.tsx` — the form logic and UI
- `week-03/app/app/about/page.tsx` — where the form is embedded ("Get in touch")
