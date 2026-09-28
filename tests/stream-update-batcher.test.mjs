import test from 'node:test';
import assert from 'node:assert/strict';
import { createStreamUpdateBatcher } from '../app/lib/stream-update-batcher.js';

test('coalesces rapid foreground stream snapshots and keeps the latest one', async () => {
    const commits = [];
    const batcher = createStreamUpdateBatcher((...update) => commits.push(update), {
        intervalMs: 5,
        isBackground: () => false,
    });
    batcher.push('one');
    batcher.push('two');
    batcher.push('three');
    await new Promise(resolve => setTimeout(resolve, 15));
    assert.deepEqual(commits, [['three']]);
});

test('flushes each update synchronously when the window is unavailable', () => {
    const commits = [];
    const batcher = createStreamUpdateBatcher((...update) => commits.push(update), {
        isBackground: () => true,
    });
    batcher.push('complete response');
    assert.deepEqual(commits, [['complete response']]);
});

test('an explicit final flush renders a full response without waiting for the timer', () => {
    const commits = [];
    const batcher = createStreamUpdateBatcher((...update) => commits.push(update), {
        intervalMs: 60_000,
        isBackground: () => false,
    });
    batcher.push('complete response');
    batcher.flush();
    assert.deepEqual(commits, [['complete response']]);
});
