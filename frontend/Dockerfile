FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src

# Point the app at the backend service name used in docker-compose
ENV VITE_APP_API_URL=http://localhost:4000/tasks

RUN npm run build

# ── Serve with nginx ─────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Minimal nginx config that proxies /tasks → backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
