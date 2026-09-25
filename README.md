# Bulldogs Exchange (razon-webprog) — Long Exam 1

Frontend (`razon-client`, React/Vite/Tailwind) wired to the existing backend
(`razon-server`, Node/Express/Mongoose) for CTADWEBL Long Exam 1.

## What changed

**Server (`razon-server`)** — two small, targeted additions, everything else
untouched:
- `GET /api/v1/users/:id` — a user can view their own profile (Admins can view
  anyone's). Needed for the Profile page; previously the only "list users"
  route was Admin-only.
- `POST /api/v1/users/register` no longer trusts a `role` field from the
  request body — public sign-up is always `Customer`. (Previously anyone
  could POST `role: "Admin"` in Postman and self-promote, which would have
  undercut the RBAC grading criterion.)

**Client (`razon-client`)** — the previous frontend used mock data
(`product-content.js`) and static forms with no `onSubmit`. It's now fully
wired to the API:
- `src/services/` — one file per resource (`user`, `product`, `category`,
  `cart`, `order`, `review`), all going through a shared `api.js` axios
  instance that attaches the JWT automatically.
- `src/context/AuthContext.jsx` — login/register/logout, session persisted
  in `localStorage`, decodes the JWT for the user id.
- `src/components/ProtectedRoute.jsx` — route guard; `roles={['Admin']}`
  enforces RBAC on top of just requiring login.
- Public pages (`/`, `/about`, `/products`, `/products/:id`) now fetch real
  products/categories/reviews, with search + category filtering.
- Customer pages: `/cart`, `/orders`, `/account/profile`.
- Admin pages: `/admin/products`, `/admin/orders`, `/admin/reviews`,
  `/admin/users` — full CRUD / status management, guarded to `Admin` only.
- Every form/page surfaces server errors (auth/authorization/validation/500)
  through a shared `Alert` component instead of failing silently.

## Running it locally

**1. Server**
```bash
cd razon-server
npm install
npm run dev        # nodemon, uses the existing .env (Mongo URI, JWT secret, PORT)
```

**2. Client**
```bash
cd razon-client
npm install
npm run dev         # Vite dev server, defaults to http://localhost:5173
```

The client's `.env` points at `VITE_API_URL=http://localhost:8000/api` — update
it if your server runs on a different port/host.

## Creating the first Admin account

Public sign-up always creates a `Customer` (by design — see above). To get
your first Admin:
1. Register normally through the app (or Postman) as a regular user.
2. In MongoDB Compass/Atlas (or `mongosh`), open the `users` collection and
   change that user's `role` field from `"Customer"` to `"Admin"`.
3. Log out and back in — the new JWT will carry the Admin role, and
   `/admin/...` will unlock.

From then on, that Admin can create further Admins from **Admin → Users →
Edit → Role**, or through `POST /api/v1/users` (Admin-only route).

## Notes / known limitations (given the current API surface)

- The cart API has no "get my cart" endpoint — the client fetches all carts
  and filters by `userId` client-side (`src/utils/cart.js`). Fine for a
  class-sized dataset; wouldn't scale as-is.
- Product `image` is a plain URL text field (no file upload endpoint exists
  on the server), so the admin product form takes an image URL rather than
  a file.
- Order status uses the existing schema enum (`Pending / Processing /
  Shipped / Delivered / Cancelled`). The Admin Orders page labels
  `Processing` as "Confirm Order" and `Shipped` as "Ready for Claiming" to
  match the exam brief's wording, since the schema wasn't changed.
