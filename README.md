# Next.js GraphQL Authentication

A simple authentication app built with Next.js and GraphQL. Users can sign up, log in and see a protected dashboard listing other users.

## Stack

- **Client:** Next.js 13, Apollo Client, MUI, react-hook-form + zod
- **Server:** Express, Apollo Server 4, MongoDB (Mongoose), JWT, bcrypt
- **Tests:** Vitest, React Testing Library

## How it works

1. **Signup:** the password is hashed with bcrypt and the user is saved in MongoDB.
2. **Login:** the server returns a JWT, which the client stores in a cookie.
3. **Protected routes:** Next.js middleware sends users without the cookie to signup, and logged-in users away from the auth pages.
4. **GraphQL requests:** the token is sent in the `Authorization` header and checked by the resolvers.

The dashboard also has a follow/unfollow button. Following is stored in its own collection with a unique index, so following the same user twice can't inflate the counts.

## Setup

You need Node.js, pnpm and a MongoDB database.

### Server

```bash
cd server
pnpm install
cp .env.example .env   # set MONGO_DB_URL and JWT_SECRET
pnpm start             # http://localhost:8080
```

### Client

```bash
cd client
pnpm install
cp .env.example .env   # set NEXT_PUBLIC_GRAPHQL_ENDPOINT to the server URL
pnpm dev               # http://localhost:3000
```

### Tests

```bash
cd client
pnpm test
```
