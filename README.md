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

- `VITE_AUTH_API_URL` for login and registration (local auth service at
  `http://localhost:8080` for the complete local vehicle flow)
- `VITE_RIDE_API_URL` for public rides and creating rides
- `VITE_BOOKING_API_URL` for future booking functionality
- `VITE_PROFILE_API_URL` for vehicle data and profile cars (for local development,
  run the profile service at `http://localhost:8084`)

Sign in before opening **Meine Fahrzeuge**. The protected vehicle flow uses the
stored access token for listing and saving cars, and loads year, make, model,
option, and vehicle details from the profile service's Fuel-Economy endpoints.

### Complete local vehicle flow

Install Java 17 and start the auth and profile services in separate terminals.
Both services must use the same local JWT secret. Keep this secret outside the
repository:

```bash
mkdir -p ~/.config/blabla-local
chmod 700 ~/.config/blabla-local
if [ ! -s ~/.config/blabla-local/jwt.secret ]; then
  openssl rand -hex 48 > ~/.config/blabla-local/jwt.secret
  chmod 600 ~/.config/blabla-local/jwt.secret
fi
```

In each backend terminal, set the shared secret and Java 17:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
export JWT_SECRET="$(cat ~/.config/blabla-local/jwt.secret)"
```

Then start auth on port 8080 with its own in-memory database:

```bash
cd /path/to/Backend_MACH/auth-service
export JDBC_DATABASE_URL='jdbc:h2:mem:authdb;DB_CLOSE_DELAY=-1'
./gradlew bootRun --args='--spring.datasource.driver-class-name=org.h2.Driver --spring.jpa.database-platform=org.hibernate.dialect.H2Dialect'
```

Start profile on port 8084 in the other terminal, using a separate in-memory
database:

```bash
cd /path/to/Backend_MACH/profile-service
export JDBC_DATABASE_URL='jdbc:h2:mem:profiledb;DB_CLOSE_DELAY=-1'
./gradlew bootRun --args='--spring.datasource.driver-class-name=org.h2.Driver --spring.jpa.database-platform=org.hibernate.dialect.H2Dialect'
```

With both services running, restart Vite so it reads `.env`, register a local
test account, sign in, and open **Meine Fahrzeuge**. H2 data is temporary and
is discarded when its service stops. Do not use this development setup for
production data.

The application is available at `http://localhost:5173`.

Open `http://localhost:5173/login.html` to test the MPA login directly. Vite
detects `login.html` as a second build entry and emits it separately into
`dist/login.html`.

## Commands

```powershell
npm run build
npm run lint
```
