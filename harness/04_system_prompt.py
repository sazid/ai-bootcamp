"""Step 4: System prompt. It is only text placed before the conversation.

  system-prompt.md   how the AI should talk to ME
  AGENTS.md          how the AI should work in THIS project
"""
from pathlib import Path

from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})
HERE = Path(__file__).resolve().parent

personal_rules = (HERE.parent / "system-prompt.md").read_text()
project_rules = (HERE / "AGENTS.md").read_text()
history = [llm.messages.system(personal_rules + "\n\n" + project_rules)]

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
