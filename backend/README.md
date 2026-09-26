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

## Recommendation dataset

The dataset archive is intentionally ignored because it is large. Prepare a streaming interaction file outside the repository:

```bash
npm run prepare:dataset
```

The generated JSONL uses the dataset's numeric `userId` and `eventId` values. It must be mapped to application users and events before being used for model training; the importer does not silently assume that those IDs are application UUIDs.