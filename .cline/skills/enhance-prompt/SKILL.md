---
name: enhance-prompt
description: Enhances the user's input prompt by adding context, clarifying ambiguities, and suggesting improvements before execution.
---

# Prompt Enhancer Skill

Use this skill when you want Cline to refine or enhance your request before taking action. It helps clarify vague instructions, adds relevant context, and ensures the agent understands the desired outcome.

## When to use
- When your initial request is brief or ambiguous.
- When you want Cline to ask clarifying questions before proceeding.
- When you want the agent to suggest best practices or additional steps.
- When you want to prepend system context (e.g., project tech stack, constraints).

## Steps
1. **Capture the original user input.**
2. **Analyze for vagueness or missing details.**
3. **Generate clarifying questions if needed.**
4. **Add relevant context from the workspace (e.g., detected framework, files).**
5. **Propose an enhanced prompt that includes:**
   - Clear goal statement.
   - Relevant constraints or preferences.
   - Suggested approach or methodology.
   - Any open questions for user confirmation.
6. **Present the enhanced prompt to the user for approval.**
7. **If approved, proceed with the enhanced prompt; otherwise, iterate based on feedback.**

## Example interaction
**User:** "Add a button."
**Skill enhancement:**
- Detects project is a React app (from package.json).
- Asks: "Where should the button be placed? What text should it display? What action should it trigger?"
- Adds context: "Using Tailwind CSS for styling (detected tailwind.config.js)."
- Enhanced prompt: "Create a React component for a button with the text 'Submit', placed in the header component, styled with Tailwind CSS, that calls the handleSubmit function on click."
**User:** "Looks good, proceed."
**Cline:** Executes the enhanced prompt.

## Notes
- This skill does not execute any side‑effects itself; it only prepares the prompt.
- Ensure you have appropriate file read permissions for the skill to inspect project files (like package.json, tailwind.config.js) to add accurate context.
- You can customize the enhancement logic by editing the SKILL.md file or by creating a more advanced skill that uses tools (via the SDK) to perform automatic context gathering.
