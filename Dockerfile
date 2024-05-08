# Start from a base image with Node.js
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

RUN yarn build

# Expose the port that your Express app is running on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start"]
