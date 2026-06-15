# Multi-stage build for client (Vite + React)
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY .npmrc* ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Production image
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
