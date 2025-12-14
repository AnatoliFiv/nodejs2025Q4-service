# Home Library Service

A REST API service for managing a Home Library with Users, Artists, Albums, Tracks, and Favorites.
Fully containerized with Docker, includes **Authentication (JWT)** and **Custom Logging**.

## Prerequisites

Before you begin, ensure you have:

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Docker Desktop** - [Download & Install Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Make sure Docker Desktop is running before starting the application
- **Node.js 24.10.0 or higher** - [Download & Install Node.js](https://nodejs.org/en/download/) (optional, only needed for local development without Docker)

## Quick Start

**Fastest way to get started with production mode:**

```bash
# 1. Clone and setup
git clone https://github.com/AnatoliFiv/nodejs2025Q4-service.git
cd nodejs2025Q4-service
git checkout home-library-service-part-3

# 2. Create configuration file
cp .env.example .env

# 3. This command builds the local image and starts the container with necessary volume permissions.
npm run docker:prod

# 4. Ypu could see logs inside console
npm run docker:prod:logs
```

**Application will be available at:**

- API: http://localhost:4000
- Documentation: http://localhost:4000/doc/ (not updated; this task is not required))
---

## Run Automated Tests ##
This is the primary verification method for Auth and Refresh Token logic.
> ⚠️ Note: Application containers (npm run docker:prod) must be running before starting tests.

Run All Tests (With Authentication Mode enabled)
```bash
   npm run test:auth
```
Run Refresh Token E2E tests specifically.
```bash
   npm run test:refresh
```

**Check Logging & Files:**

***Log Rotation Mechanism:***
The application writes logs manually (no external libraries). When application.log reaches LOG_MAX_FILE_SIZE_KB:
Files are shifted: log.2 -> log.3, log.1 -> log.2.
Current application.log -> application.log.1.
New logs go to empty application.log.
The oldest file (e.g., log.5) is deleted.

**For Production Mode:** The logs are stored inside a secure Docker Volume.
To view files, you should run this commands step by step
1. docker exec -it home-library-app sh
2. ls -l logs
3. cat logs/application.log (choose any log files)
4. exit

## Development Mode
**Note:** Development mode runs on port 4000 (same as production). Make sure to stop and clen production container before starting development mode.
1. **Port 4000 must be free!**
2. **Purpose:** This mode is designed **exclusively for Hot-Reload and logs functionality**.

**Quick start for development:**

```bash
# 1. Make sure Docker Desktop is running and .env file exists
cp .env.example .env
```
## 🛠 Development Mode

```
  npm run docker:dev       # Start
  npm run docker:dev:logs  # Watch logs
  npm run docker:dev:down  # Stop
```

**Check Logging & Files DEV:**
*   **For Development Mode:** Logs appear directly in `./logs` inside project.

**Application available at:**

- **API:** http://localhost:4000
- **Documentation:** http://localhost:4000/doc/


## ⚠️ Troubleshooting

If you encounter issues running the application, please check the following:

1.  **Port Conflict:** Ensure port `4000` is free.
2. **Old volumes and images** can be removed manually using Docker Desktop
3. **Permissions / Caching issues:** If the app behaves unexpectedly, remove old volumes/images and rebuild:
   
```bash
    docker-compose down -v
    docker rmi home-library-service:prod
    npm run docker:prod
  ```
---

## Configuration (.env) ##
The .env.example file comes pre-configured with values suitable for review. You can adjust them if needed.

🔐 Auth Configuration (Task 3)
Variable	Value	Description
- **JWT_SECRET_KEY=secret...** - Secret for signing Access Token.
- **JWT_SECRET_REFRESH_KEY=secret...** - Secret for signing Refresh Token.
- **TOKEN_EXPIRE_TIME=1h** - Access Token lifetime.
- **TOKEN_REFRESH_EXPIRE_TIME=24h**	- Refresh Token lifetime (must be > Access).

🔍 **Logging Configuration (Task 3)**

| Variable | Value | Description                                        |
| :--- | :--- |:---------------------------------------------------|
| `LOG_LEVEL` | `2` | 0: ERROR, 1: WARN, 1, LOG: 2, DEBUG: 3, VERBOSE: 4 |

**LOG_MAX_FILE_SIZE_KB=50**	Size of log file (KB) before rotation.<br>
**LOG_MAX_BACKUPS=5**	Number of rotated files to keep.

📦 **Database & General Variable**
Default	Description  PORT	4000	Application Port
DB_HOST	localhost	(For local run only). Docker uses service name postgres

🛠 Manual Testing
Swagger UI
Available at: http://localhost:4000/doc/ (NOT part of this task requirements) 

***Postman Collection for tests***
<details> <summary><strong>📦 Click to view / copy Postman Collection JSON</strong></summary>

Do not forget change user name

```json 
{
  "info": {
    "name": "Home Library API Flow (Task 3)",
    "description": "Sequence of requests to test Auth, Logging, and protected resources.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Public: Health Check (Logs test)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:4000/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": [""]
        }
      }
    },
    {
      "name": "2. Public: Signup User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"login\": \"testuser\",\n    \"password\": \"secret123\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:4000/auth/signup",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["auth", "signup"]
        }
      }
    },
    {
      "name": "3. Public: Login (Get Tokens)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "var jsonData = pm.response.json();",
              "if (jsonData.accessToken) {",
              "    pm.collectionVariables.set(\"accessToken\", jsonData.accessToken);",
              "    pm.collectionVariables.set(\"refreshToken\", jsonData.refreshToken);",
              "    console.log(\"Tokens saved to Collection Variables\");",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"login\": \"testuser\",\n    \"password\": \"secret123\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:4000/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["auth", "login"]
        }
      }
    },
    {
      "name": "4. Protected: Get Users (Check 401)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:4000/user",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["user"]
        }
      }
    },
    {
      "name": "5. Protected: Get Users (With Token)",
      "request": {
        "auth": {
          "type": "bearer",
          "bearer": [
            {
              "key": "token",
              "value": "{{accessToken}}",
              "type": "string"
            }
          ]
        },
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:4000/user",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["user"]
        }
      }
    },
    {
      "name": "6. Protected: Refresh Token",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "var jsonData = pm.response.json();",
              "if (jsonData.accessToken) {",
              "    pm.collectionVariables.set(\"accessToken\", jsonData.accessToken);",
              "    pm.collectionVariables.set(\"refreshToken\", jsonData.refreshToken);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"refreshToken\": \"{{refreshToken}}\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:4000/auth/refresh",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["auth", "refresh"]
        }
      }
    },
    {
      "name": "7. Log Check: Trigger Error (404)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:4000/this-route-does-not-exist",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["this-route-does-not-exist"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "accessToken",
      "value": ""
    },
    {
      "key": "refreshToken",
      "value": ""
    }
  ]
}
```
</details>

## 📂 Project Structure


#### 🔓 Authentication (Public)
```text
GET  /doc
POST /auth/signup
POST /auth/login
POST /auth/refresh
```

🔒 Resources (Protected)
```text
GET /user
GET /artist
GET /album
GET /track
GET /favs
```


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
````

## Using the application

The service provides REST API endpoints for:

- **Users** (`/user`) - Create, read, update, and delete users
- **Artists** (`/artist`) - Manage artists
- **Albums** (`/album`) - Manage albums
- **Tracks** (`/track`) - Manage tracks
- **Favorites** (`/favs`) - Manage favorite artists, albums, and tracks

All endpoints use JSON format for request and response bodies. The API uses UUID v4 for entity identifiers.

### Security scanning

```bash
# Scan for security vulnerabilities in dependencies
npm run scan:vulnerabilities
```
### Docker Image Scan ###
Scans the built production image for system-level vulnerabilities (using Docker Scout).
> Note: Ensure the production image is built (npm run docker:prod) before scanning.
```bash
   npm run scan:image
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
