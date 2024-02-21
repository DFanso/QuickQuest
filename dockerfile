# Stage 1: Build the application
FROM node:18-alpine as build

# Define arguments
ARG MONGO_URI
ARG AWS_REGION
ARG AWS_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG COGNITO_USER_POOL_ID
ARG COGNITO_CLIENT_ID
ARG COGNITO_CLIENT_SECRET

# Set environment variables
ENV MONGO_URI=${MONGO_URI}
ENV AWS_REGION=${AWS_REGION} 
ENV AWS_BUCKET_NAME=${AWS_BUCKET_NAME} 
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} 
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} 
ENV COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID} 
ENV COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID} 
ENV COGNITO_CLIENT_SECRET=${COGNITO_CLIENT_SECRET}

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
ARG AWS_REGION
ARG AWS_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG COGNITO_USER_POOL_ID
ARG COGNITO_CLIENT_ID
ARG COGNITO_CLIENT_SECRET

# Set environment variables
ENV MONGO_URI=${MONGO_URI}
ENV AWS_REGION=${AWS_REGION} 
ENV AWS_BUCKET_NAME=${AWS_BUCKET_NAME} 
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} 
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} 
ENV COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID} 
ENV COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID} 
ENV COGNITO_CLIENT_SECRET=${COGNITO_CLIENT_SECRET}

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 9000
CMD ["node", "dist/main"]
