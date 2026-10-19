# BlaBla Frontend

React + Vite + TypeScript frontend for the BlaBla carpooling project.

## Local development

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The application uses the following backend endpoints:

- `VITE_AUTH_API_URL` for login and registration
- `VITE_RIDE_API_URL` for public rides and creating rides
- `VITE_BOOKING_API_URL` for future booking functionality

The application is available at `http://localhost:5173`.

## Commands

```powershell
npm run build
npm run lint
```
