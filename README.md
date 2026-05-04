# 🚀 MERN ChatApp – Docker & Kubernetes Deployment

A modern real-time chat application built on the MERN stack (MongoDB, Express, React, Node.js), designed for scalable deployment with **Docker** and **Kubernetes**.

***

## 📝 Overview of What We Did

- 💻 **Built MERN Chat Application:** Real-time chat, authentication, socket support
- 🐳 **Dockerization:** Created separate Dockerfiles for frontend (React + Nginx) and backend (Express), plus a Dockerfile for Nginx proxy
- 🔗 **Reverse Proxy:** Configured custom Nginx to route `/api` traffic to backend, serve static frontend
- 🗄 **Database:** MongoDB container/service for persistent chat storage
- ⚙️ **Kubernetes Setup:**  
  - Deployment & Service files for **frontend**, **backend**, and **MongoDB**
  - **Ingress manifest** for path-based routing and public access
- 🛡️ **Security:** Demonstrated secrets usage for sensitive configuration like JWT secrets and environment values

***

## 🚀 How to Build, Deploy, and Access the App

### 1️⃣ Build & Push Docker Images

- **Frontend (React + Nginx):**
  ```
  cd client
  docker build -t <your-dockerhub>/chat-frontend:<tag> .
  docker push <your-dockerhub>/chat-frontend:<tag>
  ```
- **Backend (Node.js + Express, includes built `client/dist` for `server.js`):**
  ```
  # From repository root (not inside server/)
  docker build -f server/Dockerfile -t <your-dockerhub>/chat-backend:<tag> .
  docker push <your-dockerhub>/chat-backend:<tag>
  ```

### 2️⃣ Create Kubernetes Secrets (Recommended)

- For production secrets (e.g., JWT, DB URI):
  ```
  kubectl create secret generic chatapp-secrets \
    --from-literal=JWT_SECRET="your_secret_key" \
    --from-literal=MONGO_URI="mongodb://mongo:27017/chatapp"
  ```
- Reference these secrets in your deployment yaml and environment config.

### 3️⃣ Deploy Services & Ingress to K8s

- Apply manifests for deployments and services:
  ```
  kubectl apply -f k8s/backend-deployment.yaml
  kubectl apply -f k8s/backend-service.yaml
  kubectl apply -f k8s/frontend-deployment.yaml
  kubectl apply -f k8s/frontend-service.yaml
  kubectl apply -f k8s/mongo-deployment.yaml
  kubectl apply -f k8s/mongo-service.yaml
  ```
- Apply Ingress for public traffic:
  ```
  kubectl apply -f k8s/ingress.yaml
  ```

### 4️⃣ Access Your Application

- 🌎 **NodePort:** Visit `http://<your-node-ip>:<node-port>`
- 🌐 **Ingress Controller:** Set your DNS A record (or `/etc/hosts` for test) to your Ingress IP, then visit `http://mern-chatapp.com`
- 🔒 All traffic is securely routed via Nginx proxy and Ingress

***

## 📦 Technologies Used

- React, Node.js, Express, MongoDB
- Docker, Docker Compose
- Nginx (reverse proxy)
- Kubernetes (Deployments, Services, Ingress)
- K8s Secrets for env/security

***

## 🙌 Author

**Neeraj Nakka** ([GitHub @neerajnakka](https://github.com/neerajnakka))

***

