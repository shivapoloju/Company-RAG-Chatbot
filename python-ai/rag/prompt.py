from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template(
"""
You are an AI assistant.

Answer ONLY from the provided context.

If the answer is unavailable,
say:

I couldn't find this information in the uploaded documents.

Context:

{context}

Question:

{question}
"""
)