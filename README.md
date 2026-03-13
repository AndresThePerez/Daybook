# Note Application

A full-stack note management application built with **Laravel 12** and **React 18**. Create, organize, and manage notes across custom categories with a clean, responsive interface.

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.4), MySQL 8, Redis
- **Frontend:** React 18, React Bootstrap 5, React Router 7, Vite
- **Infrastructure:** Docker Compose, Nginx, Terraform (AWS), GitHub Actions CI/CD

## Features

- CRUD operations for notes and categories
- Categorize notes with a flexible tagging system
- Soft deletes with a history/recycle bin view
- Redis-backed caching for read endpoints
- Rate limiting at both the Nginx and Laravel middleware layers
- Production-grade error handling (no stack traces exposed)
- Responsive Bootstrap UI with fixed-width table layouts

## Quick Start (Local Development)

### Prerequisites

- Docker and Docker Compose
- PHP 8.4 and Composer
- Node.js 18+

### Setup

```bash
# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Start services (app, MySQL, Redis)
./vendor/bin/sail up -d

# Compile frontend assets (with hot reload)
./vendor/bin/sail npm run dev

# Run migrations and seed the database
./vendor/bin/sail artisan migrate --seed
```

Open [http://localhost](http://localhost) in your browser.

## Production Deployment

This project includes Terraform configs for deploying to an AWS EC2 instance and a GitHub Actions workflow for automated deploys on push to `master`.

See [`HANDOFF.md`](HANDOFF.md) for the full deployment guide.

```bash
# Production build and deploy (on the server)
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

## Project Structure

```
app/
  Controllers/Base/   # BaseController with shared CRUD + caching logic
  Exceptions/         # Generic error responses for API consumers
  Models/             # Notes, Categories with soft deletes
  Providers/          # Rate limiter configuration
resources/js/
  components/
    Base/             # Header/navbar
    Notes/            # Note CRUD components
    Categories/       # Category CRUD components
    History/          # Soft-deleted records view
docker/               # Nginx and Supervisor configs for production
terraform/            # AWS EC2 infrastructure as code
.github/workflows/    # CI/CD pipeline
```

## API Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/notes/showAll` | List all notes | 60/min |
| GET | `/api/notes/{id}` | Get a single note | 60/min |
| GET | `/api/notes/history` | Soft-deleted notes | 60/min |
| POST | `/api/notes/create` | Create a note | 15/min |
| PUT | `/api/notes/edit/{id}` | Update a note | 15/min |
| DELETE | `/api/notes/delete/{id}` | Soft-delete a note | 15/min |
| GET | `/api/categories/showAll` | List all categories | 60/min |
| GET | `/api/categories/{id}` | Get a single category | 60/min |
| POST | `/api/categories/create` | Create a category | 15/min |
| PUT | `/api/categories/edit/{id}` | Update a category | 15/min |
| DELETE | `/api/categories/delete/{id}` | Soft-delete a category | 15/min |

## License

MIT
