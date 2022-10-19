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
const sharp = require('sharp');

import {
    buildBackupFilePath,
    createBackup,
    deleteBackupFiles,
    getBackupUuid,
    restoreBackup,
} from './backup-helper';
const wallpaper = require('wallpaper');
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
    html = html.replace(/<!-- FUI-ID -->\n*/g, '');

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

export async function getBase64Image() {
    try {
        const wallPath = await wallpaper.get();

        if (wallPath) {
            const blurredImage = await sharp(wallPath).blur(100).toBuffer();

            return `data:image/png;base64,${blurredImage.toString('base64')}`;
        }

        return false;
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
        throw e;
    }
}

async function getTags(target: string, compact?: boolean, lite?: boolean, useBg?: boolean) {
    const config = vscode.workspace.getConfiguration('fluent');
    const themeMode = vscode.window.activeColorTheme;
    const isDark = themeMode.kind === 2;

    const encodedImage = await getBase64Image();

    if (target === 'styles') {
        let res = '';

        const styles = ['/css/editor_chrome.css', isDark ? '/css/dark_vars.css' : ''];

        for (const url of styles) {
            const imp = await buildCSSTag(url);

            if (imp) {
                res += imp;
            }
        }

        if (useBg && encodedImage) {
            // Replace --app-bg value on res
            res = res.replace('dummy', encodedImage);
        }

        return res;
    }

    if (target === 'javascript') {
        let res = '';
        const url = '/js/theme_template.js';

        const jsTemplate = await fs.readFile(__dirname + url);

        const buffer = jsTemplate.toString();
        const themeWithFilter = buffer.replace(/\[DISABLE_FILTERS\]/g, String(lite));
        const themeIsCompact = themeWithFilter.replace(/\[IS_COMPACT\]/g, String(compact));
        const uglyJS = UglifyJS.minify(themeIsCompact);
        const tag = `<script type="application/javascript">${uglyJS.code}</script>\n`;

        if (tag) {
            res += tag;
        }

        return res;
    }
}

/**
 * Loads the CSS and JS file's contents to be injected into the main HTML document
 */
interface PatchArgs {
    htmlFile: string;
    compact?: boolean;
    lite?: boolean;
    useBg?: boolean;
}
async function patch({ htmlFile, compact = false, lite = false, useBg = true }: PatchArgs) {
    let html = await fs.readFile(htmlFile, 'utf-8');
    html = clearHTML(html);
    html = html.replace(/<meta.*http-equiv="Content-Security-Policy".*>/, '');

    const styleTags = await getTags('styles', compact, lite, useBg);
    // Inject style tag into <head>
    html = html.replace(
        /(<\/head>)/,
        '<!-- FUI-CSS-START -->\n' + styleTags + '\n<!-- FUI-CSS-END -->\n</head>',
    );

    const jsTags = await getTags('javascript', compact, lite);
    // Injext JS tag into <body>
    html = html.replace(
        /(<\/html>)/,
        `<!-- FUI-ID -->\n` + '<!-- FUI-JS-START -->\n' + jsTags + '\n<!-- FUI-JS-END -->\n</html>',
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

    /**
     * Installs full version
     */
    async function install() {
        const backupUuid = await getBackupUuid(htmlFile);
        if (backupUuid) {
            vscode.window.showInformationMessage(messages.alreadySet);
            return;
        }

        await createBackup(base, htmlFile);
        await patch({ htmlFile });
    }

    async function installNoBg() {
        await clearPatch();
        await createBackup(base, htmlFile);
        await patch({ htmlFile, useBg: false });
    }

    async function installCompact() {
        await clearPatch();
        await createBackup(base, htmlFile);
        await patch({ htmlFile, compact: true });
    }

    async function installLite() {
        await clearPatch();
        await createBackup(base, htmlFile);
        await patch({ htmlFile, lite: true });
    }

    /**
     * All optional effects are OFF
     */
    async function installBasic() {
        await clearPatch();
        await createBackup(base, htmlFile);
        await patch({ htmlFile, compact: false, lite: true, useBg: false });
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

        const backupPath = buildBackupFilePath(base);
        await restoreBackup(backupPath, htmlFile);
        await deleteBackupFiles(htmlFile);
    }

    const installFUI = vscode.commands.registerCommand('fluent.enableEffects', install);
    const installFUINoBg = vscode.commands.registerCommand('fluent.enableNoBg', installNoBg);
    const installFUICompact = vscode.commands.registerCommand(
        'fluent.enableCompact',
        installCompact,
    );
    const installFUILite = vscode.commands.registerCommand('fluent.enableLite', installLite);
    const installFUIBasic = vscode.commands.registerCommand('fluent.enableBasic', installBasic);
    const uninstallFUI = vscode.commands.registerCommand('fluent.disableEffects', uninstall);

    context.subscriptions.push(installFUI);
    context.subscriptions.push(installFUINoBg);
    context.subscriptions.push(installFUICompact);
    context.subscriptions.push(installFUILite);
    context.subscriptions.push(installFUIBasic);
    context.subscriptions.push(uninstallFUI);
}

// This method is called when your extension is deactivated
export function deactivate() {}
