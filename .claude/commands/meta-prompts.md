## Meta `Prompts
Command Structure
```bash
meta-prompts $ARGUMENTS 
```

A command that transforms abstract user prompts into detailed, optimized prompts that AI models (Claude, Gemini, etc.) can accurately understand and process. 

**When optimizing the prompt, make sure to take into account the project structure and requirements. Ask the AI to generate a more detailed prompt based on these considerations.**
 
The user's original prompt to optimize: $ARGUMENTS 

When this command is called, generates prompts designed to maximize AI model performance based on the provided user prompt. 
Return the optimized prompt in Japanese.

Example Usage
```bash
/meta-prompts 認証機能の設計をしてください。
```