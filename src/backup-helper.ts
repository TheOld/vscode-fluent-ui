import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { messages } from './messages';
import { CONTAINER } from './extension';

/**
 * Deletes backup files matching UUID
 *
 * @param {*} htmlFile
 */
export async function deleteBackupFiles(htmlFile: string) {
    const htmlDir = path.dirname(htmlFile);
    const htmlDirItems = await fs.readdir(htmlDir);

    for (const item of htmlDirItems) {
        if (item.endsWith('.bak-fui')) {
            await fs.unlink(path.join(htmlDir, item));
        }
    }
}

function clearExistingPatches(html: string) {
    html = html.replace(
        /^.*(<!-- Fluent UI --><script src="fluent.js"><\/script><!-- Fluent UI -->).*\n?/gm,
        '',
    );
    html = html.replace(/<!-- FUI -->[\s\S]*?<!-- FUI -->\n*/, '');
    html = html.replace(/<!-- FUI-ID [\w-]+ -->\n*/g, '');

    return html;
}

/**
 * Creates a backup file from the current workspace.html
 */
export async function createBackup(base: string, htmlFile: string) {
    try {
        let html = await fs.readFile(htmlFile, 'utf-8');

        await fs.writeFile(buildBackupFilePath(base), html, 'utf-8');
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
        throw e;
    }
}

export async function getBackupUuid(htmlFilePath: string) {
    try {
        const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

        const match = htmlContent.match(/<!-- FUI-ID -->/);

        if (!match) {
            return null;
        } else {
            return match[0];
        }
    } catch (e) {
        vscode.window.showInformationMessage(`${messages.genericError}${e}`);
        throw e;
    }
}

/**
 * Restores the backed up workbench.html file
 */
export async function restoreBackup(backupFilePath: string, htmlFile: string) {
    try {
        const stat = await fs.stat(backupFilePath);
        if (stat.isFile()) {
            await fs.unlink(htmlFile);
            await fs.copyFile(backupFilePath, htmlFile);
        }
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
        throw e;
    }
}

/**
 * Generates the path for the backup file we're creating
 */
export const buildBackupFilePath = (base: string) =>
    path.join(base, CONTAINER, 'workbench', `workbench.bak-fui`);
