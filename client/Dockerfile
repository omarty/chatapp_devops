# Build with the client folder as context (so paths match package.json):
#   docker build -f client/Dockerfile -t chat-frontend ./client
#
# Optional: pass the API/socket origin used at build time for Vite (e.g. public URL):
#   docker build -f client/Dockerfile --build-arg VITE_BACKEND_URL=https://api.example.com -t chat-frontend ./client

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV NODE_ENV=production
RUN npm run build

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
