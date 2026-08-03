# PF-04 — Personal Website + DNS Walkthrough

**Assignment:** Personal Website Live on the FlyRank Domain (PF-04)
**Track:** General AI Fluency
**Intern:** Zain Ul Abideen
**When:** Week 5 · **Workload:** 6h · **Phase:** Build
**Live URL:** https://zainportfoli0.netlify.app

---

## Live site

- **URL:** https://zainportfoli0.netlify.app — live over HTTPS, loading cleanly in a private window.
- **Built with:** Hugo (static site generator) on Netlify's free tier.
- **Contents:** positioning, about, education, experience, skills, projects (POS-it, Collaborative Workspace, ZSE Store, ScrollStreak + more), GitHub link, LinkedIn link, CV (`/files/resume.pdf`), contact email.
- **HTTPS:** automatic (Netlify provides the cert for the free `*.netlify.app` domain).
- **Site name:** `zainportfoli0.netlify.app` — a clean, CV-worthy name (not an auto-generated slug).
- **Why Netlify:** free tier covers everything for this track, HTTPS is automatic, and it accepts a custom domain later without rebuilding anything. When my `zain.flyrank.ai` subdomain is provisioned at the end of the track, I add it as a custom domain here and keep both URLs working.

---

## DNS Walkthrough (in my own words)

**What a CNAME record is.**

A CNAME record (Canonical Name) is a DNS record that says: *"this hostname is actually an alias for another hostname — go look that one up instead."* It is a redirect at the DNS level, not a redirect you click. For example, `www.example.com CNAME example.netlify.app` means "whatever answers for `example.netlify.app` also answers for `www.example.com`."

For my case: `zain.flyrank.ai` will be a CNAME pointing at `zainportfoli0.netlify.app`. Anyone typing `zain.flyrank.ai` gets routed to Netlify's servers, which already host my site.

**What value mine will hold.**

My CNAME record will look like:

```
zain   CNAME   zainportfoli0.netlify.app
```

That is the only record type I need — I am pointing a hostname at another hostname, not at an IP address. An IP could change; a CNAME to Netlify keeps working even if their IPs change.

**What actually happens when someone types my address.**

1. **Resolver query.** Your browser asks the OS's resolver (usually your router or ISP): *"where is `zain.flyrank.ai`?"*
2. **Nameserver lookup.** If the resolver has no cached answer, it starts at the DNS root servers, follows the `.ai` top-level domain, and lands on the nameservers that FlyRank's DNS provider has delegated `flyrank.ai` to. Those nameservers are the authoritative answer for `zain.flyrank.ai`.
3. **Record response.** FlyRank's nameservers return the CNAME: `zain.flyrank.ai → zainportfoli0.netlify.app`.
4. **Follow the alias.** The resolver now asks Netlify's nameservers for `zainportfoli0.netlify.app`, which resolve to Netlify's CDN IP addresses (A/AAAA records).
5. **Response.** The resolver returns an IP address to the browser. The browser opens a TLS connection (HTTPS), Netlify serves my site with its certificate, and the page loads. The padlock appears because Netlify issues and validates a certificate for `zain.flyrank.ai` automatically.

**One-liner for a non-technical team member:** When you type my site name, your internet provider's "phone book" (DNS) asks FlyRank's provider where it points, gets told "it's really my Netlify site," then asks Netlify where that lives, and opens the page — like a postal address that forwards to a second address, and the second address gives directions to the actual house.

**What I will do when the subdomain is provisioned:** add `zain.flyrank.ai` as a custom domain in Netlify (Site configuration → Domain management), let Netlify detect/attach the DNS record, wait for propagation (minutes to hours), and confirm the padlock in a private window. Nothing about the site build changes — a custom domain is a pointer, not a migration.

---

## Checklist against the brief

| Requirement | Status |
|---|---|
| Site live over HTTPS on a clean, public URL | ✅ `zainportfoli0.netlify.app`, verified in private window |
| Positioning + working LinkedIn link | ✅ present |
| Working GitHub link | ✅ present |
| Working CV link | ✅ `/files/resume.pdf` (200, PDF) |
| Booking link | ⚠️ **not present yet** — needs adding |
| DNS walkthrough (own words) | ✅ this document |
| Understand every deployed file | ✅ Hugo build, source understood |
| Site linked from LinkedIn + CV | ⚠️ user action — I cannot verify this from the repo |
