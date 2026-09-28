import { withApiResources } from '../../../lib/api-resource-guard.js';
import { createGenerationLifecycle, generationAbortResponse } from '../../../lib/ai-request-lifecycle.js';
import { createOllamaMapper, streamJsonLinesAiResponse } from '../../../lib/ai-stream.js';
import { applyContentSafety } from '../../../lib/content-safety';
import { proxyFetch } from '../../../lib/proxy-fetch';
import { rotateKey } from '../../../lib/keyRotator';
import { isOutboundRequestBlocked, isServerCredentialBlocked, resolveAiCredential, safeUpstreamDetail } from '../../../lib/server-security.mjs';
import { OLLAMA_DEFAULT_BASE_URL } from '../../../lib/ai-provider-defaults.js';

// Ollama's native chat endpoint uses NDJSON streaming rather than OpenAI SSE.
export const runtime = 'nodejs';
export const maxDuration = 120;

async function handlePOST(request) {
    const lifecycle = createGenerationLifecycle(request.signal);
    const { signal } = lifecycle;
    try {
        signal.throwIfAborted();
        const { systemPrompt, userPrompt, apiConfig, maxTokens, temperature, topP, reasoningEffort } = await request.json();
        const proxyUrl = apiConfig?.proxyUrl || '';
        const credential = resolveAiCredential({
            request,
            clientApiKey: apiConfig?.apiKey,
            clientBaseUrl: apiConfig?.baseUrl,
            envApiKey: process.env.OLLAMA_API_KEY,
            envBaseUrl: process.env.OLLAMA_BASE_URL,
        });
        const apiKey = rotateKey(credential.apiKey);
        const baseUrl = credential.baseUrl || OLLAMA_DEFAULT_BASE_URL;
        const model = String(apiConfig?.model || process.env.OLLAMA_MODEL || '').trim();

        if (!model) {
            return Response.json({ error: 'Select an Ollama model before generating.', code: 'NO_MODEL_OLLAMA' }, { status: 400 });
        }

        const headers = { 'Content-Type': 'application/json' };
        // Local Ollama does not require a key. Keep optional bearer support for
        // authenticated remote servers and reverse proxies.
        if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

        const response = await proxyFetch(`${baseUrl.replace(/\/+$/, '')}/api/chat`, {
            method: 'POST',
            signal,
            headers,
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: applyContentSafety(systemPrompt) },
                    { role: 'user', content: userPrompt },
                ],
                stream: true,
                ...(reasoningEffort && reasoningEffort !== 'auto' ? { think: reasoningEffort !== 'none' } : {}),
                options: {
                    ...(temperature != null ? { temperature } : {}),
                    ...(topP != null ? { top_p: topP } : {}),
                    ...(maxTokens ? { num_predict: maxTokens } : {}),
                },
            }),
        }, proxyUrl);

        if (!response.ok) {
            const detail = safeUpstreamDetail(await response.text(), 300);
            return Response.json({
                error: detail || `Ollama returned an error (${response.status}).`,
                code: response.status === 401 || response.status === 403 ? 'INVALID_KEY' : 'AI_RETURNED_ERROR',
                status: response.status,
            }, { status: response.status });
        }

        return streamJsonLinesAiResponse(response, lifecycle, createOllamaMapper());
    } catch (error) {
        const aborted = generationAbortResponse(lifecycle);
        if (aborted) return aborted;
        if (isServerCredentialBlocked(error)) {
            return Response.json({ error: error.message, code: error.code }, { status: 403 });
        }
        if (isOutboundRequestBlocked(error)) {
            return Response.json({ error: error.message, code: error.code }, { status: 400 });
        }
        console.error('Ollama API error:', error?.code || error?.name || 'UNKNOWN');
        return Response.json({ error: 'Unable to connect to Ollama. Check the server URL and network access.', code: 'NETWORK_ERROR_CHECK' }, { status: 500 });
    } finally {
        if (!lifecycle.streaming) lifecycle.dispose();
    }
}

export const POST = withApiResources('/api/ai/ollama', handlePOST);
