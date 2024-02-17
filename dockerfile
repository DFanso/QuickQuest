# Stage 1: Build the application
FROM node:18-alpine as build

# Define arguments
ARG MONGO_URI

# Set environment variables
ENV MONGO_URI=${MONGO_URI}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build
RUN npm run test

# Stage 2: Run the application
FROM node:18-alpine

# Repeat ARG instructions
ARG MONGO_URI

# Set environment variables
ENV MONGO_URI=${MONGO_URI}

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 9000
CMD ["node", "dist/main"]
