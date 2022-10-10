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
    // This will delete the old fluent.js file :/
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
 *
 * @param {*} uuidSession
 */
export async function createBackup(base: string, uuidSession: string, htmlFile: string) {
    try {
        let html = await fs.readFile(htmlFile, 'utf-8');
        html = clearExistingPatches(html);

        await fs.writeFile(backupFilePath(base, uuidSession), html, 'utf-8');
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
        throw e;
    }
}

export async function getBackupUuid(htmlFilePath: string) {
    try {
        const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

        const match = htmlContent.match(/<!-- FUI-ID ([0-9a-zA-Z-]+) -->/);

        if (!match) {
            vscode.window.showInformationMessage('Cant find matching UUID');
            return null;
        } else {
            return match[1];
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
export const backupFilePath = (base: string, uuid: string) =>
    path.join(base, CONTAINER, 'workbench', `workbench.${uuid}.bak-fui`);
