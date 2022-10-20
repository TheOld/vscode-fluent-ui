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

async function buildCSSTag(url: string, useThemeColors?: boolean) {
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

async function getTags(target: string, compact?: boolean, lite?: boolean) {
    const config = vscode.workspace.getConfiguration('fluent-ui');
    const activeTheme = vscode.window.activeColorTheme;
    const isDark = activeTheme.kind === 2;
    const isCompact = config.get('compact');
    const enableBg = config.get('enableWallpaper');

    const accent = `${config.get('accent')}`;
    const darkBgColor = `${config.get('darkBackground')}b3`;
    const lightBgColor = `${config.get('lightBackground')}b3`;

    let encodedImage: boolean | string = false;

    if (enableBg) {
        encodedImage = await getBase64Image();
    }

    if (target === 'styles') {
        let res = '';

        const styles = ['/css/editor_chrome.css', isDark ? '/css/dark_vars.css' : ''];

        for (const url of styles) {
            let imp = await buildCSSTag(url);

            if (imp) {
                if (url.includes('dark')) {
                    imp = imp.replace('CARD_DARK_BG_COLOR', darkBgColor);
                } else {
                    imp = imp.replace('CARD_LIGHT_BG_COLOR', lightBgColor);
                    imp = imp.replace('ACCENT_COLOR', accent);
                }

                res += imp;
            }
        }

        if (encodedImage) {
            // Replace --app-bg value on res
            res = res.replace('dummy', encodedImage);
        }

        return res;
    }

    if (target === 'javascript') {
        let res = '';
        const url = '/js/theme_template.js';

        const jsTemplate = await fs.readFile(__dirname + url);

        let buffer = jsTemplate.toString();

        buffer = buffer.replace(/\[IS_COMPACT\]/g, String(isCompact));
        buffer = buffer.replace(/\[LIGHT_BG\]/g, `"${lightBgColor}"`);
        buffer = buffer.replace(/\[DARK_BG\]/g, `"${darkBgColor}"`);
        buffer = buffer.replace(/\[ACCENT\]/g, `"${accent}"`);

        const uglyJS = UglifyJS.minify(buffer);
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
    bypassMessage?: boolean;
}
async function patch({ htmlFile, bypassMessage }: PatchArgs) {
    let html = await fs.readFile(htmlFile, 'utf-8');
    html = clearHTML(html);
    html = html.replace(/<meta.*http-equiv="Content-Security-Policy".*>/, '');

    const styleTags = await getTags('styles');
    // Inject style tag into <head>
    html = html.replace(
        /(<\/head>)/,
        '<!-- FUI-CSS-START -->\n' + styleTags + '\n<!-- FUI-CSS-END -->\n</head>',
    );

    const jsTags = await getTags('javascript');
    // Injext JS tag into <body>
    html = html.replace(
        /(<\/html>)/,
        `<!-- FUI-ID -->\n` + '<!-- FUI-JS-START -->\n' + jsTags + '\n<!-- FUI-JS-END -->\n</html>',
    );

    try {
        await fs.writeFile(htmlFile, html, 'utf-8');

        if (bypassMessage) {
            reloadWindow();
        } else {
            enabledRestart();
        }
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
    async function install(bypassMessage?: boolean) {
        if (!bypassMessage) {
            const backupUuid = await getBackupUuid(htmlFile);
            if (backupUuid) {
                vscode.window.showInformationMessage(messages.alreadySet);
                return;
            }
        }

        await createBackup(base, htmlFile);
        await patch({ htmlFile, bypassMessage });
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

    vscode.workspace.onDidChangeConfiguration(async (event) => {
        if (event.affectsConfiguration('fluent-ui')) {
            const backupUuid = await getBackupUuid(htmlFile);
            if (!backupUuid) {
                vscode.window
                    .showInformationMessage(messages.disabled, { title: messages.restartIde })
                    .then(async () => {
                        await clearPatch();
                        install(true);
                    });

                return;
            }

            vscode.window
                .showInformationMessage(messages.restart, { title: messages.restartIde })
                .then(async () => {
                    await clearPatch();
                    install(true);
                });
        }
    });

    const installFUI = vscode.commands.registerCommand('fluent-ui.enableEffects', install);
    const reloadFUI = vscode.commands.registerCommand('fluent-ui.reloadEffects', reloadWindow);
    const uninstallFUI = vscode.commands.registerCommand('fluent-ui.disableEffects', uninstall);

    context.subscriptions.push(installFUI);
    context.subscriptions.push(reloadFUI);
    context.subscriptions.push(uninstallFUI);
}

// This method is called when your extension is deactivated
export function deactivate() {}
