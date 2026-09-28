import test from 'node:test';
import assert from 'node:assert/strict';
import {
    enabledModelIds,
    isModelEnabled,
    mergeModelCatalog,
    normalizeModelCatalog,
    setModelEnabled,
} from '../app/lib/model-catalog.js';

test('legacy catalog models migrate as enabled and remain unique', () => {
    const catalog = normalizeModelCatalog({ models: ['alpha', 'alpha', ' beta '] });
    assert.deepEqual(catalog.models, ['alpha', 'beta']);
    assert.deepEqual(catalog.disabledModels, []);
    assert.deepEqual(enabledModelIds(catalog), ['alpha', 'beta']);
});

test('fetching merges discoveries without deleting unavailable models or parameters', () => {
    const catalog = mergeModelCatalog({
        models: ['old-model'],
        disabledModels: ['old-model'],
        modelParams: { 'old-model': { temperature: 0.2 } },
    }, [{ id: 'new-model' }, { id: 'old-model' }]);
    assert.deepEqual(catalog.models, ['old-model', 'new-model']);
    assert.deepEqual(catalog.disabledModels, ['old-model']);
    assert.deepEqual(catalog.modelParams, { 'old-model': { temperature: 0.2 } });
    assert.deepEqual(enabledModelIds(catalog), ['new-model']);
});

test('disabled models can be restored but active models cannot be disabled', () => {
    const disabled = setModelEnabled({ models: ['one', 'two'] }, 'one', false, ['two']);
    assert.equal(isModelEnabled(disabled, 'one'), false);
    assert.deepEqual(enabledModelIds(disabled), ['two']);

    const restored = setModelEnabled(disabled, 'one', true, ['two']);
    assert.equal(isModelEnabled(restored, 'one'), true);

    const protectedModel = setModelEnabled(restored, 'two', false, ['two']);
    assert.equal(isModelEnabled(protectedModel, 'two'), true);
});
