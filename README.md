# Home Library Service

A REST API service for managing a Home Library with Users, Artists, Albums, Tracks, and Favorites.

## Prerequisites

Before you begin, ensure you have:

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Docker Desktop** - [Download & Install Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Make sure Docker Desktop is running before starting the application
- **Docker Hub account** - [Create Docker Hub account](https://hub.docker.com/signup) (optional, only needed for pushing images)
- **Node.js 24.10.0 or higher** - [Download & Install Node.js](https://nodejs.org/en/download/) (optional, only needed for local development without Docker)

## Quick Start

**Fastest way to get started with production mode:**

```bash
# 1. Clone and setup
git clone https://github.com/AnatoliFiv/nodejs2025Q4-service.git
cd nodejs2025Q4-service
git checkout home-library-service-part-2

# 2. Create configuration file
cp .env.example .env

# 3. Start application (make sure Docker Desktop is running)
docker-compose --profile production up app -d

# 4. Wait for startup (30-60 seconds), then check logs
docker-compose --profile production logs -f app
# Press Ctrl+C when you see "Application is running on: http://[::]:4000"

# 5. Verify it's working
# Open in browser: http://localhost:4000/doc/
# Or test with curl:
curl http://localhost:4000/user
```

**Application will be available at:**

- API: http://localhost:4000
- Documentation: http://localhost:4000/doc/

## Development Mode

1. **Ports 4000 and 4001 must be free!**
2. **Purpose:** This mode is designed **exclusively for Hot-Reload functionality**.
3. **Testing:** Do not run tests in this mode (use Production mode for testing).
4. **Container Restart:** Do not attempt to verify the `restart: always` policy in this mode. The watcher (`nest start --watch`) intentionally intercepts application crashes to keep the container running for further code changes. 

Development mode includes **hot-reload** - code changes in `src/` directory are automatically reflected in the running container without restart.

**Quick start for development:**

```bash
# 1. Make sure Docker Desktop is running and .env file exists
cp .env.example .env

# 2. Start development application (includes PostgreSQL)
docker-compose --profile development up app-dev -d

# 3. View logs to see when app is ready
docker-compose --profile development logs -f app-dev
# Press Ctrl+C when you see "Application is running on: http://[::]:4000"

# 4. Verify it's working
# Open in browser: http://localhost:4001/doc/
# Or test with curl:
curl http://localhost:4001/user
```

**Application available at:**

- **API:** http://localhost:4001
- **Documentation:** http://localhost:4001/doc/

**What happens:**

- Development image builds (first time only, may take a few minutes)
- PostgreSQL database container starts automatically
- Application starts with hot-reload enabled
- Your local `src/` directory is mounted for live code updates

**How Hot-Reload Works:**

- Edit any file in `src/` directory on your host machine
- Changes are automatically detected and the application restarts
- No need to rebuild the container or restart manually
- View logs to see changes: `docker-compose --profile development logs -f app-dev`

**Note:** Development mode runs on port 4001 to avoid conflicts with production (port 4000).

## Production Mode (Detailed)

> **Note:** If you followed the [Quick Start](#quick-start) section above, your application is already running! This section provides additional details and troubleshooting.

**⚠️ IMPORTANT: Port 4000 must be free!**

Uses pre-built image from Docker Hub: `flexanatoly/home-library:latest`

**Docker Configuration:**

- **Dockerfile** - Multi-stage build for production image (located in project root)
- **Dockerfile.dev** - Development image with hot-reload support
- **docker-compose.yml** - Orchestrates multi-container application (app + PostgreSQL)
- **.dockerignore** - Excludes unnecessary files from Docker builds

**What happens when you run the command:**

- PostgreSQL database container starts automatically
- Application image downloads from Docker Hub (first time only)
- Application container starts and waits for PostgreSQL to be healthy
- Application becomes available at http://localhost:4000

**Troubleshooting:**

If the application doesn't start:

- **Check that port 4000 is not occupied:**

  ```bash
  # Windows (PowerShell/CMD)
  docker ps | findstr "4000"

  # Linux/Mac
  docker ps | grep "4000"
  ```

  Stop conflicting containers if found: `docker stop <container-name>`

- **Check container status:**

  ```bash
  docker-compose --profile production ps
  ```

- **View detailed logs:**
  ```bash
  docker-compose --profile production logs -f app
  ```

## Security Scanning

Scan for security vulnerabilities in dependencies:

```bash
npm run scan:vulnerabilities
```

This will check all dependencies for known security issues. The script uses `npm audit` with moderate audit level.

## Useful Commands

**Production:**

```bash
# View logs
docker-compose --profile production logs -f app

# Stop containers
docker-compose --profile production down

# Stop and remove all data
docker-compose --profile production down -v

# Check running containers
docker-compose --profile production ps
```

**Development:**

```bash
# View logs
docker-compose --profile development logs -f app-dev

# Stop containers
docker-compose --profile development down

# Stop and remove all data
docker-compose --profile development down -v

# Check running containers
docker-compose --profile development ps
```

**General:**

```bash
# Check image size (should be < 500MB)
# Windows (PowerShell/CMD)
docker images | Select-String "home-library"

# Linux/Mac
docker images | grep "home-library"

# Check all containers status (both profiles)
docker-compose ps

# View PostgreSQL logs
docker-compose logs -f postgres

```

**Important Notes:**

- **Data Persistence:** Database files and logs are stored in Docker volumes (`postgres_data` and `postgres_logs`), so your data persists even after container restart or removal.
- **Network:** Application uses a custom bridge network (`home-library-network`) for secure communication between containers.
- **Auto-restart:** All containers are configured with `restart: always` policy to automatically restart after crashes.

## Running application locally (without Docker)

> **⚠️ Note:** According to the assignment requirements, PostgreSQL should run in Docker container. Local PostgreSQL installation is not required. This section is for advanced users who want to run the application without Docker.
>
> **Important:** The npm scripts (`start`, `start:dev`, `start:prod`) in `package.json` are primarily designed for use inside Docker containers. For local execution, you need to complete all setup steps below.

**Requirements:**

- PostgreSQL must be installed and running locally
- Database must be created and accessible
- `.env` file must be configured with local PostgreSQL connection settings
- Node.js 24.10.0 or higher must be installed

**Steps:**

1. Install PostgreSQL locally and create a database.

2. Create `.env` from example:

   ```bash
   cp .env.example .env
   ```

   Update `.env` file with your local PostgreSQL connection settings (host should be `localhost` instead of `postgres`).

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the application (required for `start:prod`):

   ```bash
   npm run build
   ```

5. Run migrations:

   ```bash
   npm run migration:run
   ```

6. Start application:

   For production mode (requires step 4 - build):

   ```bash
   npm run start:prod
   ```

   Or for development mode with hot-reload (no build required):

   ```bash
   npm run start:dev
   ```

## Using the application

The service provides REST API endpoints for:

- **Users** (`/user`) - Create, read, update, and delete users
- **Artists** (`/artist`) - Manage artists
- **Albums** (`/album`) - Manage albums
- **Tracks** (`/track`) - Manage tracks
- **Favorites** (`/favs`) - Manage favorite artists, albums, and tracks

All endpoints use JSON format for request and response bodies. The API uses UUID v4 for entity identifiers.

### Example API endpoints:

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create new user
- `PUT /user/:id` - Update user password
- `DELETE /user/:id` - Delete user

Similar endpoints are available for `/artist`, `/album`, `/track`, and `/favs`.

For detailed API documentation, visit:

- **Production mode:** http://localhost:4000/doc/
- **Development mode:** http://localhost:4001/doc/

### Example requests for Postman

Copy these curl commands and paste in Postman.

**Note:** Replace `localhost:4000` with `localhost:4001` if you're using development mode.

#### Create a User

```bash
curl -X POST http://localhost:4000/user \
  -H "Content-Type: application/json" \
  -d '{
    "login": "john_doe",
    "password": "password123"
  }'
```

#### Get all Users

```bash
curl -X GET http://localhost:4000/user
```

#### Get User by ID

```bash
curl -X GET http://localhost:4000/user/{userId}
```

_Note: Replace `{userId}` with actual user ID from create user response._

#### Create an Artist

```bash
curl -X POST http://localhost:4000/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "The Beatles",
    "grammy": true
  }'
```

#### Create an Album

```bash
curl -X POST http://localhost:4000/album \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Abbey Road",
    "year": 1969,
    "artistId": "{artistId}"
  }'
```

_Note: Replace `{artistId}` with actual artist ID from create artist response, or use `null`._

#### Create a Track

```bash
curl -X POST http://localhost:4000/track \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Come Together",
    "duration": 259,
    "artistId": "{artistId}",
    "albumId": "{albumId}"
  }'
```

_Note: Replace `{artistId}` and `{albumId}` with actual IDs from previous requests, or use `null`._

#### Update an Artist

```bash
curl -X PUT http://localhost:4000/artist/{artistId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "The Beatles Updated",
    "grammy": false
  }'
```

_Note: Replace `{artistId}` with actual artist ID from create artist response._

#### Delete an Album

```bash
curl -X DELETE http://localhost:4000/album/{albumId}
```

_Note: Replace `{albumId}` with actual album ID from create album response._

#### Add Track to Favorites

```bash
curl -X POST http://localhost:4000/favs/track/{trackId}
```

_Note: Replace `{trackId}` with actual track ID from create track response._

#### Get all Favorites

```bash
curl -X GET http://localhost:4000/favs
```

#### Remove Track from Favorites

```bash
curl -X DELETE http://localhost:4000/favs/track/{trackId}
```

_Note: Replace `{trackId}` with actual track ID._

## Testing

**⚠️ IMPORTANT: Application must be running before running tests!**

**For Docker:**

- Ensure the production container is active: `docker-compose --profile production up app -d`.
- _Note: Testing against development container is not supported due to port configuration._

To manually test that the container recovers from a crash:

1.  **Modify `src/app.service.ts`** to simulate a crash:
    ```typescript
    import { Injectable } from '@nestjs/common';
    @Injectable()
    export class AppService {
      getHello() {
        // Crash the application after 3 seconds
        setTimeout(() => {
          console.error('💥💥💥 EXITING WITH CODE 1 💥💥💥');
          process.exit(1);
        }, 3000);
      }
    }
    ```
2.  **Update `docker-compose.yml`** to build the production image from your local source (with the crash code) instead of pulling it from Docker Hub.
    Find the `app` service and change it as follows:
    ```yaml
    app:
      # image: flexanatoly/home-library:latest  # <--- Comment this out
      build:                                    # <--- Add this block
        context: .
        dockerfile: Dockerfile
    ```
3.  **Rebuild and run:**
    ```bash
    docker-compose --profile production up --build app
    ```
4.  **Check Logs:**
    Open Docker Desktop dashboard or view logs in terminal. When you access the API, you will see the error message and confirm that Docker automatically restarts the container.


### Security scanning

```bash
# Scan for security vulnerabilities in dependencies
npm run scan:vulnerabilities
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
