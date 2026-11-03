"""Step 2: Put the call in a loop. It looks like a chat, but it forgets.

Try this:  "My name is Sazid."  then  "What is my name?"
"""
from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})

while (prompt := input("\nYou: ")) != "exit":
    response = model.call(prompt)
    print("\nAI:", response.text())
