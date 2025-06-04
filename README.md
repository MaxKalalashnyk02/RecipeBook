# Recipe Book - Full-Stack Application

A full-stack recipe application built with **Node.js/Express** (backend) and **Next.js/React** (frontend), featuring recipes from TheMealDB API.

## 🎯 Assessment Completion Status

### ✅ **Completed Requirements:**

**Backend (Node.js + Express + TypeScript):**
- ✅ Recipe filtering endpoint (ingredient, country, category, search)
- ✅ Recipe details endpoint
- ✅ TheMealDB API integration
- ✅ TypeScript implementation
- ✅ CORS configuration
- ✅ Error handling and response standardization

**Frontend (Next.js + React + TypeScript):**
- ✅ Recipe list page with dynamic filtering
- ✅ Recipe detail page with full information display
- ✅ Clickable navigation (country, ingredients, category)
- ✅ Right sidebar with category recipes
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript implementation

**Additional Requirements:**
- ✅ Responsive UI with Tailwind CSS
- ✅ Environment variables configuration
- ✅ ESLint and Prettier setup
- ✅ Comprehensive documentation
- ✅ Separate frontend/backend folders
- ✅ Parallel execution on different ports

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and navigate to the project:**
```bash
git clone <repository-url>
cd recipe-book
```

2. **Backend Setup:**
```bash
cd backend
npm install
npm run dev
```
Backend will run on: `http://localhost:3001`

3. **Frontend Setup (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:3000`

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
MEAL_DB_BASE_URL=https://www.themealdb.com/api/json/v1/1
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 📁 Project Structure

```
recipe-book/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript interfaces
│   │   ├── app.ts          # Express app configuration
│   │   └── server.ts       # Server entry point
│   ├── .env                # Backend environment variables
│   ├── .eslintrc.js        # ESLint configuration
│   ├── .prettierrc         # Prettier configuration
│   └── package.json
│
├── frontend/               # Next.js application
│   ├── app/               # App router pages
│   ├── lib/               # API services and utilities
│   ├── .env.local         # Frontend environment variables
│   └── package.json
│
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Next.js linter
```

## 🌐 API Endpoints

### Base URL: `http://localhost:3001`

| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|------------------|
| `/api/recipes` | GET | Get recipes with optional filtering | `ingredient`, `country`, `category`, `search` |
| `/api/recipes/:id` | GET | Get detailed recipe information | - |
| `/api/recipes/category/:category` | GET | Get recipes by category (for sidebar) | - |
| `/health` | GET | Health check endpoint | - |

### Example API Calls:
```bash
# Get all recipes
GET /api/recipes

# Filter by ingredient
GET /api/recipes?ingredient=chicken

# Filter by country
GET /api/recipes?country=Italian

# Filter by category
GET /api/recipes?category=Dessert

# Search recipes
GET /api/recipes?search=pasta

# Get recipe details
GET /api/recipes/52772

# Get category recipes
GET /api/recipes/category/Seafood
```

## 🎨 Features

### Recipe List Page
- Dynamic page titles based on active filters
- Search functionality
- Filter by ingredient, country, or category
- Responsive grid layout
- Recipe cards with images and metadata
- Filter indicators with clear options

### Recipe Detail Page
- Full recipe information display
- Ingredient list with clickable ingredients
- Step-by-step instructions
- Recipe metadata (country, category, tags)
- YouTube video integration
- Related recipes sidebar
- Responsive layout

### Navigation Features
- Click country → filter by country recipes
- Click ingredient → filter by ingredient recipes
- Click category → filter by category recipes
- Related recipes in sidebar
- Breadcrumb navigation

## 🛠️ Technical Implementation

### Backend Architecture
- **Express.js** with TypeScript
- **Modular controller** pattern
- **Centralized error handling**
- **Standardized API responses**
- **CORS configuration** for cross-origin requests
- **Environment-based configuration**

### Frontend Architecture
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Server-side rendering** capabilities
- **Responsive design** patterns

### Code Quality
- **ESLint** configuration for both frontend and backend
- **Prettier** for consistent code formatting
- **TypeScript** for type safety
- **Error boundary** implementation
- **Loading states** and error handling

## 🔍 API Integration

The application integrates with [TheMealDB API](https://www.themealdb.com/api.php) to provide:
- Recipe search and filtering
- Detailed recipe information
- Ingredient and instruction data
- Recipe images and metadata

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure both servers are running
   - Check frontend URL in backend CORS config

2. **Port Conflicts:**
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:3000`
   - Update ports in environment variables if needed

3. **Environment Variables:**
   - Ensure `.env` files are created in both directories
   - Restart servers after environment changes

4. **Network Errors:**
   - Verify backend server is running before starting frontend
   - Check browser console for specific error messages

## 📝 Notes

- Both servers must run simultaneously for full functionality
- The frontend makes API calls to the backend, which then fetches data from TheMealDB
- All recipe data is sourced from the free TheMealDB API
- The application is fully responsive and works on mobile devices
- ESLint and Prettier are configured for consistent code quality

## 🤝 Development

To contribute or extend this application:

1. Follow the established code patterns
2. Run linting before commits: `npm run lint`
3. Format code: `npm run format`
4. Test both frontend and backend functionality
5. Update documentation as needed

---

**Built with ❤️ using Node.js, Express, Next.js, React, and TypeScript** 