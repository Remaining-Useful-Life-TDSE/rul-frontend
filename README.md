# rul-frontend

Next.js 16 (App Router) frontend for AeroPredict. Consumes the Kong API
Gateway to authenticate users and request engine RUL predictions.

## Stack

- Next.js 16.2 + React 19
- Tailwind CSS 4
- shadcn/ui components
- pnpm

## Routes

| Path         | Description                                      |
| ------------ | ------------------------------------------------ |
| `/`          | Landing page                                     |
| `/register`  | Sign-up form                                     |
| `/login`     | Sign-in form                                     |
| `/dashboard` | Fleet metrics, predictions table, new prediction |

`/dashboard` is protected: the edge `proxy.ts` redirects to `/login` if
the auth cookie is missing.

## Setup

```powershell
cd rul-frontend
pnpm install
```

Create `.env.local` (see `.env.local.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production (Vercel), point `NEXT_PUBLIC_API_URL` to the public gateway URL
(or an ngrok tunnel against the local Kong instance).

## Run

```powershell
pnpm dev
```

Open `http://localhost:3000`.

## Build

```powershell
pnpm build
pnpm start
```

## Deployment

Deployed on Vercel: https://rul-frontend-nine.vercel.app

Required Vercel settings:

- **Environment Variable**: `NEXT_PUBLIC_API_URL` = public gateway URL
