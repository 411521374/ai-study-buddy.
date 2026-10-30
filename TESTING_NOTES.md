# Testing notes

Checks actually performed during preparation:
- `node --check server.js` passed.
- `node --check public/app.js` passed.
- Started the local Node server and requested `/`; received HTTP 200 and the StudyBuddy title was present.
- Requested `/api/chat` without an API key; received HTTP 503 as expected, allowing the browser code to use its demo fallback.

Not yet performed:
- Full interaction testing in a real browser (quiz scoring, notes output, English corrections, planner persistence).
- Live AI request with a real API key.
- Deployment to GitHub Pages or another public host.

Please do not describe unperformed tests as completed.
