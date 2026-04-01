# Use a lightweight Node.js 18 image
FROM node:18-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy dependency definitions first (better layer caching)
COPY package*.json ./
# Install only production dependencies
RUN npm install --production
# Copy the rest of the application source code
COPY . .
# Expose the application port
EXPOSE 3000
# Start the application
CMD ["npm", "start"] 