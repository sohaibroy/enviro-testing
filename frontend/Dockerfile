# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies INCLUDING devDependencies
RUN npm install

# Copy remaining project files
COPY . .

# ✅ Set environment variable BEFORE build
# This allows Render to inject NEXT_PUBLIC_API_URL during deployment
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set environment to production
ENV NODE_ENV=production

# ✅ Build with correct env var
RUN npm run build

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]