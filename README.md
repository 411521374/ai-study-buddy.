# StudyBuddy — AI Midterm Project

A student learning companion prototype with study chat, quiz generator, notes summarizer, English practice, and a study planner.

## Run locally
Requires Node.js 18 or newer. Run `node server.js` and open http://localhost:3000. Demo mode requires no API key.

## Optional live AI chat
The project includes an optional server-side OpenAI chat endpoint. Set OPENAI_API_KEY as a private environment variable before starting the server. Never place the key in public files or commit it. API usage may cost money.

## Features and limitations
Study chat uses prepared demo responses unless the optional live API is configured. Quiz generator uses a small fixed question bank. Notes summarizer extracts opening points and longer terms. English practice checks a few common grammar patterns. Study planner saves tasks in browser local storage. This is a prototype, not a replacement for teachers or professional advice. Verify important information.

## Testing
See TESTING_NOTES.md for checks performed and tests not yet performed.