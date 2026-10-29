# BlaBla Frontend

React + Vite + TypeScript frontend for the BlaBla carpooling project.

The project intentionally demonstrates both rendering models:

- The main application (`/`) is a SPA. React Router changes pages without
  loading a new HTML document.
- The login is an MPA entry point (`/login.html`). It has its own HTML document,
  JavaScript entry point, and full-page navigation back to `/` after login.

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
- `VITE_PROFILE_API_URL` for vehicle data and profile cars (for local development,
  run the profile service at `http://localhost:8084`)

Sign in before opening **Meine Fahrzeuge**. The protected vehicle flow uses the
stored access token for listing and saving cars, and loads year, make, model,
option, and vehicle details from the profile service's Fuel-Economy endpoints.

The application is available at `http://localhost:5173`.

Open `http://localhost:5173/login.html` to test the MPA login directly. Vite
detects `login.html` as a second build entry and emits it separately into
`dist/login.html`.

## Commands

```powershell
npm run build
npm run lint
```
