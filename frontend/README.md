# Eco Toy Guide - Frontend

A React-based web application for discovering eco-friendly toys with personalized recommendations.

## Environment Setup

This project uses environment variables for configuration. To get started:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.development
   ```

2. Update the values in `.env.development`:
   ```bash
   VITE_API_URL=http://localhost:8000/api/v1
   ```

For production deployment, create `.env.production` with your production API URL.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build with development settings
- `npm run preview` - Preview production build locally

## Environment Variables

- `VITE_API_URL` - The base URL for the backend API (required)
