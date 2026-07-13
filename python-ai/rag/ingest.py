from rag.loader import load_pdf
from rag.splitter import split_documents
from rag.vectorstore import build_vector_store


def ingest(filename, chatId):

    docs = load_pdf(filename)

    chunks = split_documents(docs)

    build_vector_store(chunks, chatId)

    return len(docs), len(chunks)