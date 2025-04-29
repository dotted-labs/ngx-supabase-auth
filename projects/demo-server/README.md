# Demo Server - Magic Link Generator

This Node.js Express server provides an API endpoint specifically designed to facilitate authentication in desktop applications (like Electron) using Supabase, particularly after a web-based login flow (e.g., social login). Its primary function is to generate a Supabase magic link `hashed_token` for an already authenticated user, allowing the desktop app to sign in without requiring the user to re-enter credentials.

This approach is based on the pattern discussed [here](https://github.com/orgs/supabase/discussions/27181) for creating independent sessions in desktop apps.

## Purpose

- **Bridge Web Auth to Desktop:** Allows a desktop application to leverage a user session established via a web browser (common in OAuth flows).
- **Generate `hashed_token`:** Creates a secure, single-use token (`hashed_token`) that the desktop client can use to verify the user's identity with Supabase.
- **Requires Admin Privileges:** Uses the Supabase `SERVICE_KEY` to generate the token on behalf of the user.

## Project Structure

```
/demo-server
  server.js         - Main Express server file containing the API logic.
  .env              - Environment variables (Supabase keys, Port). (Needs to be created)
  package.json      - Project dependencies and scripts.
  README.md         - This file.
```

## Setup

1.  **Install Dependencies:**

    ```bash
    # Navigate to the demo-server directory (from the root)
    cd projects/demo-server

    # Install dependencies
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the `projects/demo-server` directory with the following content:

    ```dotenv
    # Supabase Configuration
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_KEY=your_supabase_service_role_key # IMPORTANT: Service Role Key!

    # Server Configuration
    PORT=3000
    ```

    - Replace the placeholder values with your actual Supabase project details.
    - The `SUPABASE_SERVICE_KEY` is crucial and must be kept secure.

3.  **Run the Server:**

    ```bash
    # Start the server
    npm start

    # Or run in development mode (with automatic restarts)
    npm run dev
    ```

## API Endpoint

### Generate Magic Link Hashed Token

- **Endpoint:** `POST /api/generate-magic-link`
- **Method:** `POST`
- **Authentication:** Requires the user's `access_token` to be sent in the `Authorization` header.
  ```
  Authorization: Bearer <user_access_token>
  ```
- **Body:** None required (optionally can include `refresh_token` but typically not needed for this flow).
- **Success Response (200 OK):**
  ```json
  {
    "hashed_token": "supabase_generated_hashed_token_string"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the `Authorization` header is missing or the token is invalid.
  - `500 Internal Server Error`: If Supabase keys are missing or there's an error generating the link.

## Core Logic

1.  The server receives the `POST` request.
2.  It extracts the `access_token` from the `Authorization` header.
3.  It verifies the `access_token` by attempting to fetch the user's data from Supabase using the provided token.
4.  If valid, it retrieves the user's email address.
5.  Using the **`SUPABASE_SERVICE_KEY`** (admin privileges), it calls the Supabase admin API to generate a magic link for that user's email.
6.  It extracts only the `hashed_token` part from the generated magic link data.
7.  It returns the `hashed_token` in the JSON response.

## Client Usage (Desktop App)

1.  After the user completes the web-based authentication (e.g., social login) and the desktop app obtains the user's `access_token` (often via the redirect handler).
2.  The desktop app sends a `POST` request to this server's `/api/generate-magic-link` endpoint, including the `access_token` in the `Authorization` header.
3.  The app receives the `hashed_token` in the response.
4.  The app uses this `hashed_token` to sign in the user directly with Supabase within the desktop context:

    ```typescript
    // Example using Supabase JS client
    import { createClient } from '@supabase/supabase-js';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function signInWithHashedToken(hashedToken: string) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: hashedToken,
        type: 'magiclink', // Or 'email' depending on Supabase version/config
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        return null;
      }
      // `data.session` contains the new session for the desktop app
      console.log('Desktop sign-in successful:', data.session);
      return data.session;
    }

    // Assuming 'received_hashed_token' is the token from the server
    const session = await signInWithHashedToken(received_hashed_token);
    ```

This establishes an independent, authenticated session within the desktop application.
