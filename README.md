# ElectroBuild Store + Online Classes

Static site for GitHub Pages. No server needed.

## Pages
- `index.html`: store, projects and the new **Classes** section
- `admin.html`: edit content and publish to GitHub (now includes **Online Classes**)
- `content.js`: all site data (products, courses, settings)
- `classes.js`, `classes.css`: classes section

## Publish on GitHub Pages
1. Upload all files to your repository (branch `main`).
2. Settings > Pages > Deploy from branch > `main` / root.
3. Open `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Add or edit a course
1. Open `admin.html` > **Online Classes** panel.
2. Edit the courses JSON (copy an existing course, change `id`, `title`, `price`, lessons).
3. Click **Save Preview** to check it, then **Publish to GitHub**.

Course fields: `id`, `category`, `title`, `level`, `duration`, `price`, `image`, `description`, `lessons`, `payUrl` (optional Razorpay payment link).
Lesson fields: `title`, `free` (true/false), `videoUrl` (only for free lessons).

## How selling works
1. Student opens a course and taps **Enroll on WhatsApp** (or pays by UPI if you set a UPI ID).
2. Student sends the payment screenshot. You confirm the payment.
3. You send private YouTube (unlisted) lesson links, notes and code on WhatsApp or Telegram.

**Important:** `content.js` is public. Never put paid video links there. Only add links for free preview lessons.

## Safety
- The GitHub token in admin is saved in your browser only. Use a fine-grained token limited to this one repository, and do not use it on shared computers.
- Add real Terms, Privacy and Refund text before taking payments.
