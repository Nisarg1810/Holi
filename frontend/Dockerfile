# ─── Frontend Dockerfile ──────────────────────────────────────────────────────
# node:20-alpine — small base image, fast builds
FROM node:20-alpine

# Prevent npm from printing funding/audit noise
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_FUND=false

# Enable file-watching polling so hot reload works in Docker on Windows & Mac.
# Without these, inotify events from volume mounts don't reach the container.
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Set working directory
WORKDIR /app

# Install dependencies — done first for Docker layer caching.
# Only re-runs when package.json or package-lock.json changes.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the full application source
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start Next.js dev server.
# --hostname 0.0.0.0 makes it reachable from the host browser via localhost:3000.
# (package.json "dev" script already includes --hostname 0.0.0.0)
CMD ["npm", "run", "dev"]
