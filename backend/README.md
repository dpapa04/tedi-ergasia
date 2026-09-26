# Backend

## Local setup

1. Copy `.env.example` to `.env` and set the database credentials, `JWT_SECRET`, and `ADMIN_PASSWORD`.
2. Create local HTTPS certificates:

```bash
npm run generate:certs
```

This creates `certs/server.crt` and `certs/server.key`. The generated files are ignored by Git.
3. Ensure the MySQL user in `.env` can connect to the `edi_ergasia` database.

The server refuses to start without HTTPS certificates.