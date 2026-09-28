import assert from 'node:assert/strict';
import test from 'node:test';

import { localizeApiError } from '../app/lib/api-error-i18n.js';

const english = (_zh, en) => en;

test('outbound private-network errors are localized for English UI', () => {
    const message = localizeApiError({
        code: 'OUTBOUND_REQUEST_BLOCKED',
        error: 'Local and private-network addresses are disabled by default.',
    }, english);
    assert.match(message, /AUTHOR_ALLOW_PRIVATE_NETWORK=1/);
    assert.doesNotMatch(message, /[\u4e00-\u9fff]/);
});

test('Ollama configuration errors are localized for English UI', () => {
    assert.equal(localizeApiError({ code: 'NO_MODEL_OLLAMA' }, english), 'Select an Ollama model first.');
    assert.equal(localizeApiError({ code: 'NO_BASE_URL_OLLAMA' }, english), 'Enter an Ollama server URL first.');
});
