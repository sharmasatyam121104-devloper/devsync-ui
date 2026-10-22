# DevSync Frontend

The web client for **DevSync**, a collaboration workspace for student developer teams. It gives users a project dashboard, issue tracker, ZIP artifact sharing, project chat, scheduled meetings with video calls, user reports, and profile management. Admins get a separate console for user/project/issue oversight, report moderation, analytics, API logs, and server health.

The app is built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**, and talks to the DevSync Express API over credentialed REST and Socket.IO connections.

---

## Table of Contents

- [What This App Solves](#what-this-app-solves)
- [Tech Stack](#tech-stack)
- [App Architecture](#app-architecture)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Feature Walkthrough](#feature-walkthrough)
- [API Usage](#api-usage)
- [Real-time Communication](#real-time-communication)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Known Limitations](#known-limitations)

---

## What This App Solves

Developer teams need one place to coordinate project work instead of juggling task boards, file shares, chat apps, and meeting links. DevSync provides:

- Project workspaces with lead/member roles.
- Issues with type, priority, assignee, status, and comments.
- ZIP build uploads and download history backed by S3.
- Project-scoped real-time chat with persisted history.
- Meeting scheduling and browser-based video calls.
- User reporting with an admin review queue.
- An admin console for platform health, usage analytics, and moderation.

---

## Tech Stack

| Concern | Technology |
| --- | --- |
| Framework | Next.js 16.1.6 (App Router) |
| UI runtime | React 19.2.3 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, `tw-animate-css`, CSS variables in `app/globals.css` |
| Component systems | Ant Design 6 + `@ant-design/icons`, shadcn/Radix primitives, Base UI, custom `components/ui` |
| Icons | Lucide React |
| Data fetching | SWR 2 for reads, Axios for writes |
| Real-time | `socket.io-client` |
| Video | Zego UIKit Prebuilt; a separate raw WebRTC component using `RTCPeerConnection` is also present |
| Charts | Recharts |
| Dates | dayjs, moment, date-fns |
| Notifications | Ant Design `message`, Sonner |
| Utilities | class-variance-authority, clsx, tailwind-merge, embla-carousel, react-day-picker, vaul, cmdk |

> The project intentionally or accidentally mixes Ant Design and shadcn/Radix. Follow the pattern already used in the file you are editing rather than introducing a third style.

---

## App Architecture

```text
Browser
  |
  |-- Next.js App Router pages (app/**/page.tsx)
  |       `-- thin wrappers around feature components
  |
  |-- Root LayoutProvider (components/layoutProvider.tsx)
  |       `-- fetches /user/session, shows skeleton while loading,
  |           redirects authenticated users away from /login and /signup
  |
  |-- /user layout (components/user/userLayoutProvider.tsx)
  |       |-- Ant Design sider + header shell
  |       |-- fetches session, redirects non-USER roles
  |       `-- RefreshToken component
  |
  |-- /admin layout (components/admin/adminLayoutProvider.tsx)
  |       |-- separate admin sider + header shell
  |       |-- fetches session, redirects non-ADMIN roles
  |       `-- RefreshToken component
  |
  |-- lib/http.ts -> Axios instance (NEXT_PUBLIC_SERVER, withCredentials)
  |-- lib/fetcher.ts -> SWR fetcher
  |-- lib/socketClient.ts -> singleton Socket.IO client
  `-- lib/getSession.ts -> GET /user/session wrapper
```

There is no `middleware.ts`. Authentication and role protection are performed **client-side** in layout providers after fetching the session. The API remains the source of truth and rejects unauthorized requests server-side.

### Styling and layout

- Global styles live in `app/globals.css` with Tailwind 4 and shadcn theme tokens.
- `components.json` configures shadcn aliases (`@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`).
- Ant Design provides forms, tables, pagination, skeletons, alerts, and messages in many views.
- shadcn/Radix primitives provide cards, buttons, dropdowns, and tables in other views.

---

## Project Structure

```text
frontend/
├── app/
│   ├── layout.tsx                 # metadata + root LayoutProvider
│   ├── page.tsx                   # marketing landing page
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── admin/                     # admin console routes and layout
│   └── user/                      # user workspace routes and layout
├── components/
│   ├── layoutProvider.tsx         # session bootstrap for the whole app
│   ├── refreshToken.tsx           # periodic access-token refresh
│   ├── home.tsx                   # landing page
│   ├── loginPage.tsx
│   ├── signupPage.tsx             # registration + OTP step
│   ├── forgotPassword.tsx         # email + OTP + new password
│   ├── logo.tsx
│   ├── admin/
│   │   ├── adminLayoutProvider.tsx
│   │   ├── adminDashboard.tsx
│   │   ├── analytics.tsx
│   │   ├── adminProfile.tsx
│   │   ├── issues/issue.tsx
│   │   ├── projects/projects.tsx
│   │   ├── reports/userReports.tsx
│   │   ├── reports/contentReports.tsx   # placeholder
│   │   ├── system/serverStatus.tsx
│   │   ├── system/serverLogs.tsx
│   │   └── users/{users,activeUsers,blockedUsers}.tsx
│   ├── user/
│   │   ├── userLayoutProvider.tsx
│   │   ├── userDashboard.tsx
│   │   ├── chat/{chat,chatPage}.tsx
│   │   ├── files/{uploadZIP,fileHistory}.tsx
│   │   ├── issues/{myIssues,activeIssues,closedIssues,createIssue}.tsx
│   │   ├── meetings/{upcomingMeetings,scheduleMeeting,zigoVideoCall,groupVideoCall}.tsx
│   │   ├── profile/profile.tsx
│   │   ├── projects/{allProjects,createProject}.tsx
│   │   └── reports/{craeteReport,reportHistory}.tsx
│   └── ui/                        # shadcn-style primitives
├── lib/
│   ├── http.ts                    # Axios instance
│   ├── fetcher.ts                 # SWR GET fetcher
│   ├── getSession.ts              # session helper
│   ├── socketClient.ts            # Socket.IO singleton
│   ├── clientCatchError.ts        # Ant Design error toast
│   ├── handleLogout.ts            # GET /user/logout
│   └── utils.ts                   # cn() helper
├── public/                        # static assets
├── components.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

Path alias: `@/*` maps to the frontend root (`tsconfig.json`).

---

## Routes

### Public

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `home.tsx` | Marketing page; login button checks session and routes by role. |
| `/login` | `loginPage.tsx` | Email/password login. Redirects to `/admin` or `/user` based on role. |
| `/signup` | `signupPage.tsx` | Two-step registration: create account, then verify a 6-digit OTP. |
| `/forgot-password` | `forgotPassword.tsx` | Request OTP, then submit OTP + new password. |

### User workspace (`/user`)

| Route | Component | Purpose |
| --- | --- | --- |
| `/user` | `userDashboard.tsx` | Counts, recent projects, upcoming meetings, recent issues, activity. |
| `/user/projects` | `allProjects.tsx` | Project cards; add members by email; mark project complete. |
| `/user/projects/create` | `createProject.tsx` | Create a project. |
| `/user/issues` | `myIssues.tsx` | Issues created by or assigned to the user; update status; add comments. |
| `/user/issues/active` | `activeIssues.tsx` | Active issue list from `/issue/active-issue`. |
| `/user/issues/closed` | `closedIssues.tsx` | Closed issues with a comments dropdown. |
| `/user/issues/create-issue` | `createIssue.tsx` | Create an issue and assign a project member. |
| `/user/files/upload` | `uploadZIP.tsx` | Select a project, upload a `.zip` to S3, save metadata. |
| `/user/files/history` | `fileHistory.tsx` | ZIP history with download links. |
| `/user/meetings` | `upcomingMeetings.tsx` | Upcoming meetings and join buttons. |
| `/user/meetings/create` | `scheduleMeeting.tsx` | Schedule a meeting for a project. |
| `/user/meetings/join-meeting/[meetingId]` | `zigoVideoCall.tsx` | Zego group video call for a meeting. |
| `/user/chat` | `chat.tsx` | Project picker for chat. |
| `/user/chat/[projectId]` | `chatPage.tsx` | Persisted project chat + real-time updates. |
| `/user/reports/create-report` | `craeteReport.tsx` | Report a project member. |
| `/user/reports/report-history` | `reportHistory.tsx` | Reports created by the user; delete pending reports. |
| `/user/profile` | `profile.tsx` | Current user profile. |

### Admin console (`/admin`)

| Route | Component | Purpose |
| --- | --- | --- |
| `/admin` | `adminDashboard.tsx` | Platform counts and recent activity. |
| `/admin/users` | `users.tsx` | Paginated user table. |
| `/admin/users/active` | `activeUsers.tsx` | Active users as cards. |
| `/admin/users/blocked` | `blockedUsers.tsx` | Blocked users as cards. |
| `/admin/projects` | `projects.tsx` | Paginated project overview. |
| `/admin/issues` | `issue.tsx` | Paginated issue overview. |
| `/admin/reports/users` | `userReports.tsx` | Review and approve/reject user reports. |
| `/admin/reports/content` | `contentReports.tsx` | Placeholder "coming soon" page. |
| `/admin/analytics` | `analytics.tsx` | User growth, issue/report/project status charts. |
| `/admin/system/status` | `serverStatus.tsx` | Server, memory, CPU, disk, database health. |
| `/admin/system/logs` | `serverLogs.tsx` | Paginated API request logs with filters. |
| `/admin/profile` | `adminProfile.tsx` | Admin profile. |

---

## Feature Walkthrough

### Authentication and session handling

1. `app/layout.tsx` wraps every page in `LayoutProvider`.
2. `LayoutProvider` calls `getSession()` (`GET /user/session`), which reads the `accessToken` cookie through the API.
3. While the session is unresolved, an Ant Design skeleton is shown.
4. Authenticated users visiting `/login` or `/signup` are redirected to `/admin` or `/user` based on role.
5. User and admin layout providers fetch the session again and redirect users to the correct area if the role does not match.
6. `RefreshToken` calls `GET /user/refresh-token` on an interval. The user layout also refreshes through SWR, and the admin layout uses a separate 80-second SWR interval.
7. Logout calls `GET /user/logout`, clears the SWR cache, and routes to `/login`.

The API sets `httpOnly`, `secure`, `sameSite: none` cookies, so the frontend must be served over HTTPS in production and the API must allow the frontend origin with credentials.

### Registration and password reset

- Signup posts `{ fullname, email, password }` to `/user/signup`, then switches to an OTP form and posts `{ email, otp }` to `/user/verify-otp`.
- Forgot password posts `{ email }` to `/user/forgot-password`, then `{ email, otp, newPassword }` to `/user/change-password`.
- Error messages are normalized by `clientCatchError` and displayed with Ant Design `message.error`.

### Projects and membership

- `POST /project` creates a project; the creator becomes `LEAD`.
- `GET /project` lists projects where the current user is a member.
- The project card view can add members by email (`POST /project/:projectId/add-members`) and mark a project complete (`GET /project/:projectId/change-status`).
- The lead is the only member allowed to add members or complete the project (enforced by the API).

### Issues

- Issue creation loads the user's projects, lets the user choose type, priority, and assignee, then posts to `/issue/:projectId`.
- `myIssues.tsx` combines issue listing with status updates (`PATCH /issue/update-issue/:issueId`) and comments (`POST /issue/create-commnet/:issueId`).
- Active and closed tabs use `/issue/active-issue` and `/issue/close-issue`.
- The API only permits comments from the issue assignee or creator, and only lets issues move to `In Progress` or `Closed`.

### ZIP artifact sharing

1. `uploadZIP.tsx` loads the user's projects and accepts `.zip` files up to 13 MB.
2. It requests a presigned S3 PUT URL from `POST /zip/:projectId`.
3. It uploads the file directly to S3 with Axios and progress tracking.
4. It derives the object key from the presigned URL and saves metadata via `POST /zip/save-zip/:projectId`.
5. `fileHistory.tsx` lists `/zip/zip-history` and requests `/zip/download-zip/:zipId` for short-lived download URLs.

The S3 bucket must allow browser `PUT` from the frontend origin for uploads to succeed.

### Chat

- `chat.tsx` lists projects for the current user.
- `chatPage.tsx` loads history from `GET /message/:projectId` and project details from `GET /project/:projectId`.
- Sending posts the message to `POST /message/:projectId` for persistence, then emits `send_group_message` so other connected members receive it immediately.
- Incoming `receive_group_message` events are appended to local state.
- The page joins the Socket.IO room with `join_group_chat` on mount.

### Meetings and video calls

- `scheduleMeeting.tsx` loads projects, blocks past dates with dayjs, and posts `{ projectId, title, description, dateTime }` to `POST /meeting`.
- `upcomingMeetings.tsx` reads `GET /meeting`; join is only shown when the API marks `joinEnabled`.
- The join route uses `zigoVideoCall.tsx`, which reads `GET /meeting/:meetingId`, generates a Zego kit token from the app ID and server secret, and mounts `ZegoUIKitPrebuilt` in group-call mode.
- `groupVideoCall.tsx` is an alternative raw WebRTC implementation using `RTCPeerConnection`, `stun:stun.l.google.com:19302`, and Socket.IO signaling (`register`, `join-room`, `offer`, `answer`, `candidate`). It is not currently wired into a route.

### Reports

- Users report a member of a project with a reason and description (`POST /report`).
- `reportHistory.tsx` lists `GET /report` and allows deleting pending reports (`DELETE /report/:reportId`).
- Admins review reports in `/admin/reports/users` and update status through `PUT /report`.

### Admin console

- Dashboard and analytics read `/admin/dashboard` and `/admin/analytics`.
- User lists read `/admin/users`, `/admin/active-users`, and `/admin/blocked-users` with pagination.
- Projects, issues, and reports use their respective admin listing endpoints.
- Server status reads `/admin/server-status`.
- API logs read `/api-logs` and support status, method, search, page, and limit filters.
- User administration is currently read-only in the UI: active/blocked lists display status but do not expose block/unblock actions.
- Content reports is a placeholder page.

---

## API Usage

The Axios instance in `lib/http.ts` is configured as:

```ts
axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  withCredentials: true,
})
```

Read flows use SWR with `lib/fetcher.ts`; mutation flows use `httpRequest` directly. Notable endpoint usage:

| Area | Endpoints |
| --- | --- |
| Auth | `POST /user/signup`, `POST /user/login`, `POST /user/verify-otp`, `POST /user/forgot-password`, `POST /user/change-password`, `GET /user/session`, `GET /user/refresh-token`, `GET /user/logout` |
| Profile | `GET /user/user-profile` |
| Dashboard | `GET /dashboard` |
| Projects | `GET/POST /project`, `GET /project/:id`, `POST /project/:id/add-members`, `GET /project/:id/change-status` |
| Issues | `GET/POST /issue`, `GET /issue/active-issue`, `GET /issue/close-issue`, `PATCH /issue/update-issue/:id`, `POST /issue/create-commnet/:id` |
| Files | `POST /zip/:projectId`, `POST /zip/save-zip/:projectId`, `GET /zip/zip-history`, `GET /zip/download-zip/:zipId` |
| Meetings | `GET/POST /meeting`, `GET /meeting/:meetingId` |
| Chat | `GET/POST /message/:projectId` |
| Reports | `GET/POST /report`, `DELETE /report/:id`, `PUT /report` |
| Admin | `GET /admin/users`, `/admin/active-users`, `/admin/blocked-users`, `/admin/projects`, `/admin/issues`, `/admin/reports`, `/admin/dashboard`, `/admin/analytics`, `/admin/server-status`, `/admin/admin-profile` |
| Logs | `GET /api-logs` |

---

## Real-time Communication

`lib/socketClient.ts` creates one Socket.IO client at module load:

```ts
io(process.env.NEXT_PUBLIC_SERVER, { withCredentials: true })
```

Events used by the client:

| Event | Used in | Purpose |
| --- | --- | --- |
| `join_group_chat` | `chatPage.tsx` | Join a project chat room. |
| `send_group_message` | `chatPage.tsx` | Broadcast a newly persisted message. |
| `receive_group_message` | `chatPage.tsx` | Append messages from other members. |
| `register` | `groupVideoCall.tsx` | Map user ID to socket for signaling. |
| `join-room` | `groupVideoCall.tsx` | Join a WebRTC signaling room. |
| `offer` / `answer` / `candidate` | `groupVideoCall.tsx` | Exchange WebRTC session descriptions and ICE candidates. |

The singleton connects as soon as it is imported, before authentication is confirmed.

---

## Getting Started

### Prerequisites

- Node.js 20.9+ (Next.js 16 requirement)
- A running DevSync backend
- A Zego account for video calls (if using the join-meeting page)

### Install

```bash
cd frontend
npm install
```

### Configure

Create `.env` (or `.env.local`) in the frontend root:

```env
NEXT_PUBLIC_SERVER=http://localhost:8080
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret
```

For production, point `NEXT_PUBLIC_SERVER` at the deployed API, for example the Render URL used during development.

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

There is no test runner configured.

---

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER` | Yes | Base URL for REST and Socket.IO. Inlined at build time. |
| `NEXT_PUBLIC_ZEGO_APP_ID` | Yes for video | Zego application ID. |
| `NEXT_PUBLIC_ZEGO_SERVER_SECRET` | Yes for video | Zego server secret used by the prebuilt kit token generator. |

All `NEXT_PUBLIC_*` values are embedded in the browser bundle. Do not put private server credentials in a `NEXT_PUBLIC_*` variable.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint with the Next.js config. |

---

## Known Limitations

These reflect the current implementation:

- There is no `middleware.ts`; route protection is client-side. Pages rely on API rejection and layout redirects, and admin/user content can render briefly before the role check completes.
- Session refresh intervals are inconsistent: `refreshToken.tsx` uses 390000 ms (6.5 minutes), the user layout uses 8 minutes, and the admin layout uses 80 seconds.
- `getSession()` returns `null` on any error and does not retry a refresh itself; recovery depends on the periodic refresh component.
- The signup page's **Resend OTP** button has no click handler.
- The login page's **Remember me** checkbox is not used.
- The Zego server secret is exposed through `NEXT_PUBLIC_ZEGO_SERVER_SECRET`, so anyone can read it from the browser bundle.
- `groupVideoCall.tsx` contains a hardcoded meeting ID (`69cd2b8e23714b72eaaa09a4`) and is not connected to any route; the join route uses Zego instead.
- ZIP upload checks project completion against the misspelled `"COMPLTED"` value, so completed projects are not blocked in the UI either.
- The S3 key is extracted from the presigned URL with a substring search for `uploads/`. Because presigned URLs include query parameters, this can produce an invalid stored key.
- The frontend enforces a 13 MB ZIP limit and `.zip` extension only; the API also accepts client-supplied size metadata.
- Admin user pages display status but have no block/unblock actions.
- `/admin/reports/content` is a placeholder.
- The API log page calls the unprotected `/api-logs` endpoint.
- Ant Design and shadcn/Radix are both used, which increases bundle size and creates overlapping design systems.
- `dayjs` is imported directly but is not listed in `package.json`; it currently resolves as a transitive dependency of Ant Design.
- No automated tests are configured.
