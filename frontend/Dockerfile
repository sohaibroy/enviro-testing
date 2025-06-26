# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install ALL dependencies, including devDependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]