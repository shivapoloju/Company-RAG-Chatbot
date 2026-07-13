import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def get_embedding_model():

    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )