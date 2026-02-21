import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);

const sortAsc = args.includes('--asc');
const sortDesc = args.includes('--desc');
const onlyFiles = args.includes('--files');
const onlyFolders = args.includes('--folders');

const directoryArg = args.find((arg) => !arg.startsWith('--'));
const targetDirectory = directoryArg ?? '.';

const NAME_COLUMN_WIDTH = 30;

function formatSize(bytes) {
    const kb = 1024;
    const mgb = 1024 * 1024;
    const gbg = 1024 * 1024 * 1024;

    if (bytes === 0) return '0 B';

    if (bytes < kb) return `${bytes} B`;
    if (bytes < mgb) return `${(bytes / kb).toFixed(2)} KB`;
    if (bytes < gbg) return `${(bytes / mgb).toFixed(2)} MB`;
    return `${(bytes / gbg).toFixed(2)} GB`;
}

function sortEntries(entries) {
    if (sortAsc) {
        return [...entries].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortDesc) {
        return [...entries].sort((a, b) => b.name.localeCompare(a.name));
    }

    return entries;
}

function filterEntries(entries) {
    if (onlyFiles && !onlyFolders) {
        return entries.filter((entry) => !entry.isDirectory);
    }

    if (onlyFolders && !onlyFiles) {
        return entries.filter((entry) => entry.isDirectory);
    }

    return entries;
}

async function main() {
    if (
        process.permission?.has &&
        !process.permission.has('fs.read', targetDirectory)
    ) {
        console.error(`❌ No tienes permiso para leer: ${targetDirectory}`);
        console.error(
            '   Ejecuta permitiendo lectura con Node permissions para ese path.',
        );
        process.exit(1);
    }

    const entries = await readdir(targetDirectory);

    const mappedEntries = await Promise.all(
        entries.map(async (name) => {
            const fullPath = join(targetDirectory, name);
            const stats = await stat(fullPath);

            return {
                name,
                isDirectory: stats.isDirectory(),
                size: stats.isDirectory() ? '-' : formatSize(stats.size),
            };
        }),
    );

    const filteredEntries = filterEntries(mappedEntries);
    const sortedEntries = sortEntries(filteredEntries);

    for (const entry of sortedEntries) {
        const icon = entry.isDirectory ? '📁' : '📄';
        console.log(
            `${icon} ${entry.name.padEnd(NAME_COLUMN_WIDTH)} ${entry.size}`,
        );
    }
}

try {
    await main();
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
