// eslint-disable-next-line @typescript-eslint/naming-convention
const UglifyJS = require('uglify-js');
const sharp = require('sharp');
import minify from '@node-minify/core';
import cssnano from '@node-minify/cssnano';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Url from 'url';
import * as vscode from 'vscode';
import { nanoid } from 'nanoid';
import { RequestInfo, RequestInit } from 'node-fetch';

import {
    buildBackupFilePath,
    createBackup,
    deleteBackupFiles,
    getBackupUuid,
    restoreBackup,
} from './backup-helper';
import { messages } from './messages';

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
    try {
        const output = await postcss([cssnano]).process(css);

        return output.css;
    } catch (error) {
        vscode.window.showErrorMessage(error);
    }
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

        const mini = await minify({
            compressor: cssnano,
            input: fileName,
            output: path.join(__dirname, '/css/chrome-min.css'),
        })
            .then(function (min) {
                console.log('CSS min');
                return min;
            })
            .catch(function (error) {
                throw error;
            });

        // const miniCSS = fetched.toString(); //await minifyCss(fetched);

        return `<style>${mini}</style>\n`;
    } catch (error) {
        vscode.window.showErrorMessage(error);
        vscode.window.showWarningMessage(messages.cannotLoad + url);
    }
}

export async function getBase64Image(wallPath: string) {
    try {
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

async function getCSSTag() {
    const config = vscode.workspace.getConfiguration('fluent-ui-vscode');
    const activeTheme = vscode.window.activeColorTheme;
    const isDark = activeTheme.kind === 2;
    const isCompact = config.get('compact');
    const enableBg = config.get('enableWallpaper');
    const bgURL = config.get('wallpaperPath');

    const accent = `${config.get('accent')}`;
    const darkBgColor = `${config.get('darkBackground')}b3`;
    const lightBgColor = `${config.get('lightBackground')}b3`;

    let encodedImage: boolean | string = false;

    if (enableBg) {
        encodedImage = await getBase64Image(bgURL);
    }

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

            if (!enableBg) {
                imp = imp.replace('APP_BG', 'transparent');
            } else {
                imp = imp.replace('APP_BG', 'var(--card-bg)');
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

async function buildJsFile(jsFile: string) {
    try {
        const url = '/js/theme_template.js';
        const config = vscode.workspace.getConfiguration('fluent-ui-vscode');
        const jsTemplate = await fs.readFile(__dirname + url);
        let buffer = jsTemplate.toString();

        const isCompact = config.get('compact');
        const accent = `${config.get('accent')}`;
        const darkBgColor = `${config.get('darkBackground')}b3`;
        const lightBgColor = `${config.get('lightBackground')}b3`;

        buffer = buffer.replace(/\[IS_COMPACT\]/g, String(isCompact));
        buffer = buffer.replace(/\[LIGHT_BG\]/g, `"${lightBgColor}"`);
        buffer = buffer.replace(/\[DARK_BG\]/g, `"${darkBgColor}"`);
        buffer = buffer.replace(/\[ACCENT\]/g, `"${accent}"`);

        const uglyJS = UglifyJS.minify(buffer);

        await fs.writeFile(jsFile, uglyJS.code, 'utf-8');

        return;
    } catch (error) {
        vscode.window.showErrorMessage(error);
    }
}

/**
 * Loads the CSS and JS file's contents to be injected into the main HTML document
 */
interface PatchArgs {
    htmlFile: string;
    jsFile: string;
    bypassMessage?: boolean;
}
async function patch({ htmlFile, jsFile, bypassMessage }: PatchArgs) {
    let html = await fs.readFile(htmlFile, 'utf-8');
    html = clearHTML(html);

    const styleTags = await getCSSTag();
    // Inject style tag into <head>
    html = html.replace(/(<\/head>)/, '\n' + styleTags + '\n</head>');

    await buildJsFile(jsFile);
    // Injext JS tag into <body>
    html = html.replace(/(<\/html>)/, '\n' + '<script src="fui.js"></script>' + '\n</html>');

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
    const htmlBakFile = path.join(base, CONTAINER, 'workbench', 'workbench.fui');
    const jsFile = path.join(base, CONTAINER, 'workbench', 'fui.js');

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
        await patch({ htmlFile, jsFile, bypassMessage });
    }

    async function uninstall() {
        await clearPatch();
        restart();
    }

    async function clearPatch() {
        try {
            const backupPath = buildBackupFilePath(base);
            await restoreBackup(backupPath, htmlFile);
            await deleteBackupFiles(htmlBakFile, jsFile);
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }

    const installFUI = vscode.commands.registerCommand('fluent-ui-vscode.enableEffects', install);
    const reloadFUI = vscode.commands.registerCommand(
        'fluent-ui-vscode.reloadEffects',
        async () => {
            await clearPatch();
            install(true);
        },
    );
    const uninstallFUI = vscode.commands.registerCommand(
        'fluent-ui-vscode.disableEffects',
        uninstall,
    );

    context.subscriptions.push(installFUI);
    context.subscriptions.push(reloadFUI);
    context.subscriptions.push(uninstallFUI);
}

// This method is called when your extension is deactivated
export function deactivate() {}
