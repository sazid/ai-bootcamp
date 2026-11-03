"""Step 7: Skills. A skill is a Markdown file with instructions.

The system prompt holds only each skill's path, name and description.
The agent reads the full file with its own tool, only when it needs it.

Try this:  "Review hello.py."
Then look at the first PS> command. The agent opens the skill by itself.
"""
import platform
import shutil
import subprocess
from pathlib import Path

from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})
SHELL = shutil.which("pwsh") or "powershell"
HERE = Path(__file__).resolve().parent
WORKSPACE = HERE / "workspace"


@llm.tool
def powershell(command: str):
    """Run a PowerShell command in the workspace and return its output."""
    print("  PS>", command)
    result = subprocess.run(
        [SHELL, "-NoProfile", "-NonInteractive", "-Command", command],
        cwd=WORKSPACE, capture_output=True, text=True, errors="replace", timeout=120,
    )
    return (result.stdout + result.stderr)[:20000]


skills = ""
for file in (HERE / "skills").glob("*/SKILL.md"):
    header = file.read_text().split("---")[1]
    skills += f"\nFile: ../skills/{file.parent.name}/SKILL.md{header}"

rules = f"""You are a coding agent on {platform.system()}.
The current workspace is {WORKSPACE}. Commands start in this folder.
Use PowerShell right away. Do not ask the user for permission or for file contents.
Read a skill file before you do a task that matches it.
Skills:{skills}"""
history = [llm.messages.system(rules)]

while (prompt := input("\nYou: ")) != "exit":
    history.append(llm.messages.user(prompt))
    response = model.call(history, tools=[powershell])

    while response.tool_calls:
        response = response.resume(response.execute_tools())

    history = response.messages
    print("\nAI:", response.text())
    print("[input tokens:", response.usage.input_tokens, "]")
