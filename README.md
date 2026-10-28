# Performance Optimization Tracker

A clean, accessible web application to record, track, and analyze web performance metrics across releases (e.g. LCP, TTFB, CLS, and custom latency scores).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests
```bash
# Run all Vitest suites
npm test

# Run single test pass
npm test -- --run
```

### Code Quality & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Edge Case Handling

* **Empty State**: When no data has been entered or search filters yield zero matches, a clear `"No data found"` empty state placeholder is shown. Summary stats gracefully display `0` entries, `0` average score, and `—` for top performer.
* **Slow Network**: Simulated asynchronous fetches display a centered, accessible loading spinner (`role="status"`, `aria-live="polite"`) until data resolves.
* **Network Failure & Offline Recovery**: If an API request fails, an accessible error banner (`role="alert"`, `aria-live="assertive"`) appears with a `"Retry"` button that safely re-triggers the fetch.
* **Invalid Form Input**: Form submission validates required fields, minimum name length (2+ characters), and numeric score range (0–100). Invalid inputs are highlighted with `aria-invalid="true"`, linked to descriptive error messages via `aria-describedby`, and automatically shift keyboard focus to the first invalid field.
* **XSS Injection**: All input fields (Name, Metric, Score, Notes) are sanitized before updating React state and before storage, stripping malicious tags (`<script>`, `<img onerror=...>`, `<svg onload=...>`) to prevent script injection.
* **Keyboard Navigation & Focus Management**: Features a visible skip link (`Skip to main content`), logical tab flow, high-contrast `:focus-visible` outlines, and automatic focus reset to the Name field after successful submissions.

---

## Key Design Decisions

1. **Targeted Memoization**:
   - `useMemo` caches the filtered entries list and summary aggregations (average score, top performer, and count) to avoid redundant recalculations during typing.
   - `React.memo` wraps non-trivial child components (`EntryForm`, `EntryList`, `SummaryStats`) receiving stable callback references, while intentionally leaving lightweight leaf components unmemoized to avoid shallow-prop comparison overhead.
2. **Accessible by Default (WCAG 2.1 AA/AAA)**:
   - Full semantic landmark structure (`<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`, labeled sections, and table captions).
   - Monochromatic design tokens with strict contrast compliance: `#b91c1c` for 6:1+ error contrast, `#52525b` for 7.6:1 placeholder contrast, and 2px solid outlines for focus rings.
3. **Decoupled Mock Service**:
   - Uses a dedicated mock API layer backed by `localStorage` that simulates real-world latency (1–1.5s in dev, fast in tests) and supports configurable failure injection for network resilience testing.
4. **Vanilla CSS Token System**:
   - Uses native CSS custom properties on an 8px spacing scale (`--space-8`, `--space-16`, `--space-32`) for maintainability without external framework overhead.
