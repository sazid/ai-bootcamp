"""Step 6: The agent loop, with one tool.

    while the model asks for tools:
        run the tools
        send the results back

This loop is the core of Claude Code, Codex and others.
One tool is enough: this agent has only PowerShell.

Try this:
  "How much free disk space do I have? Show it in GB."
  "Fix the bug in hello.py, then run it to check your fix."
  "Write a script named count-lines.ps1, then use it on hello.py."

Warning: this tool can do anything your user account can do.
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
    return (result.stdout + result.stderr)[:20000]  # Long output fills the context.


rules = f"""You are a coding agent on {platform.system()}.
The current workspace is {WORKSPACE}. Commands start in this folder.
Use PowerShell right away. Do not ask the user for permission or for file contents."""
history = [llm.messages.system(rules)]

while (prompt := input("\nYou: ")) != "exit":
    history.append(llm.messages.user(prompt))
    response = model.call(history, tools=[powershell])

    # ---------- THE AGENT LOOP ----------
    while response.tool_calls:
        response = response.resume(response.execute_tools())
    # ------------------------------------

    history = response.messages
    print("\nAI:", response.text())
