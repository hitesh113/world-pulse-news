# 5 Necessary Improvements - Atomic Commits Plan

## Approved Plan Summary
1. Commit 1: Complete hero integrations + fix favicon
2. Commit 2: Add accessibility to AI Image Carousel Hero
3. Commit 3: Optimize hero performance (memo + lazyload)
4. Commit 4: Integrate AI Hero variant into Index page
5. Commit 5: Enhance Navbar mobile menu with animations

**Progress: 0/5**

## Detailed Steps per Commit
### Commit 1: \"Complete hero integrations + fix favicon\"
- [ ] git commit -m \"feat: complete AI/ScrollMorph hero integrations\"
- [ ] git add public/favicon.ico (restore/create)
- [ ] git commit -m \"fix: restore favicon.ico\"

### Commit 2: \"a11y: AI hero carousel aria labels & keyboard\"
- [ ] Edit src/components/ui/ai-image-generator-hero.tsx (add aria-label, role, tabIndex, onKeyDown)

### Commit 3: \"perf: memoize + lazyload AI hero\"
- [ ] Edit hero.tsx (React.memo, loading=\"lazy\", optional dynamic import)

### Commit 4: \"feat: toggle AI hero variant on Index\"
- [ ] Edit src/pages/Index.tsx (useState toggle, conditional render ImageCarouselHero)

### Commit 5: \"chore: smooth Navbar mobile menu animations\"
- [ ] Edit src/components/Navbar.tsx (add SlideInMenu component w/ transitions)

## Testing After All
- [ ] npm run lint && npm run build
- [ ] Check dev server: heroes toggle, mobile nav, a11y (screen reader), perf (Lighthouse 90+)

