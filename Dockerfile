# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]
