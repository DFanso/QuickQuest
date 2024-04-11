from fastapi import FastAPI
from pymongo import MongoClient
from pydantic import BaseModel
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from bson import ObjectId
import logging
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Connect to MongoDB
mongodb_connection_string = os.getenv('MONGODB_CONNECTION_STRING')
client = MongoClient(mongodb_connection_string)
db = client['service-hub']
orders_collection = db['jobs']
feedback_collection = db['feedback']
service_collection = db['services']
category_collection = db['categories']

class RecommendationRequest(BaseModel):
    userId: str

def replace_object_ids(obj):
    if isinstance(obj, list):
        return [replace_object_ids(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: replace_object_ids(value) for key, value in obj.items()}
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

@app.post('/recommendations')
async def get_recommendations(request: RecommendationRequest):
    user_id = request.userId
    user_object_id = ObjectId(user_id)

    # Fetch user data from orders and feedback
    service_ratings = {}
    for feedback in feedback_collection.find({'customer': user_object_id}):
        service_id = str(feedback['service'])
        rating = feedback['stars']
        service_ratings[service_id] = rating

    for order in orders_collection.find({'customer': user_object_id}):
        service_id = str(order['service'])
        if service_id not in service_ratings:
            service_ratings[service_id] = 0

    user_data = [{'user_id': user_id, 'service_id': sid, 'rating': rating} for sid, rating in service_ratings.items()]
    logger.info(f"User Data: {user_data}")

    df = pd.DataFrame(user_data)
    logger.info(f"DataFrame:\n{df}")

    if df.empty:
        logger.warning("Insufficient data for generating recommendations.")
        return {'recommendations': []}

    # Collaborative Filtering Part
    user_service_matrix = df.pivot_table(index='user_id', columns='service_id', values='rating').fillna(0)
    scaler = StandardScaler()
    user_service_matrix_scaled = scaler.fit_transform(user_service_matrix)
    user_service_matrix_scaled_df = pd.DataFrame(user_service_matrix_scaled, index=user_service_matrix.index, columns=user_service_matrix.columns)
    similarity_matrix = cosine_similarity(user_service_matrix_scaled_df)
    similarity_matrix_df = pd.DataFrame(similarity_matrix, index=user_service_matrix.index, columns=user_service_matrix.index)
    top_n_users = similarity_matrix_df[user_id].sort_values(ascending=False)[1:11].index
    recommended_services = user_service_matrix.loc[top_n_users].mean().sort_values(ascending=False).index[:5]

    # Fetch all services for content-based part
    all_services = list(service_collection.find())

    # Populate category field on the services
    for service in all_services:
        category_id = service['category']
        category = category_collection.find_one({'_id': category_id})
        if category:
            service['category'] = category['name']
        else:
            service['category'] = 'Unknown'

    # Content-Based Filtering Part - Placeholder for simplicity
    # Assuming each service has a 'category' and we simply recommend new services from the same category as those rated highly by the user
    user_preferred_categories = [service['category'] for service in all_services if str(service['_id']) in recommended_services]
    unique_preferred_categories = set(user_preferred_categories)
    new_service_recommendations = [service for service in all_services if service['category'] in unique_preferred_categories and str(service['_id']) not in recommended_services][:5]

    # Combine recommendations from both parts
    combined_recommendations_ids = list(recommended_services) + [str(service['_id']) for service in new_service_recommendations]

    # Fetch and prepare final recommendation details
    recommended_service_details = []
    for service_id in combined_recommendations_ids:
        service = service_collection.find_one({'_id': ObjectId(service_id)})
        if service:
            recommended_service_details.append(service)

    # Replace ObjectId fields with their string representation
    recommended_service_details = replace_object_ids(recommended_service_details)

    return jsonable_encoder({'recommendations': recommended_service_details})