# Environment Setup Guide

## Backend Environment Variables

Create a file named `.env` in the `backend/` directory with the following content:

```
PORT=3001
MEAL_DB_BASE_URL=https://www.themealdb.com/api/json/v1/1
```

## Frontend Environment Variables

Create a file named `.env.local` in the `frontend/` directory with the following content:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Quick Setup Commands

You can use these commands to quickly create the environment files:

### Backend
```bash
cd backend
echo "PORT=3001" > .env
echo "MEAL_DB_BASE_URL=https://www.themealdb.com/api/json/v1/1" >> .env
```

### Frontend
```bash
cd frontend
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3001" > .env.local
``` 