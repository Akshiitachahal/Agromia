This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## AGROMIA admin setup

The database is seeded with the admin account and sample product ranges:

```bash
npm run db:seed
```

The seed adds sample entries for **Fungicides**, **Insecticides**, and **Seed Treatment**, plus example products and leadership profiles.

## Cloudinary setup (free plan)

Cloudinary offers a permanent free plan for small projects, subject to its usage limits. It does not require a card to create the account.

1. Open https://cloudinary.com/users/register_free and create an account.
2. Confirm your email and open the Cloudinary dashboard.
3. On the dashboard, copy:
   - **Cloud name**
   - **API key**
   - **API secret**
4. Never share or commit the API secret. Add these values only to `.env.local` locally:

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Restart `npm run dev` after changing `.env.local`.

The app uploads through the authenticated server route `/api/admin/upload`, so the API secret is never sent to the browser.

## Database setup

Create or reset the database schema locally and seed it:

```bash
npm run db:push
npm run db:seed
```

`npm run db:seed` creates or updates the admin account and adds example ranges, products and leadership profiles.

## GitHub setup

The repository's `.gitignore` already excludes `.env`, `.env.local`, `.next`, `node_modules`, and Vercel files.

```bash
git add .
git diff --cached --stat
git diff --cached -- .env.local .env
git commit -m "Prepare AGROMIA for deployment"
git branch -M main
git push -u origin main
```

Before pushing, verify `.env.local` is not in the staged output. If it appears, do not commit it.

## Vercel setup

1. Open https://vercel.com and import `Akshiitachahal/Agromia`.
2. Select **Next.js** as the framework.
3. Add these environment variables in **Project Settings → Environment Variables**:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `ADMIN_RECOVERY_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_INITIAL_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Set `NEXTAUTH_URL` to the final Vercel URL, for example `https://agromia.vercel.app`.
5. Generate `NEXTAUTH_SECRET` locally:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

6. Use a Supabase pooled/connection URL for `DATABASE_URL`, if Supabase provides one, so serverless deployments can connect reliably.
7. Deploy the project, then open `/admin/login` and sign in.
8. In Supabase/Prisma, run `npm run db:push` and `npm run db:seed` once against the production database before inviting the owner.

- Admin sign-in: `/admin/login`
- Admin dashboard: `/admin`
- A slug is a short URL-safe name, such as `fungicides` or `agromia-proshield`.
- Slugs use lowercase letters, numbers and hyphens. Do not use spaces or punctuation.
- Product URL example: `/products/fungicides/agromia-proshield`
- Range URL example: `/products/fungicides`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
