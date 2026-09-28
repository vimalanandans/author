const FOLDER_LABEL_GROUPS = [
    { zh: '作品信息', en: 'Book Info', ru: 'Информация о произведении', aliases: ['Information', 'Информация'] },
    { zh: '人物设定', en: 'Characters', ru: 'Персонажи' },
    { zh: '空间/地点', en: 'Places', ru: 'Места' },
    { zh: '世界观/设定', en: 'Worldbuilding', ru: 'Мир', aliases: ['世界观'] },
    { zh: '物品/道具', en: 'Items / Props', ru: 'Предметы / реквизит', aliases: ['Items', 'Предметы'] },
    { zh: '大纲', en: 'Outline', ru: 'План' },
    { zh: '写作规则', en: 'Writing Rules', ru: 'Правила письма', aliases: ['Правила'] },
    { zh: '自定义设定', en: 'Custom Settings', ru: 'Пользовательские настройки' },
    { zh: '主要角色', en: 'Main Characters', ru: 'Главные персонажи' },
    { zh: '次要角色', en: 'Supporting Characters', ru: 'Второстепенные персонажи' },
    { zh: '阵营/势力', en: 'Factions', ru: 'Фракции' },
    { zh: '主要场景', en: 'Key Locations', ru: 'Ключевые места' },
    { zh: '自然环境', en: 'Natural Environment', ru: 'Природная среда' },
    { zh: '历史/纪元', en: 'History / Eras', ru: 'История / Эпохи' },
    { zh: '社会/政治', en: 'Society / Politics', ru: 'Общество / Политика' },
    { zh: '文化/习俗', en: 'Culture / Customs', ru: 'Культура / Обычаи' },
    { zh: '力量体系', en: 'Power System', ru: 'Система сил' },
    { zh: '武器/装备', en: 'Weapons / Equipment', ru: 'Оружие / Снаряжение' },
    { zh: '特殊道具', en: 'Special Items', ru: 'Особые предметы' },
    { zh: '主线', en: 'Main Plot', ru: 'Основной сюжет' },
    { zh: '支线', en: 'Subplots', ru: 'Побочные линии' },
    { zh: '伏笔', en: 'Foreshadowing', ru: 'Предвестия' },
    { zh: '文风规范', en: 'Style Guide', ru: 'Стилистика' },
    { zh: '禁忌/注意', en: 'Taboos / Notes', ru: 'Табу / Примечания' },
];

const WORK_NAME_GROUPS = [
    { zh: '默认作品', en: 'Default Work', ru: 'Работа по умолчанию' },
    { zh: '新作品', en: 'New Work', ru: 'Новое произведение' },
];

const ENDPOINT_NAME_GROUPS = [
    { zh: '迁移的兼容端点', en: 'Migrated compatible endpoint', ru: 'Перенесённый совместимый эндпоинт' },
];

const CHINESE_DIGITS = new Map([
    ['零', 0], ['〇', 0], ['一', 1], ['二', 2], ['两', 2], ['三', 3], ['四', 4],
    ['五', 5], ['六', 6], ['七', 7], ['八', 8], ['九', 9], ['十', 10],
]);

function parseChineseChapterNumber(value) {
    if (!value) return null;
    if (/^\d+$/.test(value)) return Number(value);
    if (value === '十') return 10;
    if (value.includes('十')) {
        const [tens = '', ones = ''] = value.split('十');
        const tensValue = tens ? CHINESE_DIGITS.get(tens) : 1;
        const onesValue = ones ? CHINESE_DIGITS.get(ones) : 0;
        return Number.isInteger(tensValue) && Number.isInteger(onesValue) ? tensValue * 10 + onesValue : null;
    }
    const number = CHINESE_DIGITS.get(value);
    return Number.isInteger(number) ? number : null;
}

/**
 * Localize only generated chapter and volume titles. User-created titles are
 * returned unchanged, even when they contain Chinese text.
 */
export function getBuiltInChapterTitle(name, text) {
    if (typeof name !== 'string' || typeof text !== 'function') return name;
    const match = name.trim().match(/^第([零〇一二两三四五六七八九十\d]+)(章|卷)$/);
    if (!match) return name;
    const number = parseChineseChapterNumber(match[1]);
    if (!Number.isInteger(number) || number < 1) return name;
    return match[2] === '章'
        ? text(`第${number}章`, `Chapter ${number}`, `Глава ${number}`)
        : text(`第${number}卷`, `Volume ${number}`, `Том ${number}`);
}

const ICON_LABELS = [
    { name: 'user', zh: '人物', en: 'Character', ru: 'Персонаж' },
    { name: 'map-pin', zh: '地点', en: 'Place', ru: 'Место' },
    { name: 'globe', zh: '世界', en: 'World', ru: 'Мир' },
    { name: 'gem', zh: '宝石', en: 'Gem', ru: 'Самоцвет' },
    { name: 'clipboard-list', zh: '大纲', en: 'Outline', ru: 'План' },
    { name: 'ruler', zh: '规则', en: 'Rules', ru: 'Правила' },
    { name: 'book-open', zh: '书籍', en: 'Book', ru: 'Книга' },
    { name: 'settings', zh: '设置', en: 'Settings', ru: 'Настройки' },
    { name: 'sparkles', zh: '魔法', en: 'Magic', ru: 'Магия' },
    { name: 'heart', zh: '爱心', en: 'Heart', ru: 'Сердце' },
    { name: 'star', zh: '星标', en: 'Star', ru: 'Звезда' },
    { name: 'shield', zh: '盾牌', en: 'Shield', ru: 'Щит' },
    { name: 'zap', zh: '闪电', en: 'Lightning', ru: 'Молния' },
    { name: 'feather', zh: '羽毛', en: 'Feather', ru: 'Перо' },
    { name: 'compass', zh: '罗盘', en: 'Compass', ru: 'Компас' },
    { name: 'flag', zh: '旗帜', en: 'Flag', ru: 'Флаг' },
    { name: 'tag', zh: '标签', en: 'Tag', ru: 'Метка' },
    { name: 'layers', zh: '图层', en: 'Layers', ru: 'Слои' },
];

function findLabelGroup(groups, name) {
    if (typeof name !== 'string' || !name.trim()) return null;
    const normalized = name.trim();
    return groups.find(group => (
        group.zh === normalized ||
        group.en === normalized ||
        group.ru === normalized ||
        group.aliases?.includes(normalized)
    )) || null;
}

function localizeLabel(groups, name, text) {
    if (!name || typeof text !== 'function') return name;
    const group = findLabelGroup(groups, name);
    return group ? text(group.zh, group.en, group.ru) : name;
}

export function isBuiltInFolderLabel(name) {
    return !!findLabelGroup(FOLDER_LABEL_GROUPS, name);
}

export function getBuiltInFolderLabel(name, text) {
    return localizeLabel(FOLDER_LABEL_GROUPS, name, text);
}

export function getBuiltInWorkName(name, text) {
    return localizeLabel(WORK_NAME_GROUPS, name, text);
}

export function getBuiltInEndpointName(name, text) {
    return localizeLabel(ENDPOINT_NAME_GROUPS, name, text);
}

export function getBuiltInNodeLabel(node, text) {
    if (node.type === 'work') return getBuiltInWorkName(node.name, text);
    if (node.type === 'folder' || node.type === 'special') {
        return getBuiltInFolderLabel(node.name, text);
    }
    return node.name;
}

export function getSettingsIconOptions(text) {
    return ICON_LABELS.map(({ name, zh, en, ru }) => ({ name, label: text(zh, en, ru) }));
}
