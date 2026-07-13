from pathlib import Path

from langchain_community.vectorstores import FAISS

from rag.embeddings import get_embedding_model

BASE_DIR = Path(__file__).resolve().parent.parent

VECTOR_PATH = BASE_DIR / "vectors"


def build_vector_store(chunks, chatId):

    embeddings = get_embedding_model()
    chat_vector_path = VECTOR_PATH / chatId
    chat_vector_path.mkdir(parents=True, exist_ok=True)

    if (chat_vector_path / "index.faiss").exists():

        db = FAISS.load_local(
            str(chat_vector_path),
            embeddings,
            allow_dangerous_deserialization=True
        )

        db.add_documents(chunks)

    else:

        db = FAISS.from_documents(
            chunks,
            embeddings
        )

    db.save_local(str(chat_vector_path))