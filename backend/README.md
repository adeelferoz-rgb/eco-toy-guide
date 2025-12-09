# Eco Toy Guide - Backend

FastAPI backend for the Eco Toy Guide application with MongoDB database.

## Setup

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the backend directory with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   DATABASE_NAME=ecotoyguide
   SECRET_KEY=your_secret_key_here
   ```

## Running the Application

### Option 1: Direct Python execution (Recommended)
```bash
python main.py
```

### Option 2: Using uvicorn module
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### Option 3: Using uvicorn directly
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at: http://localhost:8000

## API Documentation

Once running, view the interactive API docs at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Seeding Data

To populate the database with sample data:

```bash
# Seed certifications
python scripts/seed_certifications.py

# Seed toys
python scripts/seed_toys.py
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # API route handlers
│   │   ├── auth.py
│   │   ├── certifications.py
│   │   ├── toys.py
│   │   └── users.py
│   ├── core/                # Core functionality
│   │   ├── config.py        # Configuration management
│   │   └── security.py      # Authentication & security
│   ├── models/              # Pydantic models
│   │   ├── certification.py
│   │   ├── toy.py
│   │   └── user.py
│   └── services/            # Business logic
│       └── recommendation.py
├── scripts/                 # Utility scripts
│   ├── seed_certifications.py
│   └── seed_toys.py
├── main.py                  # Direct execution entry point
└── requirements.txt         # Python dependencies
```

## API Endpoints

### System
- `GET /api/v1/healthz` - Health check

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user

### Certifications
- `GET /api/v1/certifications` - List all certifications

### Toys
- `GET /api/v1/toys` - List toys (with filters)
- `GET /api/v1/toys/{id}` - Get toy details

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update user profile
- `GET /api/v1/users/me/saved-toys` - Get saved toys
- `POST /api/v1/users/me/saved-toys/{toy_id}` - Save a toy
- `DELETE /api/v1/users/me/saved-toys/{toy_id}` - Unsave a toy
