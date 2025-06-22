# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Set the API URL at build time with a default fallback
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application
RUN npm run build

# Run stage
FROM node:20-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist /app/dist

# Expose port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-p", "3000"]