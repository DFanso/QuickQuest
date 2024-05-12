<h1 align="center" id="title">QuickQuest: Streamlining Gig Economy Connections</h1>

![Banner](https://github.com/DFanso/QuickQuest/blob/main/Poster.png)

#### QuickQuest is a cutting-edge platform that connects customers with laborers based on location and service needs. It enables seamless communications and negotiations by utilizing MongoDB for precise geospatial queries and incorporating a real-time chat feature via Server-Sent Events (SSE). Laborers can send tailored bids with service details and pricing, while a recommendation engine, powered by Python and machine learning, enhances match accuracy. Transactions are secure, and facilitated by PayPal, with Brevo managing notification emails. QuickQuest ensures laborers receive 90% of earnings, with a minimal platform commission of 8%. The platform spans three responsive frontends for different user roles, built with Next.js and Tailwind CSS, and integrates AWS Cognito for robust authentication. Deployments are handled via Vercel and Ubuntu VPS, ensuring reliability and scalability.

# User Guide

System Requirements:
To run QuickQuest, ensure that your system meets the following minimum requirements:

- Operating System: Windows 10, macOS 10.15+, or Linux (Ubuntu 18.04+, Debian 10+, or equivalent)
- Node.js version 20 +
- Python 3.11 +
- Processor: Intel Core i3 or equivalent
- RAM: 4 GB
- Storage: 10 GB of free disk space
- Web Browser: Google Chrome (latest version), Mozilla Firefox (latest version), or Microsoft Edge (latest version)

🛠️ Installation:

1. Clone the QuickQuest repository from GitHub:
    
    ```
    git clone <https://github.com/DFanso/QuickQuest.git>
    
    ```
    
2. Navigate to the project directory:
    
    ```
    cd QuickQuest
    
    ```
    
3. Install dependencies for the Next.js applications (Admin, Customer, Worker):
    
    ```
    cd admin
    npm install
    
    cd customer
    npm install
    
    cd worker
    npm install
    
    ```
    
4. Install dependencies for the Nest.js API:
    
    ```
    cd API
    npm install
    
    ```
    
5. Install dependencies for the FastAPI Recommender Engine:
    
    ```
    cd RecommenderEngine
    pip install -r requirements.txt
    
    ```
    
6. Set up environment variables:
    - For Next.js applications (Admin, Customer, Worker), create a `.env.local` file in each respective directory.
    
    ```markdown
    NEXT_PUBLIC_LOCATIONIQ_API_KEY=
    NEXT_PUBLIC_BASE_API_URL=
    NEXT_PUBLIC_MAP_API_KEY=
    ```
    
    - For the Nest.js API, create a `.env` file in the `api` directory.
    
    ```markdown
    MONGO_URI=
    AWS_REGION=
    AWS_BUCKET_NAME=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    COGNITO_USER_POOL_ID=
    COGNITO_CLIENT_ID=
    COGNITO_CLIENT_SECRET=
    PAYPAL_CLIENT_ID=
    PAYPAL_CLIENT_SECRET=
    PAYPAL_REDIRECT_URI=
    FRONTEND_URL=http://localhost:3000
    BREVO_SMTP=smtp-relay.brevo.com
    BREVO_SMTP_PORT=
    BREVO_USER=
    BREVO_PASS=
    EMAIL_FROM_ADDRESS=
    COGNITO_CALLBACK_URL=
    COGNITO_DOMAIN=
    RECOMMENDATION_ENGINE_API=
    ```
    
    - For the Python RecommenderEngine, create a `.env` file in the `RecommenderEngine` directory.
    
    ```markdown
    MONGODB_CONNECTION_STRING=
    ```
    
7. Build the Next.js applications:
    
    ```
    cd admin
    npm run build
    
    cd customer
    npm run build
    
    cd worker
    npm run build
    
    ```
    
8. Start the applications:
    - Next.js applications (Admin, Customer, Worker):
        
        ```
        cd admin
        npm start
        
        cd customer
        npm start
        
        cd worker
        npm start
        
        ```
        
    - Nest.js API:
        
        ```
        cd API
        npm run dev
        
        ```
        
    - FastAPI Recommender Engine:
        
        ```
        cd RecommenderEngine
        uvicorn main:app --reload
        
        ```
        
9. Access the applications:
    - Admin: `http://localhost:3002`
    - Customer: `http://localhost:3000`
    - Worker: `http://localhost:3001`
    - API: `http://localhost:9000/v1`
    - Recommender Engine: `http://localhost:5000`
    - API Documentation (Swagger): `http://localhost:9000/api` (username: admin, password: admin)

Usage:

1. Admin Application:
    - Open the Admin application in your web browser.
    - Log in using the admin credentials.
    - Manage services, and categories.
    - Monitor Orders revenues and charts.
2. Customer Application:
    - Open the Customer application in your web browser.
    - Sign up or log in to your customer account.
    - Search for services using keywords, filters, and categories.
    - View service details, provider profiles, and ratings.
    - Create own Bids to your budget and preference
    - Chat with Workers
    - Book services and make payments through the integrated PayPal gateway.
    - Rate and review Jobs after completion.
3. Worker Application:
    - Open the Worker application in your web browser.
    - Sign up or log in to your worker account.
    - View Bids from Customers
    - Create and manage your service listings.
    - Set your availability and pricing.
    - Send Offer to Customers.
    - Communicate with customers using the in-app messaging system.
4. API:
    - The API serves as the backend for the QuickQuest platform.
    - It handles data storage, retrieval, and manipulation.
    - The API endpoints are consumed by the frontend applications (Admin, Customer, Worker) to fetch and update data.
5. Recommender Engine:
    - The Recommender Engine uses machine learning algorithms to provide personalized service recommendations to customers.
    - It analyzes user preferences, booking history, and service ratings to generate relevant suggestions.
    - The Recommender Engine is integrated with the API to fetch data and update recommendations in real-time.
6. API Documentation (Swagger):
    - Access the API documentation by opening `http://localhost:9000/api` in your web browser.
    - Log in using the provided credentials (username: admin, password: admin).
    - Explore the available API endpoints, request/response formats, and authentication requirements.
    - Test and interact with the API endpoints directly through the Swagger interface.
