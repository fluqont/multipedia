# multipedia

A simple wikipedia alternative available at [multipedia.sinskiy.website](https://multipedia.sinskiy.website)

> [!WARNING]
> I use free tier of Render and server spins down after a period of inactivity, so you'll probably have to wait for about 30 seconds before you can use the website

## Features

- sign up with username and password, sign in with oauth (google, github, discord), log in, upload profile picture, change account info
- search other users by username, send them friend requests, delete friends, incoming and outcoming friend requests
- create articles with a live markdown editor (toast-ui); publish, unpublish, update and delete them
- read articles, see article views
- see most popular articles, topics, a random article and articles by friends on the homepage
- add likes and comments with markdowns, delete comments
- see liked articles
- copy articles

## Built with

### Frontend

TypeScript, Vite, React, wouter, Zod, React Query, CSS modules and more

### Backend

Stripe

### Deployed on

[multipedia.sinskiy.website](https://multipedia.sinskiy.website) - [Vercel](https://vercel.com)
Database - [Neon](https://neon.tech)

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
npm run start
```

### Second terminal

```bash
cd ../frontend
npm run dev
```
