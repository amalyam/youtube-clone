# Stage 1: build stage
FROM node:20.11.1 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Use an official Node runtime as a parent image
FROM node:20.11.1

# Copy app source inside the docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: production stage
FROM node:20.11.1

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app fro the builder stage
COPY --from=builder /app/dist ./dist

# Make port 3000 available outside this container
EXPOSE 3000

# Define the command to run app using CMD
CMD [ "npm", "start", "serve" ]
