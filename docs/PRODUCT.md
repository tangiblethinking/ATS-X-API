# ATS Align + Gemini setup

Client-side resume-to-job alignment app. Uses the visitor’s Google AI Studio (Gemini) API key stored in `localStorage`.

## User flow

1. Load the app.
2. If no Gemini API key is stored → **Welcome** modal (cannot skip by accident; CTAs only).
3. **Continue** → 8-step API key wizard (copy + media from gemapi).
4. Last steps: paste + save key → stored locally → main ATS Align UI.
5. **Enter API Key** → existing key manager (verify / save / delete).
6. **Create Account** / **Create one** → Google Gmail signup in a new tab.
7. User icon in the nav → **Reset app** (clears the Gemini key only) → welcome modal returns.

## Persistence

- Gemini API key: `localStorage`
- Optional Serper search key: `localStorage`
- Draft job URL / text / resume HTML: `localStorage`
- Theme: `localStorage`
- No accounts. No OAuth. No server-side user store.

## Features (parity with ATS-X2)

- Six-step ATS pipeline (extract, rewrite, grammar, audit, layout, clean HTML)
- Job search
- PDF → HTML convert
- Dark/light theme
