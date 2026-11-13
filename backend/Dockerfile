# Use official Node.js LTS on Alpine Linux (small image)
FROM node:20-alpine

# Install build tools needed for better-sqlite3 native module
RUN apk add --no-cache python3 make g++

# Set working directory inside the container
WORKDIR /app

# Copy package files first (better Docker layer caching)
COPY package.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# Expose port 5000 to the outside world
EXPOSE 5000

# Healthcheck so Docker/K8s knows if the app is alive
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health >/dev/null || exit 1

# Start the backend
CMD ["node", "server.js"]
