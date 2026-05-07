# WorldPulse News

A modern news website built with React, Vite, Tailwind CSS, and Supabase integration.

## What changed

- Added working sample news content across all categories: `world`, `tech`, `sports`, `business`, and `politics`.
- Included cover image URLs for each article so news cards and detail pages display images.
- Removed unused artifacts:
  - `TODO.md`
  - `TODO-NEW.md`
  - `TODO-5-Commits.md`
  - `src/components/AiImageGeneratorHeroDemo.tsx`
- Implemented mock data fallback for article queries so the UI stays functional even when Supabase is unavailable.
- Fixed the email subscription flow and ensured the "Notify Me" form is operating correctly.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the site in your browser at `http://localhost:5173` or the URL shown in the terminal.

## Project structure

- `src/hooks/useArticles.ts` – article data hooks and mock fallback logic
- `src/hooks/useSubscribe.ts` – email subscription handling
- `src/components` – UI components for article cards, layout, and forms
- `src/pages` – page-level views for home, categories, article details, admin, and search
- `supabase/functions` – backend functions for news fetching and notifications

## Notes

- The app currently uses mock article data when the Supabase backend is unreachable.
- To restore live data, verify the Supabase connection and ensure the `supabase` client is configured correctly.
