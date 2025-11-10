# Simple Notes

Simple Notes is a full-stack note taking workspace built with the Next.js App Router. It couples Supabase authentication, a PostgreSQL database managed through Prisma, and OpenAI-powered assistants to deliver a focused writing experience with AI insights.

## Features
- **Authenticated notebook** – Users sign up, log in, and log out through Supabase; successful actions surface contextual toast notifications so readers know what just happened. Notes are scoped per user and render inside a responsive layout with a persistent sidebar and header.  
- **Autosaving editor** – Edits in the main textarea debounce for 1.5 seconds before invoking a server action that persists changes through Prisma, keeping the UI responsive while preventing data loss.  
- **Sidebar curation** – The sidebar lists the current user’s notes ordered by most recently updated, supports fuzzy searching with Fuse.js, and exposes inline deletion controls with confirmation prompts.  
- **Ask AI about your notes** – The “Ask AI” dialog streams your notebook history to OpenAI’s `gpt-4o-mini` model so you can query your own content and receive HTML-formatted responses without leaving the app.  
- **Smart routing** – Middleware looks up or creates the most recent note and rewrites `/` requests to include `?noteId=...`, ensuring the editor always has a note loaded after authentication.  
- **Delightful UI touches** – Users can toggle light/dark themes, and server-rendered components hydrate with ShadCN UI primitives, Lucide icons, and Tailwind CSS 4 styling.

## Architecture at a glance
- **App Router layout** – `app/layout.tsx` wires the theme provider, note context, sidebar, header, and toast system, yielding a two-column workspace on every route.  
- **Server actions** – `actions/notes.ts` implements create, update, delete, and AI answer flows; `actions/users.ts` bridges Supabase sign-in, sign-out, and registration while keeping Prisma’s `User` table in sync.  
- **Middleware** – `middleware.ts` centralizes Supabase session management, guards auth routes, and issues note redirects/creations on the fly.  
- **API routes** – `app/api/fetch-newest-note` and `app/api/create-new-note` expose lightweight REST helpers used by the middleware to select or bootstrap notes.  
- **State management** – A minimal `NoteProvider` context shares the active note text between the editor and sidebar components, while hooks like `useIsMobile` and `useNote` adapt UI behavior client-side.

## Data model
Prisma manages a compact schema backed by PostgreSQL:

| Model | Fields |
| ----- | ------ |
| `User` | `id` (UUID), `email` (unique), timestamp columns, and a one-to-many relation to notes |
| `Note` | `id` (UUID), `text`, timestamps, and a foreign key to the owning user |

Run `pnpm dlx prisma studio` during development if you’d like to browse the data visually.

## Getting started
1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Create a `.env.local` file** populated with the environment variables below. Values should be quoted if they contain special characters.
3. **Generate the Prisma client and run the latest migrations**
   ```bash
   pnpm migrate
   ```
   This script runs `prisma generate` before applying dev migrations.
4. **Start the development server**
   ```bash
   pnpm dev
   ```
   Turbopack serves the app on [http://localhost:3000](http://localhost:3000) by default.

### Required environment variables
| Variable | Purpose |
| -------- | ------- |
| `DATABASE_URL` | Connection string for the Postgres database used by Prisma. |
| `SUPABASE_URL` | Supabase project URL used to create server-side clients. |
| `SUPABASE_ANON_KEY` | Supabase anonymous API key for browser + server actions. |
| `NEXT_PUBLIC_BASE_URL` | Absolute base URL (e.g., `http://localhost:3000`) used by middleware when calling internal APIs and issuing redirects. |
| `OPENAI_API_KEY` | API key for the OpenAI client that powers the Ask AI dialog. |

### Configure Google OAuth in Supabase
To get Google sign-in working locally and in production, make sure the Supabase project is configured with the following settings:

1. In the **Authentication → Providers** section of the Supabase dashboard, enable the Google provider and supply the OAuth client credentials from the Google Cloud Console.
2. On the **Authentication → URL Configuration** screen, set the **Site URL** to the same value as `NEXT_PUBLIC_BASE_URL` (e.g., `http://localhost:3000` during local development).
3. Add `http://localhost:3000/auth/callback` (and any other deployment callback URLs) to the **Additional Redirect URLs** list so Supabase can redirect the browser back to the app after Google completes the consent flow.

### Useful scripts
| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Run the development server with Turbopack. |
| `pnpm build` | Generate the Prisma client and produce a production Next.js build. |
| `pnpm start` | Serve the production build. |
| `pnpm migrate` | Regenerate the Prisma client and apply the latest database migrations. |

## Project structure
```
app/               # Next.js routes, layouts, middleware styles, and API handlers
actions/           # Server actions for notes and user authentication
components/        # UI primitives (sidebar, header, forms, dialogs, buttons)
providers/         # Theme and note context providers
hooks/             # Reusable client-side hooks
openai/            # OpenAI client instantiation
auth/              # Supabase server helper
db/                # Prisma schema, migrations, and client bootstrap
```

## Additional notes
- The Ask AI dialog sanitizes OpenAI responses with custom CSS so headings, lists, and emphasis render cleanly within the chat history.  
- Toast notifications on the home page react to querystring flags, making it easy for server actions and redirects to communicate success states.  
- Because middleware eagerly creates a blank note when none exist, first-time users land on a ready-to-edit document immediately after authenticating.

