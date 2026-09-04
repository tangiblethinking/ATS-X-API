# Build notes

## Stack

TanStack Start + React 19 + Tailwind v4 + Radix/shadcn + Sonner.

Auth and database are **off**. The Gemini key never leaves the browser except as the `x-goog-api-key` header on Gemini calls.

## Source mapping

| Piece | Origin |
|---|---|
| Main UI / pipeline / job search | ATS-X2-test |
| 8-step key wizard copy + media | gemapi |
| Welcome modal copy | product spec |
| Combined repo | ATS-X-API |

## Local data keys

See `src/lib/pipeline-types.ts` (`API_KEY_STORAGE`, `SEARCH_API_KEY_STORAGE`, `DRAFT_STORAGE`).

## Wizard media

- `public/wizard/getapivid.mp4` (step 1)
- `public/wizard/step002.png` (step 2)
- `public/wizard/step003.png` (step 3)
- `public/wizard/step004.png` (step 4)
- `public/wizard/step005.png` (step 5)
- `public/wizard/step006.png` (step 6)
- `public/wizard/step007.png` (step 7)

## Reset

Nav user icon → Reset app → `deleteApiKey()` only.
