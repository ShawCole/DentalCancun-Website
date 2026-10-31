# DentalCancun website (www.dentalcancun.com)

Next.js 15 marketing site for Dental Solutions Cancún, split out of the
`ShawCole/DentalSolutions` monorepo with its history. The site is in
`apps/marketing` and uses the shared `packages/core`.

```bash
npm ci --legacy-peer-deps
npx turbo build --filter=marketing   # or: npx turbo dev --filter=marketing
```

The live site still deploys from `ShawCole/DentalSolutions` (Netlify site
`dentalsolutionsintl`, publish dir `apps/marketing/.next`).
