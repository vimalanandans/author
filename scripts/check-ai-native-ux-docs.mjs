import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const documentPath = path.resolve('AI_NATIVE_WORKSPACE_UX_REFERENCE.md');
const requiredSections = [
    '# AI-Native Workspace UX Reference',
    '## Design principles',
    '## Workspace shell',
    '## Agent operations',
    '## Interaction and motion',
    '## Trust, privacy, and recovery',
    '## Implementation contract',
    '## Acceptance checklist',
];

if (!existsSync(documentPath)) {
    console.error(`Missing AI-native UX reference: ${documentPath}`);
    process.exitCode = 1;
} else {
    const document = readFileSync(documentPath, 'utf8');
    const missing = requiredSections.filter(section => !document.includes(section));
    if (missing.length) {
        console.error(`AI-native UX reference is missing required sections: ${missing.join(', ')}`);
        process.exitCode = 1;
    } else console.log(`AI-native UX reference check passed: ${path.relative(process.cwd(), documentPath)}`);
}
