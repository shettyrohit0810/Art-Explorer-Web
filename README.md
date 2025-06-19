# Artsy Artist Search App

A full-stack web application for searching and managing favorite artists using the Artsy API.

## Features

- Artist search and discovery
- User authentication (register/login)
- Favorite artists management
- Artist details and similar artists
- Responsive design with Bootstrap

## Tech Stack

- **Frontend**: Angular 19, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **External API**: Artsy API

## Deployment to Netlify

### Prerequisites

1. **MongoDB Atlas Account**: Set up a free MongoDB cluster
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **GitHub Repository**: Push your code to GitHub

### Environment Variables

Set these environment variables in your Netlify dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/artsy-app
JWT_SECRET=your-super-secret-jwt-key
ARTSY_CLIENT_ID=your-artsy-client-id
ARTSY_CLIENT_SECRET=your-artsy-client-secret
FRONTEND_URL=https://your-app-name.netlify.app
```

### Deployment Steps

1. **Connect to GitHub**:
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**:
   - Build command: `npm run build:all`
   - Publish directory: `frontend/dist/frontend/browser`

3. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory with the same variables as above.

3. **Run the application**:
   ```bash
   # Terminal 1 - Backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

4. **Access the app**:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/artists/search` - Search artists
- `GET /api/artists/:id` - Get artist details
- `GET /api/artists/:id/similar` - Get similar artists
- `GET /api/favorites` - Get user favorites
- `GET /api/favorites/add` - Add to favorites
- `GET /api/favorites/remove` - Remove from favorites
- `GET /api/genes` - Get art categories

## Project Structure

```
├── app.js                 # Main server file
├── netlify.toml          # Netlify configuration
├── functions/
│   └── api.js           # Netlify serverless function
├── controllers/          # Backend controllers
├── models/              # Database models
├── routes/              # API routes
├── services/            # External API services
└── frontend/            # Angular application
    ├── src/
    │   ├── app/         # Angular components
    │   ├── environments/ # Environment configs
    │   └── assets/      # Static assets
    └── package.json
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are installed
2. **API calls fail**: Verify environment variables are set correctly
3. **Database connection fails**: Ensure MongoDB URI is correct
4. **CORS errors**: Check FRONTEND_URL environment variable

### Support

For issues related to:
- **Netlify deployment**: Check Netlify build logs
- **MongoDB**: Verify connection string and network access
- **Artsy API**: Ensure API credentials are valid 