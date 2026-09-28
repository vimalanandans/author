// Shared defaults used by the provider picker and server-side provider routes.
// Keep these as API roots (not operation-specific paths) so callers can append
// models, generation, or discovery endpoints consistently.
export const GEMINI_NATIVE_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/';
export const OLLAMA_DEFAULT_BASE_URL = 'http://127.0.0.1:11434';
