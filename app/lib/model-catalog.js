// Durable per-provider model catalog helpers. A catalog records every model the
// user has fetched or entered; disabled models stay in the catalog so their
// parameters and selection history can be recovered later.

function uniqueModelIds(values = []) {
    const seen = new Set();
    return values.reduce((ids, value) => {
        const id = String(value || '').trim();
        if (id && !seen.has(id)) {
            seen.add(id);
            ids.push(id);
        }
        return ids;
    }, []);
}

export function modelIdsFromEntries(entries = []) {
    return uniqueModelIds(entries.map(entry => (
        typeof entry === 'string'
            ? entry
            : entry?.id || entry?.name || entry?.displayName || ''
    )));
}

export function normalizeModelCatalog(config = {}, activeModels = []) {
    const models = uniqueModelIds(config.models);
    const active = new Set(uniqueModelIds(activeModels));
    const disabledModels = uniqueModelIds(config.disabledModels)
        .filter(modelId => models.includes(modelId) && !active.has(modelId));
    return { ...config, models, disabledModels };
}

export function mergeModelCatalog(config = {}, discoveredModels = [], activeModels = []) {
    const normalized = normalizeModelCatalog(config, activeModels);
    return {
        ...normalized,
        models: uniqueModelIds([...normalized.models, ...modelIdsFromEntries(discoveredModels)]),
    };
}

export function isModelEnabled(config = {}, modelId) {
    const id = String(modelId || '').trim();
    return !!id && !uniqueModelIds(config.disabledModels).includes(id);
}

export function setModelEnabled(config = {}, modelId, enabled, activeModels = []) {
    const id = String(modelId || '').trim();
    const normalized = normalizeModelCatalog(config, activeModels);
    if (!id) return normalized;

    const models = uniqueModelIds([...normalized.models, id]);
    const active = new Set(uniqueModelIds(activeModels));
    if (!enabled && active.has(id)) return { ...normalized, models };

    const disabledModels = enabled
        ? normalized.disabledModels.filter(value => value !== id)
        : uniqueModelIds([...normalized.disabledModels, id]);
    return { ...normalized, models, disabledModels };
}

export function enabledModelIds(config = {}) {
    const normalized = normalizeModelCatalog(config);
    return normalized.models.filter(modelId => isModelEnabled(normalized, modelId));
}
