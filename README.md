# Calorie Tracker — Frontend

React + TypeScript single-page app for logging meals and daily nutrition intake, with dashboard charts for calories, saturated fat, sugar and salt. Built with Vite and Tailwind, and wrapped for iOS via Capacitor.

The app is a pure client — all data lives in a separate backend service reached over REST.

## Stack

| Concern | Choice |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | react-router-dom 7 |
| Charts | recharts 2 |
| i18n | react-intl 8 (`en` only today) |
| Icons | lucide-react |
| Native shell | Capacitor 8 (iOS) |

## Getting started

Requires Node 18+ and a running backend.

```bash
npm install
cp .env.example .env   # then edit the values
npm run dev            # http://localhost:5173
```

### Environment

Both variables are required at runtime; they are read through `import.meta.env`, so changing them needs a dev-server restart.

| Variable | Meaning |
| --- | --- |
| `VITE_API_BASE_URL` | Backend root, e.g. `http://localhost:3000/api` |
| `VITE_USER_ID` | UUID sent as `userId` on every write. Stands in for auth, which does not exist yet ([src/utils/user.ts](src/utils/user.ts)) |

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | `tsc -b` typecheck, then production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

### iOS

Capacitor is configured to package `dist/` ([capacitor.config.ts](capacitor.config.ts)). After a build:

```bash
npm run build
npx cap add ios      # first time only
npx cap sync ios
npx cap open ios
```

## Project layout

```
src/
  pages/        Dashboard, Records, Meals — one per route
  components/   Layout, Modal, RangeSelector, NoData, PaginationControls
    modals/     RecordModal, MealModal
  hooks/        useChartData (chart range + fetch), useAppIntl (typed messages)
  utils/        requests.ts (fetch wrappers), user.ts (current user id)
  types/        shared API and chart types
  locales/      en.ts message definitions
  data/         mock.ts — seed records/meals plus CATEGORIES and FIELDS constants
```

`@/` is aliased to `src/` in both [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json).

## Routes

| Path | Page | What it does |
| --- | --- | --- |
| `/` | [Dashboard](src/pages/Dashboard.tsx) | Today's intake vs. limits, plus four daily trend charts |
| `/records` | [Records](src/pages/Records.tsx) | Paginated log of eaten meals; create, edit, delete |
| `/meals` | [Meals](src/pages/Meals.tsx) | Paginated meal catalogue with per-100g nutrition |

Unknown paths redirect to `/`.

## Backend contract

All calls go through the helpers in [src/utils/requests.ts](src/utils/requests.ts): `getRequest` (paginated list), `getOneRequest` (single object), `updateRequest` (POST/PUT) and `deleteRequest`, which tolerates the empty body the backend returns on delete.

| Endpoint | Used for |
| --- | --- |
| `GET /records?page&limit` | Records table |
| `POST` / `PUT /records` | Create and edit a record — send `mealId` + `grams`, the backend derives nutrition |
| `DELETE /records/:id` | Remove a record |
| `GET /records/summary?userId&date` | Dashboard "Today's Intake" totals |
| `GET /records/chart?userId&category&period[&start&end]` | Daily totals per chart; `category` is one of `kcal`, `saturatedFat`, `sugar`, `salt` |
| `GET /meals?page&limit` | Meals table and the record form's meal picker |
| `POST` / `PUT /meals`, `DELETE /meals/:id` | Meal catalogue management |

Notes worth knowing when touching this code:

- Records are day-granular and stored at midnight UTC. Dates are read back in UTC so behind-UTC timezones don't slip to the previous day.
- `GET /records/chart` returns `end` exclusive and omits days with no records; [useChartData](src/hooks/useChartData.ts) fills those gaps with zeros so the X axis stays evenly spaced.
- Custom chart ranges are only requested once both `start` and `end` are set — the backend rejects half-filled ranges.

## Known gaps

- No authentication; the user id comes from `VITE_USER_ID`.
- Dashboard limits are component state and reset on reload.
- `src/data/mock.ts` still holds seed data alongside the shared `CATEGORIES` / `FIELDS` constants.
- Only the `en` locale is defined.
