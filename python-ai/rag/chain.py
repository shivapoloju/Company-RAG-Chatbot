from pathlib import Path
from rag.llm import get_llm
from rag.prompt import prompt
from rag.retriever import get_retriever


def ask(question, chatId):

    retriever = get_retriever(chatId)
    if retriever is None:
        return "I couldn't find this information in the uploaded documents.", []

    docs = retriever.invoke(question)

    context = "\n\n".join(
        d.page_content for d in docs
    )

    sources = []
    for d in docs:
        metadata = d.metadata or {}
        source_path = metadata.get("source", "")
        filename = Path(source_path).name if source_path else "Unknown"
        page = metadata.get("page", 0)
        source_info = {"file": filename, "page": page}
        if source_info not in sources:
            sources.append(source_info)

    llm = get_llm()

    chain = prompt | llm

    response = chain.invoke({

        "context": context,

        "question": question

    })

    return response.content, sources