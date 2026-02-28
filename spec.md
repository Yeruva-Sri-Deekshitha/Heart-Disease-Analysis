# Specification

## Summary
**Goal:** Fix the data-loading pipeline so that dashboard charts and the Data Explorer table display the synthetic 500-patient dataset instead of blank/empty areas.

**Planned changes:**
- Diagnose and fix the Motoko backend (`backend/main.mo`) to ensure the 500-patient synthetic dataset is generated and stored during canister initialization, so `getFilteredPatients`, `getAllPatients`, `getDatasetConfig`, and `getDatasetSize` return well-formed, non-empty responses immediately after deployment.
- Fix the frontend React Query hooks in `frontend/src/hooks/useQueries.ts` to correctly receive a valid actor instance from `useActor`, properly await backend calls, and return data to the charts.
- Ensure loading and error states are surfaced visibly (error message or retry prompt) instead of silently showing blank chart cards.
- Verify that filter panel changes (age range, gender, race, diabetes, stroke) propagate correctly through the hooks to update all charts.
- Ensure the Data Explorer table loads patient records without requiring a page refresh.

**User-visible outcome:** On page load, all dashboard charts (bar charts, scatter plots, pie charts) display populated data from the 500-patient dataset, filters work correctly, the Data Explorer table loads records, and any backend failures show a visible error instead of blank chart areas.
