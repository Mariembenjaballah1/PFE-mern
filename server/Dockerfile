FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000
ENV MONGO_URI=mongodb://localhost:27017/inventrackdb

CMD ["npm", "run", "start"]
