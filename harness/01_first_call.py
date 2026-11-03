"""Step 1: One request, one response. This is the base of every AI tool."""
from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})

response = model.call("Explain what an LLM is in one short sentence.")
print(response.text())
