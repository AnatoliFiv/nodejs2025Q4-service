# Home Library Service

A REST API service for managing a Home Library with Users, Artists, Albums, Tracks, and Favorites.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
cd nodejs2025Q4-service
```

## Installing NPM modules

```
npm install
```

## Configuration

Create a `.env` file in the root directory with the following content:

```
PORT=4000
```

The application will use port 4000 by default if the `.env` file is not present.

## Running application

```
npm start
```

The application will start on port 4000 (or the port specified in `.env` file).

After starting the app, you can open in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

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

For detailed API documentation, visit http://localhost:4000/doc/ after starting the application.

### Example requests for Postman

Copy these curl commands and past in postman

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

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
