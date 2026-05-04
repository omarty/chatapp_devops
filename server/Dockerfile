# Build from the repository root (mern root = parent of server/):
#   docker build -f server/Dockerfile -t chat-backend .
#
# Multi-stage: builds the Vite client, then runs Node with API + static dist
# (matches server.js serving client/dist for direct container use).

FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV NODE_ENV=production
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./client/dist
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server/server.js"]
