
- The backend uses Node.js and Express to serve HTTP requests and WebSocket connections.
- Yjs and y-websocket synchronize code changes in real-time between users in a session ("room").
- The backend acts as a secure proxy for the Google Gemini API, preventing API key exposure.
- The frontend uses Angular and CodeMirror 6 for the editor UI and y-codemirror.next for real-time collaboration.

## Prompt Engineering for Gemini API

- The prompt sent to Gemini API includes the current code context (editor content) and a request for code completion.
- Example prompt: "Complete the following JavaScript code: [current code context]"
- The prompt is designed to be concise and focused on code completion, ensuring the AI returns relevant suggestions.

## Parsing Gemini Response

- The backend receives code suggestions from Gemini as plain text.
- The frontend parses this text, splits it into individual suggestions, and formats them as CodeMirror completion objects.
- These completions are displayed in the editor as the user types.

## Testing Instructions

- **Real-time Collaboration**:
  - Open two browser tabs with the same room ID (e.g., `?room=my-session-id`).
  - Edit code in one tab and observe changes in the other.

- **AI Code Completion**:
  - Type code and trigger completion (Ctrl+Space).
  - Observe AI suggestions in the editor.

## Assumptions and Simplifications

- Access control for rooms is optional.
- The editor supports JavaScript; adding more languages requires additional CodeMirror language modules.
- The project focuses on core requirements; advanced features like syntax highlighting or user authentication are out of scope.

## Next Steps

- Add user authentication and access control.
- Support for more programming languages.
- Advanced AI prompt engineering for context-aware completions.
- Enhanced error handling and logging.

---
