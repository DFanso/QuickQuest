from fastapi import FastAPI
from pymongo import MongoClient
from pydantic import BaseModel
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

app = FastAPI()

# Connect to MongoDB
client = MongoClient('mongodb+srv://dfanso:lcIvCH5gv3Ns1BLk@main0.uhgf4br.mongodb.net/?retryWrites=true&w=majority')
db = client['service-hub']
orders_collection = db['jobs']
feedback_collection = db['feedback']
user_collection = db['users']
service_collection = db['services']

class RecommendationRequest(BaseModel):
    userId: str

@app.post('/recommendations')
async def get_recommendations(request: RecommendationRequest):
    user_id = request.userId

    # Retrieve user orders and feedback from MongoDB
    user_data = []

    for order in orders_collection.find({'customer': user_id}):
        service_id = order['service']
        rating = 0  # Assign a default rating of 0 for orders
        user_data.append({'user_id': user_id, 'service_id': service_id, 'rating': rating})

    for feedback in feedback_collection.find({'customer': user_id}):
        service_id = feedback['service']
        rating = feedback['stars']
        user_data.append({'user_id': user_id, 'service_id': service_id, 'rating': rating})

    # Convert user data to a DataFrame
    df = pd.DataFrame(user_data)

    # Pivot the DataFrame to create a matrix of users and their ratings for each service
    user_service_matrix = df.pivot_table(index='user_id', columns='service_id', values='rating').fillna(0)

    # Standardize the data
    scaler = StandardScaler()
    user_service_matrix_scaled = scaler.fit_transform(user_service_matrix)
    user_service_matrix_scaled_df = pd.DataFrame(user_service_matrix_scaled, index=user_service_matrix.index, columns=user_service_matrix.columns)

    # Compute cosine similarity between users
    similarity_matrix = cosine_similarity(user_service_matrix_scaled_df)
    similarity_matrix_df = pd.DataFrame(similarity_matrix, index=user_service_matrix.index, columns=user_service_matrix.index)

    # Find the top N similar users
    top_n_users = similarity_matrix_df[user_id].sort_values(ascending=False)[1:11].index

    # Aggregate the ratings of these users to recommend services
    recommended_services = user_service_matrix.loc[top_n_users].mean().sort_values(ascending=False).index[:10]

    # Retrieve the recommended service details from MongoDB
    recommended_service_details = []
    for service_id in recommended_services:
        service = service_collection.find_one({'_id': ObjectId(service_id)})
        if service:
            recommended_service_details.append(service)

    return {'recommendations': recommended_service_details}