# multipedia

Wikipedia but with multiple articles per topic available at [multipedia.sinskiy.website](https://multipedia.sinskiy.website)

> [!WARNING]
> I use free tier of Render and server spins down after a period of inactivity, so you'll probably have to wait for about a minute before you can use the website

## Features

- sign up with username and password, sign in with OAuth (Google, GitHub, Discord), log in, edit profile picture and bio
- search articles and users, send and delete friend requests, delete friends
- live markdown editor
- leaderboard, random article, by friends, liked articles, search articles
- article views, likes and comments (with markdown)
- copy articles, share drafts with friends

## Built with

### Frontend

TypeScript, Vite, React, wouter, Zod, React Query, CSS modules and more

### Backend

Strapi, Cloudinary

### Deployed on

[multipedia.sinskiy.website](https://multipedia.sinskiy.website) - [Vercel](https://vercel.com)

Database - [Neon](https://neon.tech)

Images - [Cloudinary](https://cloudinary.com)

## Build

1.

```bash
git clone git@github.com:sinskiy/multipedia.git
cd multipedia
cd frontend && npm install
cd ../backend && npm install
```

2. fill all .env by .env.example

3.

### First terminal (/backend)

```bash
npm run develop
```

### Second terminal

```bash
cd ../frontend
npm run dev
```
