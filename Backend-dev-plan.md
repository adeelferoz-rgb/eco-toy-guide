# Backend Development Plan — Handover Agent

## 1️⃣ Executive Summary
- **Goal:** Build a scalable FastAPI backend for "silent-capybara-soar" (Eco Toy Guide) to replace static frontend placeholders with real database content and user authentication.
- **Constraints:**
  - **Tech Stack:** FastAPI (Python 3.13), MongoDB Atlas (Motor), Pydantic v2.
  - **Infrastructure:** No Docker, local development connecting to Atlas.
  - **Process:** Single-branch (`main`), manual testing per task.
- **Plan:** 5 Sprints (S0–S4) to cover Environment, Auth, Certifications, Toy Discovery, and User Preferences.

---

## 2️⃣ In-Scope & Success Criteria
### In-Scope Features
- **System:** Health check, CORS, MongoDB connection.
- **Auth:** Signup, Login (JWT), Logout.
- **Certifications:** Read-only API to replace static frontend data.
- **Toys:** Public discovery API (List/Search).
- **User:** "Saved Toys" functionality (Add/Remove/List).

### Success Criteria
- ✅ All frontend pages (`/`, `/discover`, `/certifications`, `/saved`) fetch data from API.
- ✅ Users can register, log in, and persist their saved toys across sessions.
- ✅ All tasks pass manual UI verification steps.
- ✅ Code pushed to `main` after each sprint.

---

## 3️⃣ API Design
**Base Path:** `/api/v1`  
**Error Format:** `{ "error": "Detailed error message" }`

### System
- `GET /healthz` — Returns DB status `{ "status": "ok", "db": "connected" }`.

### Auth
- `POST /auth/signup` — `{ email, password }` → `{ id, email }`.
- `POST /auth/login` — `{ email, password }` → `{ access_token, token_type }`.
- `POST /auth/logout` — Clear session (client-side mostly, endpoint optional for future).

### Certifications
- `GET /certifications` — Returns list of certification objects.

### Toys
- `GET /toys` — Returns list of toys (supports simple pagination/filtering if needed).
- `GET /toys/{id}` — Returns single toy details.

### Saved Toys
- `GET /users/me/saved-toys` — Returns list of toys saved by current user.
- `POST /users/me/saved-toys/{toy_id}` — Adds toy to saved list.
- `DELETE /users/me/saved-toys/{toy_id}` — Removes toy from saved list.

---

## 4️⃣ Data Model (MongoDB Atlas)

### `users` Collection
- `_id`: ObjectId
- `email`: String (Unique, Required)
- `password_hash`: String (Required)
- `created_at`: DateTime
- `saved_toy_ids`: List[ObjectId] (References `toys`)
- **Example:**
  ```json
  {
    "email": "user@example.com",
    "password_hash": "$argon2id$...",
    "saved_toy_ids": ["60d5ec...", "60d5ed..."]
  }
  ```

### `certifications` Collection
- `_id`: ObjectId
- `slug`: String (Unique, e.g., "fsc")
- `name`: String
- `logo`: String (URL)
- `description`: String
- `meaning`: String
- `impact`: String
- **Example:**
  ```json
  {
    "slug": "fsc",
    "name": "FSC",
    "description": "Responsibly managed forests..."
  }
  ```

### `toys` Collection
- `_id`: ObjectId
- `name`: String
- `description`: String
- `image_url`: String
- `certification_ids`: List[ObjectId] (Optional)
- `created_at`: DateTime
- **Example:**
  ```json
  {
    "name": "Wooden Stacker",
    "description": "Eco-friendly stacking toy.",
    "image_url": "/placeholder.svg"
  }
  ```

---

## 5️⃣ Frontend Audit & Feature Map

| Page / Component | Feature | Backend Need | Auth Required? |
|------------------|---------|--------------|----------------|
| `Header.tsx` | Login/Profile | `POST /auth/login`, `POST /auth/logout` | No (for view) |
| `Certifications.tsx` | List Certs | `GET /certifications` | No |
| `Index.tsx` | Discover Toys | `GET /toys` | No |
| `SavedToys.tsx` | Saved List | `GET /users/me/saved-toys` | **Yes** |
| `SavedToys.tsx` | Toggle Save | `POST/DELETE /users/me/saved-toys/{id}` | **Yes** |

---

## 6️⃣ Configuration & ENV Vars
- `APP_ENV`: `development`
- `PORT`: `8000`
- `MONGODB_URI`: `mongodb+srv://...`
- `JWT_SECRET`: `[Generated Secret]`
- `JWT_EXPIRES_IN`: `86400` (1 day)
- `CORS_ORIGINS`: `http://localhost:5173,http://localhost:3000`

---

## 7️⃣ Testing Strategy (Manual)
- **Philosophy:** Verify every API change via the Frontend UI.
- **Workflow:**
  1. Implement Backend Task.
  2. Update Frontend to use new Endpoint.
  3. **Execute Manual Test Step.**
  4. Pass → Commit & Push.

---

## 🔟 Dynamic Sprint Plan & Backlog

### 🧱 S0 – Environment & Foundation
**Objectives:** Init project, Connect DB, Health Check.
- **Task 1: Setup FastAPI Skeleton**
  - Init `app/main.py`, `app/core/config.py`.
  - Add CORS middleware.
  - *Manual Test:* Visit `http://localhost:8000/docs` → UI Loads.
  - *User Prompt:* "Start server and check if Swagger UI is accessible."
- **Task 2: MongoDB Atlas Connection**
  - Implement `AsyncIOMotorClient`.
  - Add `/healthz` endpoint checking DB ping.
  - *Manual Test:* `curl http://localhost:8000/api/v1/healthz` → `{"status": "ok"}`.
  - *User Prompt:* "Hit the health endpoint and confirm DB connection status."
- **Task 3: Git Init**
  - Init repo, add `.gitignore`, push to `main`.

### 🧩 S1 – Auth (Signup/Login)
**Objectives:** Secure User Access.
- **Task 1: User Model & Signup**
  - Create `users` collection logic.
  - Implement `POST /auth/signup`.
  - Frontend: Create basic Signup Form (or use existing Header link).
  - *Manual Test:* Submit form → DB shows new user.
  - *User Prompt:* "Register a new user via the UI and check console for success."
- **Task 2: Login & JWT**
  - Implement `POST /auth/login` (issue JWT).
  - Frontend: Store token in `localStorage`.
  - *Manual Test:* Login → Token appears in Application Storage.
  - *User Prompt:* "Log in with valid credentials and verify JWT storage."
- **Task 3: Logout**
  - Frontend: Clear token on Logout click.
  - *Manual Test:* Click Logout → Token removed.
  - *User Prompt:* "Click logout and ensure session is cleared."

### 📜 S2 – Certifications (Data Migration)
**Objectives:** Serve dynamic certification data.
- **Task 1: Certification Model & Seeding**
  - Create model. Create a seed script to insert data from `frontend/src/data/certifications.ts` into MongoDB.
  - *Manual Test:* Run seed script → DB populated.
  - *User Prompt:* "Run the seed command and check MongoDB Atlas collection."
- **Task 2: Certifications API & UI Integration**
  - Implement `GET /certifications`.
  - Frontend: Update `Certifications.tsx` to fetch from API.
  - *Manual Test:* Reload Certifications page → Cards render exactly as before but from DB.
  - *User Prompt:* "Refresh Certifications page. Data should load from backend."

### 🧸 S3 – Toy Discovery
**Objectives:** List Toys dynamically.
- **Task 1: Toy Model & Seeding**
  - Create `Toy` model. Seed 5-10 dummy eco-toys.
  - *Manual Test:* Check `toys` collection in Atlas.
  - *User Prompt:* "Verify toys collection has seed data."
- **Task 2: Toys List API & UI**
  - Implement `GET /toys`.
  - Frontend: Update `Index.tsx` to fetch and map toys (replace placeholder text with simple grid).
  - *Manual Test:* Home page shows list of toys.
  - *User Prompt:* "Visit home page and confirm toy list is visible."

### ❤️ S4 – Saved Toys (User Features)
**Objectives:** Personalization.
- **Task 1: Toggle Save API**
  - Implement `POST` and `DELETE` for `/users/me/saved-toys/{id}`.
  - *Manual Test:* Swagger UI → Execute Save → DB updates user doc.
  - *User Prompt:* "Use Swagger to save a toy ID to your user."
- **Task 2: Saved Toys List API**
  - Implement `GET /users/me/saved-toys` (populate toy details).
  - *Manual Test:* Swagger UI → Execute Get → Returns saved toy details.
  - *User Prompt:* "Retrieve saved toys via API."
- **Task 3: Frontend Integration**
  - Frontend: Add "Heart" button to Toy cards on Home.
  - Frontend: Update `SavedToys.tsx` to fetch list.
  - *Manual Test:* Click Heart on Home → Appears in Saved page.
  - *User Prompt:* "Save a toy from home page, then check the Saved Toys page."