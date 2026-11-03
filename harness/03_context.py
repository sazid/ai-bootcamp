"""Step 3: Context. The model remembers nothing. WE send the history every time.

Type /context to see what is sent. Watch the token count grow.
"""
from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})
history = []  # This list IS the context.

while (prompt := input("\nYou: ")) != "exit":
    if prompt == "/context":
        for message in history:
            print(message.role, ":", message.content)
        continue

    history.append(llm.messages.user(prompt))
    response = model.call(history)
    history = response.messages

    print("\nAI:", response.text())
    print("[input tokens:", response.usage.input_tokens, "]")
