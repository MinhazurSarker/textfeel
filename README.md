Next JS Fullstack App for sms forwarding

## Deploy with Docker on Dokploy

Dokploy can build this app directly from its `Dockerfile`. Select the Dockerfile
build type, set the application port to `4020`, and add these runtime
environment variables in Dokploy:

- `MONGODB_URI` (required)
- `MONGODB_USER` and `MONGODB_PASS` (if required by your MongoDB server)
- `JWT_SECRET` (required)

Do not pass application secrets as Docker build arguments; configure them as
runtime environment variables in Dokploy. The app listens on port `4020`.
