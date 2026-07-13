from pathlib import Path

from langchain_community.vectorstores import FAISS

from rag.embeddings import get_embedding_model

BASE_DIR = Path(__file__).resolve().parent.parent

VECTOR_PATH = BASE_DIR / "vectors"


def get_retriever(chatId):

    chat_vector_path = VECTOR_PATH / chatId

    if not (chat_vector_path / "index.faiss").exists():
        return None

    embeddings = get_embedding_model()

    db = FAISS.load_local(
        str(chat_vector_path),
        embeddings,
        allow_dangerous_deserialization=True
    )

    return db.as_retriever(
        search_kwargs={
            "k": 3
        }
    )