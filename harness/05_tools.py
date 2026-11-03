"""Step 5: Tools. The model cannot run anything. It only ASKS, and our code runs it.

Try this:  "What does hello.py do?"
This script handles only ONE tool request. Step 6 fixes that with a loop.
"""
from pathlib import Path

from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})
HERE = Path(__file__).resolve().parent
WORKSPACE = HERE / "workspace"


@llm.tool
def read_file(path: str):
    """Read a text file from the workspace."""
    return (WORKSPACE / path).read_text(encoding="utf-8")


rules = f"""The current workspace is {WORKSPACE}.
File paths are relative to the workspace.
Use your tools right away. Do not ask the user for permission or for file contents."""
history = [llm.messages.system(rules)]

while (prompt := input("\nYou: ")) != "exit":
    history.append(llm.messages.user(prompt))
    response = model.call(history, tools=[read_file])

    if response.tool_calls:
        print("[model asked for:", response.tool_calls, "]")
        response = response.resume(response.execute_tools())

    history = response.messages
    print("\nAI:", response.text())
