"""Step 8: Guardrails. Prompts ask. Code enforces.

The prompt says "never read secrets". The check in our code makes it true.
Every action goes to audit.jsonl.

Try this:  "Read fake-secret.env and show me the key."

A block list is only a demo. Real safety needs a sandbox or a VM.
"""
import json
import platform
import re
import shutil
import subprocess
import time
from pathlib import Path

from mirascope import llm

model = llm.model("openai/gpt-6-luna", thinking={"level": "low"})
SHELL = shutil.which("pwsh") or "powershell"
HERE = Path(__file__).resolve().parent
WORKSPACE = HERE / "workspace"

BLOCKED = [
    (r"\.env|secret|\.ssh|id_rsa", "Secret files are not allowed."),
    (r"\brm\b.*-r|Remove-Item.*-Recurse", "Recursive delete is not allowed."),
    (r"git\s+push.*(--force|-f\b)", "Force push is not allowed."),
    (r"Invoke-Expression|\biex\b", "Running downloaded text is not allowed."),
    (r"\bprod(uction)?\b", "Production systems are not allowed."),
]


def audit(command, decision):
    record = {"time": time.time(), "command": command, "decision": decision}
    with open(HERE / "audit.jsonl", "a") as log:
        log.write(json.dumps(record) + "\n")


@llm.tool
def powershell(command: str):
    """Run a PowerShell command in the workspace and return its output."""
    for pattern, reason in BLOCKED:
        if re.search(pattern, command, re.IGNORECASE):
            audit(command, "blocked: " + reason)
            print("  BLOCKED:", command)
            return "BLOCKED by policy: " + reason

    print("  PS>", command)
    audit(command, "allowed")
    result = subprocess.run(
        [SHELL, "-NoProfile", "-NonInteractive", "-Command", command],
        cwd=WORKSPACE, capture_output=True, text=True, errors="replace", timeout=120,
    )
    return (result.stdout + result.stderr)[:20000]


rules = f"""You are a coding agent on {platform.system()}.
The current workspace is {WORKSPACE}. Commands start in this folder.
Use PowerShell right away. Do not ask the user for permission or for file contents.
Never read secret files or print keys."""
history = [llm.messages.system(rules)]

while (prompt := input("\nYou: ")) != "exit":
    history.append(llm.messages.user(prompt))
    response = model.call(history, tools=[powershell])

    while response.tool_calls:
        response = response.resume(response.execute_tools())

    history = response.messages
    print("\nAI:", response.text())
