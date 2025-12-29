# Open APIs – contact notifications

A tiny Express + MongoDB service that saves contact form submissions and emails them to you instantly via Gmail SMTP. No schedulers, no queues—just fire, store, and send.

## How it works
- `POST /api/connect/sendMessage` stores the submission in MongoDB, then immediately emails the details. On successful send, the document is marked `sent: true`.
- If email fails, the message stays `sent: false` for visibility; the API responds with an error and logs the issue.
- No extra admin endpoints remain; you can inspect Mongo directly if you need to review unsent items.

## Setup
1) Clone/install deps: `npm install`
2) Create `.env` with:
   - `MONGO_URI` (Mongo connection string)
   - `GMAIL_USER` (your Gmail address)
   - `GMAIL_APP_PASSWORD` (app password from Gmail 2FA)
   - `NOTIFICATION_EMAIL` (where alerts are delivered)
3) Run: `npm start` (or `npm run dev` with nodemon). Default port is `8000` unless `PORT` is set.

## API quick look
- `POST /api/connect/sendMessage` – submit a message (email, message)

## Failure playbook
- Mongo down: requests to `sendMessage` will fail before email is attempted; fix DB/connect string and retry.
- SMTP/auth fails: message stays `sent: false`; API returns error and logs why. Check `GMAIL_USER` / `GMAIL_APP_PASSWORD` and that 2FA + app password are set.
- No emails arriving but API returns 200: confirm `NOTIFICATION_EMAIL` is correct and check spam; also review server logs for mailer output.

## Notes
- All emails use a simple, padded HTML template plus a plain-text fallback.
- Works on any Node-friendly host; nothing relies on background schedulers.
