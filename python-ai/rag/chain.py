from pathlib import Path
from rag.llm import get_llm
from rag.prompt import prompt
from rag.retriever import get_retriever


def ask(question, chatId):
    print(f"🔍 [RAG] Question: '{question}' | Chat ID: {chatId}")

    retriever = get_retriever(chatId)
    if retriever is None:
        print(f"⚠️ [RAG] Retriever is None! No FAISS index found for Chat ID: {chatId}")
        return "I couldn't find this information in the uploaded documents.", []

    print("⚡ [RAG] Index found. Executing similarity search...")
    docs = retriever.invoke(question)
    print(f"📄 [RAG] Retrieved {len(docs)} document chunks.")

    sources = []
    for i, d in enumerate(docs):
        metadata = d.metadata or {}
        source_path = metadata.get("source", "")
        filename = Path(source_path).name if source_path else "Unknown"
        page = metadata.get("page", 0)
        print(f"   ↳ Chunk {i+1}: File: {filename} | Page: {page} | Length: {len(d.page_content)} chars")
        source_info = {"file": filename, "page": page}
        if source_info not in sources:
            sources.append(source_info)

    context = "\n\n".join(
        d.page_content for d in docs
    )

    llm = get_llm()

    chain = prompt | llm

    response = chain.invoke({

        "context": context,

        "question": question

    })

    print(f"🤖 [RAG] LLM Response: '{response.content[:100]}...'")
    return response.content, sources