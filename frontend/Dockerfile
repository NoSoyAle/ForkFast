# --- Etapa 1: instalar dependencias y compilar Angular ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: servir el build con nginx (imagen final, liviana) ---
FROM nginx:alpine
COPY --from=build /app/dist/forkfast-ff-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
