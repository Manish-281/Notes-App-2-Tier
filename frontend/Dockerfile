# ---------- Stage 1: Build the React app ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the production bundle (No need to pass API URL now)
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add our custom nginx config (handles SPA routing and API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
