# Project Prompts & Development Log

This document records the prompts and instructions executed during the development, optimization, accessibility auditing, quality assurance, and deployment of the **Performance Optimization Tracker**.

---

## Phase 1: Performance Optimization (`useMemo` & `React.memo`)

### Prompt 1
> **"Review the code. Wrap the filtered list and summary stats (average score, top performer, entry count) in useMemo, and wrap child components in React.memo where it helps. Explain each optimization in one sentence and why it prevents re-renders. Don't over-optimize anything trivial."**

#### Actions & Outcomes:
* **Filtered List (`filteredEntries`)**: Wrapped in `useMemo` with `[entries, searchQuery]` dependencies to prevent re-filtering on unrelated re-renders.
* **Summary Stats (`summaryStats`)**: Memoized average score, top performer, and entry count calculation to avoid iterating over the array on every state update.
* **`EntryForm` Component**: Wrapped in `React.memo` to prevent re-rendering when users type into the search bar, leveraging referentially stable `onAdd` callback.
* **`EntryList` Component**: Wrapped in `React.memo` to skip re-rendering the full data table and its rows when entries and delete handlers remain unchanged.
* **`SummaryStats` Component**: Created as a modular child component wrapped in `React.memo` to only update when calculated metrics change.
* **Avoided Trivial Overhead**: Intentionally skipped `SearchBar` (props change on every keystroke) and lightweight leaf components (`LoadingSpinner`, `EmptyState`, `ErrorMessage`).

---

## Phase 2: Accessibility & Lighthouse 100% Audit

### Prompt 2
> **"Audit the app for a 100% Lighthouse accessibility score: semantic landmarks (header/main), label every input and button, aria-live for loading and error messages, color contrast, a skip link, logical tab order, focus management after submit. Fix anything missing and tell me what you changed."**

#### Actions & Outcomes:
* **Semantic Landmarks**: Added `<header role="banner">`, `<main id="main-content" tabIndex="-1">`, `<footer role="contentinfo">`, section `aria-label` tags, and table `<caption className="sr-only">`.
* **Skip Link**: Implemented `<a href="#main-content" className="skip-link">Skip to main content</a>` with high-contrast `:focus-visible` styling.
* **Input & Button Labeling**: Verified explicit `<label htmlFor="...">` bindings across all inputs; added clear `aria-label` to action and delete buttons.
* **Live Regions**: Added `role="status"` and `aria-live="polite"` to loading spinner and empty state; added `role="alert"` and `aria-live="assertive"` to error messages; added post-submit screen reader announcement.
* **Color Contrast**: Upgraded `--color-error` to `#b91c1c` (6.1:1+ contrast) and input placeholder text to `--color-gray-4` (`#52525b`, 7.6:1 contrast) exceeding WCAG 2.1 AA/AAA standards.
* **Focus Management**: Implemented `useRef` hooks in `EntryForm` to automatically focus the first invalid field on validation error, and return focus to the `Name` field on successful submit for smooth keyboard workflow.

---

## Phase 3: Code Quality, Linting & Security Audit

### Prompt 3
> **"Run ESLint. Fix every warning and remove unused imports. Then run the full test suite and confirm everything passes. Check that no API keys or PII are hardcoded anywhere."**

#### Actions & Outcomes:
* **ESLint**: Ran strict `--max-warnings 0` check and fixed global environment variables (`globalThis.process`). Clean exit with 0 errors and 0 warnings.
* **Dead Code Removal**: Inspected all files in `src/` to ensure zero unused imports or unreferenced variables.
* **Full Test Suite**: Executed Vitest across 6 test suites—all 84 automated unit and integration tests passed.
* **Security & PII Scan**: Scanned codebase for API keys, secret tokens, bearer headers, credentials, and personal data. Added `.env` exclusion rules to `.gitignore`.

---

## Phase 4: Manual QA & Browser Testing Checklist

### Prompt 4
> **"Give me a manual test checklist for the browser, covering empty state, slow network (Chrome DevTools throttling to Slow 3G), offline/failed fetch + retry, invalid form input, XSS payload like `<img src=x onerror=alert(1)>`, and keyboard-only use. I'll run it and report back."**

#### Actions & Outcomes:
* Formulated a comprehensive, step-by-step manual testing protocol covering:
  1. Empty state verification via `localStorage.clear()`.
  2. Slow 3G network throttling in Chrome DevTools to observe loading spinner state.
  3. Offline fetch failure simulation and verification of the one-click "Retry" recovery button.
  4. Form validation barriers for empty, short, and non-numeric fields.
  5. Cross-Site Scripting (XSS) input sanitization test with HTML/script payloads.
  6. Keyboard-only navigation workflow (skip link, tab order, Enter submission, and focus reset).

---

## Phase 5: Documentation & Architecture Specifications

### Prompt 5
> **"Write a README with: what the app is, setup/run/test instructions, how each edge case is handled, and a short list of design decisions. Keep it human and concise."**

#### Actions & Outcomes:
* Authored `README.md` covering application purpose, environment prerequisites, quick start guide, edge case strategies, and key design decisions (memoization, accessibility, decoupled mock service, vanilla CSS token architecture).

---

## Phase 6: Cloud Deployment Setup

### Prompt 6
> **"Walk me through deploying this Vite app to Vercel (or Netlify) step by step, including build settings, so I get a live URL."**

#### Actions & Outcomes:
* Provided end-to-end deployment instructions for both Vercel and Netlify (via Web Dashboard and CLI).
* Created `vercel.json` with framework preset, build command (`npm run build`), output directory (`dist`), and SPA client-side routing rewrites.

---

## Phase 7: Personal Branding & Social Footer

### Prompt 7
> **"add the footer section with my all details and social media handles and make it like developed by vinayak sharma and all the required links in footer like github, linkdin and gmail"**

#### Actions & Outcomes:
* Designed a responsive, accessible footer in `src/App.jsx` and `src/styles/base.css`.
* Included `"Developed with ♥ by Vinayak Sharma"`.
* Added styled interactive links with SVG icons for **GitHub** (`https://github.com/vinayak2922k`), **LinkedIn** (`https://linkedin.com/in/vinayak2922k`), and **Gmail** (`mailto:vinayaksharma2289@gmail.com`).
* Enforced safe external link attributes (`target="_blank"`, `rel="noopener noreferrer"`) and descriptive `aria-label` tags for screen readers.
