# Testing Scripts

This folder contains scripts and collections for testing the Ikonex Academy API.

## Prerequisites

Before running the createAdmin script, ensure your database is set up:

1. **Set DATABASE_URL in .env**
   ```env
   DATABASE_URL=your_neon_database_url
   ```

2. **Push schema to database:**
   ```bash
   npm run db:push
   ```

## Files

### createAdmin.js
A Node.js script that creates an admin user in the database.

**Usage:**
```bash
node scripts/createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@ikonex.com`
- Password: `Admin@123`
- Role: `admin`

### thunderclient.json
A Thunder Client collection file with pre-configured requests for testing the API.

**How to import:**
1. Open Thunder Client in VS Code (or web version)
2. Click the "Collections" menu
3. Select "Import" → "From File"
4. Select `thunderclient.json`
5. The collection will be imported with requests ready to use

## Testing Workflow

1. **Ensure database schema is pushed:**
   ```bash
   npm run db:push
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Create admin user:**
   ```bash
   node scripts/createAdmin.js
   ```

4. **Test Sign Up Endpoint:**
   - Use ThunderClient → "Sign Up - Admin" request
   - Or use "Sign Up - Regular User" for a regular user
   - Update email/password as needed

5. **Test Sign In Endpoint:**
   - Use ThunderClient → "Sign In" request
   - Use credentials from a previously signed up user

## API Endpoints

- **Sign Up:** `POST /api/auth/sign-up`
- **Sign In:** `POST /api/auth/sign-in`
- **Get Users:** `GET /api/users`

## Variables

The ThunderClient collection uses `{{baseUrl}}` variable set to `http://localhost:3000`. Update this if your server runs on a different port.

## Troubleshooting

**Error: "Database schema not found"**
- Run: `npm run db:push`

**Error: "Cannot connect to database"**
- Check that `DATABASE_URL` is set in `.env`
- Verify your Neon database credentials
- Ensure you have network access to the database
