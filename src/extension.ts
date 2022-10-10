// eslint-disable-next-line @typescript-eslint/naming-convention
const UglifyJS = require('uglify-js');
import * as cssnano from 'cssnano';
import * as fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { RequestInfo, RequestInit } from 'node-fetch';
import * as path from 'path';
import postcss from 'postcss';
import * as Url from 'url';
import * as vscode from 'vscode';
import {
    backupFilePath,
    createBackup,
    deleteBackupFiles,
    getBackupUuid,
    restoreBackup,
} from './backup-helper';

import { messages } from './messages';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const path = require('path');
// import fetch from 'node-fetch';
const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

export const CONTAINER = 'electron-sandbox';

function enabledRestart() {
    vscode.window
        .showInformationMessage(messages.enabled, { title: messages.restartIde })
        .then(reloadWindow);
}

function restart() {
    vscode.window
        .showInformationMessage(messages.disabled, { title: messages.restartIde })
        .then(reloadWindow);
}

function reloadWindow() {
    // reload vscode-window
    vscode.commands.executeCommand('workbench.action.reloadWindow');
}

const minifyCss = async (css: Buffer) => {
    const output = await postcss([cssnano]).process(css);

    return output.css;
};

/**
 * Removes injected files from workbench.html file
 * @param  {} html
 */
function clearHTML(html: string) {
    html = html.replace(/<!-- FUI-CSS-START -->[\s\S]*?<!-- FUI-CSS-END -->\n*/, '');
    html = html.replace(/<!-- FUI-ID [\w-]+ -->\n*/g, '');

    return html;
}

async function buildCSSTag(url: string) {
    try {
        const fileName = path.join(__dirname, url);
        const fetched = await fs.readFile(fileName);

        const miniCSS = await minifyCss(fetched);

        return `<style>${miniCSS}</style>\n`;
    } catch (e) {
        console.error(e);
        vscode.window.showWarningMessage(messages.cannotLoad + url);
        return '';
    }
}

async function getTags(target: string) {
    const config = vscode.workspace.getConfiguration('fluent');
    const themeMode = vscode.window.activeColorTheme;
    const isDark = themeMode.kind === 2;

    if (target === 'styles') {
        let res = '';

        const styles = ['/css/editor_chrome.css', isDark ? '/css/dark_vars.css' : ''];

        for (const url of styles) {
            const imp = await buildCSSTag(url);

            if (imp) {
                res += imp;
            }
        }

        return res;
    }

    if (target === 'javascript') {
        let res = '';
        const js = ['/js/theme_template.js'];

        for (const url of js) {
            const jsTemplate = await fs.readFile(__dirname + url);

            const buffer = jsTemplate.toString();
            const themeWithFilter = buffer.replace(/\[DISABLE_FILTERS\]/g, config.disableFilters);
            const themeIsCompact = themeWithFilter.replace(/\[IS_COMPACT\]/g, config.compact);
            const uglyJS = UglifyJS.minify(themeIsCompact);
            const tag = `<script>${uglyJS.code}</script>\n`;

            if (tag) {
                res += tag;
            }
        }

        return res;
    }
}

/**
 * Loads the CSS and JS file's contents to be injected into the main HTML document
 */
async function patch(uuidSession: string, htmlFile: string) {
    let html = await fs.readFile(htmlFile, 'utf-8');
    html = clearHTML(html);
    html = html.replace(/<meta.*http-equiv="Content-Security-Policy".*>/, '');

    const styleTags = await getTags('styles');
    const jsTags = await getTags('javascript');

    html = html.replace(
        /(<\/html>)/,
        `<!-- FUI-ID ${uuidSession} -->\n` +
            '<!-- FUI-CSS-START -->\n' +
            styleTags +
            jsTags +
            '<!-- FUI-CSS-END -->\n</html>',
    );

    try {
        await fs.writeFile(htmlFile, html, 'utf-8');

        enabledRestart();
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
    }
}

export function activate(context: vscode.ExtensionContext) {
    const appDir = path.dirname(require!.main!.filename);

    const base = path.join(appDir, 'vs', 'code');
    const htmlFile = path.join(base, CONTAINER, 'workbench', 'workbench.html');

    async function install() {
        const uuidSession = nanoid();
        await createBackup(base, uuidSession, htmlFile);
        await patch(uuidSession, htmlFile);
    }

    async function reinstall() {
        await clearPatch();
        await install();
    }

    async function uninstall() {
        await clearPatch();
        restart();
    }

    async function clearPatch() {
        const backupUuid = await getBackupUuid(htmlFile);
        if (!backupUuid) {
            return;
        }

        const backupPath = backupFilePath(base, backupUuid);
        await restoreBackup(backupPath, htmlFile);
        await deleteBackupFiles(htmlFile);
    }

    const installFUI = vscode.commands.registerCommand('fluent.enableEffects', install);
    const uninstallFUI = vscode.commands.registerCommand('fluent.disableEffects', uninstall);
    const updateFUI = vscode.commands.registerCommand('fluent.reload', reinstall);

    context.subscriptions.push(installFUI);
    context.subscriptions.push(uninstallFUI);
    context.subscriptions.push(updateFUI);
}

// This method is called when your extension is deactivated
export function deactivate() {}
