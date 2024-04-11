# Use the official Python base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Define the MongoDB connection string argument
ARG MONGODB_CONNECTION_STRING

# Set the environment variable for the MongoDB connection string
ENV MONGODB_CONNECTION_STRING=${MONGODB_CONNECTION_STRING}

# Expose the port on which the application will run
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]