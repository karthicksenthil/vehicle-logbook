# Vehicle Logbook Upload System

A full-stack TypeScript application for uploading vehicle service logbooks with cascading dropdown selection and file upload functionality.


## Backend Setup

### Installation

```bash
cd backend
npm install
```

### Running the Server

```bash
# Production mode (build first)
npm run build
npm start

# Development mode (with auto-restart)
npm run dev
```

Server will run on `http://localhost:3000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### API Endpoints

#### Vehicle Data
- `GET /vehicles` - Get all vehicle data (makes, models, badges, quick select options)
- `GET /vehicles/:make/models` - Get models for a specific make
- `GET /vehicles/:make/:model/badges` - Get badges for a specific make and model

#### Upload
- `POST /upload` - Upload vehicle and logbook
  - Body: FormData with `make`, `model`, `badge`, and `logbook` file
  - Response: JSON with vehicle data and logbook contents

#### Health
- `GET /health` - Health check endpoint

## Frontend Setup

### Installation

```bash
cd frontend
npm install
```

### Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Usage Example

1. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend application:
   ```bash
   cd frontend && npm run dev
   ```

3. Open your browser to the frontend URL (typically `http://localhost:5173`)

4. Wait for vehicle data to load from the server

5. Select a vehicle using either:
   - Quick select buttons (loaded from server)
   - Manual dropdown selection (data from server API)

6. Upload a `.txt` logbook file

7. Click "Upload Logbook"

8. View the server response with vehicle details and logbook contents
