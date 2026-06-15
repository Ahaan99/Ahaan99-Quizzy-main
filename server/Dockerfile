# Dockerfile for Node/Express server
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
