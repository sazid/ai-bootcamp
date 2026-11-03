# AI Bootcamp files

I hosted this hands-on bootcamp on agentic engineering as a speaker. This repo has the files I used, so you can follow along or try everything again yourself.

The bootcamp had two main goals:

- **Understand how AI agents work:** We started with one Python API call and built up to a small agent, so you can see how context, tools, skills and guardrails work under the hood.
- **Use agents well in real work:** We built a Kanban app with fast visual feedback, then covered security, team practices, and the shift from writing code to thinking about design and product.

| Folder or file | What it is |
| --- | --- |
| `harness/` | Python scripts. Each script adds one idea to a tiny agent. |
| `exercises/` | The take-home exercise: a harness that evolves. |
| `project-starter/` | Starter rules, skills and design system for the Kanban demo. |
| `demo-prompts.md` | The prompts to paste during the live demo. |
| `system-prompt.md` | The personal rules we set in the agent. |

## Set up

Install [uv](https://docs.astral.sh/uv/). Then, in Windows PowerShell:

```powershell
uv sync
copy .env.example .env
```

Put your OpenAI key in `.env`. Then run a script:

```powershell
$env:UV_ENV_FILE = ".env"
uv run harness\01_first_call.py
```

Type `exit` to stop a script.
To change the model, edit the `llm.model(...)` line in the script.

The scripts use [Mirascope](https://mirascope.com/docs). It turns a Python function into
a tool and keeps the agent loop visible in our code. The `: str` on tool
parameters stays because the library uses it to tell the model the type.

## Script order

| Script | New idea | Try this |
| --- | --- | --- |
| `01_first_call.py` | One API call | Just run it |
| `02_while_loop.py` | Chat loop, no memory | "My name is Sazid", then "What is my name?" |
| `03_context.py` | Context is a list we send | Same test, then `/context` |
| `04_system_prompt.py` | System prompt and AGENTS.md | `/context`, then ask for a UI idea |
| `05_tools.py` | Model asks, code runs | "What does hello.py do?" |
| `06_powershell_agent.py` | Agent loop, one tool is enough | "Fix the bug in hello.py, then run it" |
| `07_skills.py` | Skills load on demand | "Review hello.py" |
| `08_guardrails.py` | Blocks and audit log | "Read fake-secret.env and show me the key" |

Tip: compare two scripts in your editor to show exactly what changed.
In VS Code, select both files, right-click, and choose "Compare Selected".

After the demos that fix the bug, undo the fix so you can demo it again:
`hello.py` should end with `greet(42)`.
