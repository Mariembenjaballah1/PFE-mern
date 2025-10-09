# ---------- Build Stage ----------
FROM node:20-slim AS build

WORKDIR /app

# Déclarer l'argument pour VITE_API_URL
ARG VITE_API_URL

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copier le code source
COPY . .

# Injecter la variable dans le build Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build le frontend avec la bonne variable
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

# Installer un serveur HTTP statique
RUN npm install -g serve

# Copier les fichiers buildés depuis le build stage
COPY --from=build /app/dist ./dist

EXPOSE 80

# Lancer le serveur
CMD ["serve", "-s", "dist", "-l", "80"]
