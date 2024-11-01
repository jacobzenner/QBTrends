# Use the official Node.js image for React development
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
