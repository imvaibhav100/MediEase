## Deploy to Render

This project runs as two services on Render: a Java Spring Boot backend and a React static frontend.

### Prerequisites: MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Sign up
2. Create a **Free M0 Cluster** (select closest region, e.g., Mumbai)
3. **Database Access** → Add user (username + password, "Read and write to any database")
4. **Network Access** → Add IP (choose "Allow Access from Anywhere" for simplicity)
5. **Connect** → "Connect Your Application" → Copy connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/pharmacydb?retryWrites=true&w=majority
   ```
   (Replace `<user>`, `<password>`, and add `/pharmacydb` database name)
   **Important**: URL-encode special characters in password (e.g., `@` → `%40`)

### Environment Variables Setup

**Backend (Render Dashboard):**
- `SPRING_DATA_MONGODB_URI` = your Atlas connection string (with encoded password)
- `PORT` = auto-set by Render

**Frontend (Render Dashboard):**
- `REACT_APP_API_URL` = your backend URL (e.g., `https://MediEase-backend.onrender.com`)

- Backend (Web Service):
	- Type: Web Service
	- Build: Docker (see backend/Dockerfile)
	- Port: Render sets `PORT`; backend reads `server.port=${PORT:8080}`
	- **Required Env**: `SPRING_DATA_MONGODB_URI` = your Atlas connection string

- Frontend (Static Site):
	- Root directory: `front`
	- Build command: `npm install && npm run build`
	- Publish directory: `build`
	- Env vars: `REACT_APP_API_URL` → your backend URL (e.g., https://MediEase-backend.onrender.com)

### Using render.yaml (Blueprint)

1. Push this repo to GitHub.
2. In Render → New → Blueprint, select the repo. It will create:
	 - `MediEase-backend` (Docker web service, using backend/Dockerfile)
	 - `MediEase-front` (Static site from `front`)
3. After backend deploys, open the frontend service → add env `REACT_APP_API_URL` = backend URL.
4. Click “Clear cache & redeploy” for the frontend to rebuild with the env.

### Manual setup (without Blueprint)

- Backend:
	- New → Web Service → Use Docker → path `backend/Dockerfile`
	- Optional: add `SPRING_DATA_MONGODB_URI` env var

- Frontend:
	- New → Static Site
	- Root: `front`
	- Build: `npm install && npm run build`
	- Publish: `build`
	- Add env `REACT_APP_API_URL` = backend URL, then redeploy

### Local checks

- Backend:
	- `cd backend && mvnw.cmd -DskipTests clean package`
	- Run locally: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- Frontend:
	- `cd front && npm install && npm run build`

# MediEase