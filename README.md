# Clubhouse

A members-only social platform for creating, viewing, and managing posts. Admins can delete posts, and members have exclusive access to content.

**Live Demo:** [View Exclusive-club on Render](https://exclusive-club.onrender.com)

## Features

- Signup/Login with password hashing
- Membership system with passcode
- Admin controls for managing posts
- Create and view posts
- Responsive design with live character counters

## Tech Stack

Node.js, Express, PostgreSQL (`clubhouse` schema), EJS, Passport.js, bcrypt, CSS

## Setup

1. Clone the repo and install dependencies:

```bash
git clone
cd exclusive-club
npm install

2. Set environment variables in .env:

DATABASE_URL=<your_postgres_url>
SESSION_SECRET=<session_secret>
MEMBER_PASSCODE=<member_passcode>

3.Run the app:

npm start

Visit http://localhost:4000