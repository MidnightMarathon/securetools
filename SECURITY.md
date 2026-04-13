# Security Policy

## Supported versions

Only the current `main` branch is actively maintained. There are no versioned releases.

## Scope

SecureTools is a fully client-side project — there is no backend, no database, no authentication, and no server that receives user input. That intentionally limits the attack surface.

Relevant security concerns include:

- **XSS** — a tool that unsafely renders user input to the DOM
- **Malicious output** — a tool that generates output that could harm a user if they acted on it
- **Third-party library vulnerabilities** — a CDN-loaded dependency with a known CVE
- **SRI bypass** — a script tag missing or having an incorrect `integrity` attribute
- **Privacy leak** — any code that sends user input to an external server

Out of scope:
- GitHub Actions security findings unrelated to the site itself
- Vulnerabilities in the user's own browser
- Theoretical attacks requiring physical access to the user's device

## Reporting a vulnerability

**Please do not open a public issue for a security vulnerability.**

Report it privately via [GitHub's private vulnerability reporting](https://github.com/MidnightMarathon/securetools/security/advisories/new).

Include:
- A description of the vulnerability
- Which tool or file is affected
- Steps to reproduce or a proof-of-concept (a plain description is fine — no need for a working exploit)
- The potential impact

You can expect an acknowledgment within **72 hours** and a fix or public advisory within **7 days** for confirmed issues. If the report turns out to be out of scope or not reproducible, we'll let you know why.

We don't run a formal bug bounty program, but we'll credit you in the advisory and in the commit message if you'd like.
