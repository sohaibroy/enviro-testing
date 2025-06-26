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

# Set environment to production (AFTER installing dependencies)
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]