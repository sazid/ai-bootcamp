# Exercise: build a harness that evolves

Build an agent that can improve itself by creating new versions of its own code.

Start from `harness/06_powershell_agent.py`.

## The main rule

The running agent never edits itself. It writes a NEW version.
A small supervisor program tests that version and decides what runs next.

```text
supervisor.py        small program that the agent cannot change
checks/              tests that the agent cannot change
versions/v001.py     your first agent
versions/v002.py     a new version, written by the agent
current.txt          the version that runs now
changelog.md         what changed in each version, and why
```

## Levels

1. **New tool:** The agent adds a tool for itself in a new version.
2. **Safe start:** The supervisor runs the new version on a simple task. If it crashes, the old version keeps running.
3. **Promote and roll back:** A version that passes becomes current. You can go back to any old version with one command.
4. **Prove it is better:** Run a set of fixed tasks on both versions. Compare success, steps and tokens. Promote only if it is better.
5. **Learn from failure:** The agent reads its own logs, finds a repeated problem, and proposes a fix.

## Rules

- Run this only in a sandbox, VM or container. Use a spending limit and a low-limit key.
- The agent cannot write to `supervisor.py` or `checks/`. Enforce this with code or file permissions, not with a prompt.
- Never delete old versions.
- A person approves each new version. You can relax this only inside a sandbox.
- Set a limit on versions per run, so it cannot loop forever.

## Think about this

- How could the agent cheat your checks? How will you stop it?
- What should stay fixed, and what can change?
- How do you know that a new version is really better?
- What happens if a new version removes its own safety checks?

## Share your result

Share your repo, your `changelog.md`, and the best change that your agent made by itself.
