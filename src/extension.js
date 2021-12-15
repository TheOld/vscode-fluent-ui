const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const diff = require('semver/functions/diff');
const fetch = require('node-fetch');
const fs = require('fs');
const msg = require('./messages').messages;
const path = require('path');
const postcss = require('postcss');
const Url = require('url');
const uuid = require('uuid');
const vscode = require('vscode');
const UglifyJS = require('uglify-js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  this.extensionName = 'leandro-rodrigues.fluent-ui-vscode';

  const appDir = path.dirname(require.main.filename);
  const base = path.join(appDir, 'vs', 'code');
  const htmlFile = path.join(base, 'electron-browser', 'workbench', 'workbench.html');
  const BackupFilePath = (uuid) =>
    path.join(base, 'electron-browser', 'workbench', `workbench.${uuid}.bak-fui`);

  const themeMode = vscode.window.activeColorTheme;
  const isDark = themeMode.kind === 2;

  async function getFileContent(url) {
    if (/^file:/.test(url)) {
      const fp = Url.fileURLToPath(url);
      return await fs.promises.readFile(fp);
    } else {
      const response = await fetch(url);
      return response.buffer();
    }
  }

  async function install() {
    const uuidSession = uuid.v4();
    await createBackup(uuidSession);
    await patch(uuidSession);
  }

  async function reinstall() {
    await uninstallImpl();
    await install();
  }

  async function uninstall() {
    await uninstallImpl();
    restart();
  }

  async function uninstallImpl() {
    const backupUuid = await getBackupUuid(htmlFile);
    if (!backupUuid) return;

    const backupPath = BackupFilePath(backupUuid);
    await restoreBackup(backupPath);
    await deleteBackupFiles();
  }

  async function getBackupUuid(htmlFilePath) {
    try {
      const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf-8');

      const match = htmlContent.match(/<!-- FUI-ID ([0-9a-fA-F-]+) -->/);

      if (!match) {
        return null;
      } else {
        return match[1];
      }
    } catch (e) {
      vscode.window.showInformationMessage(`${msg.genericError}${e}`);
      throw e;
    }
  }

  async function createBackup(uuidSession) {
    try {
      let html = await fs.promises.readFile(htmlFile, 'utf-8');
      html = clearExistingPatches(html);

      await fs.promises.writeFile(BackupFilePath(uuidSession), html, 'utf-8');
    } catch (e) {
      vscode.window.showInformationMessage(msg.admin);
      throw e;
    }
  }

  function clearExistingPatches(html) {
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
   * Restores the backed up workbench.html file
   * @param  {} backupFilePath
   */
  async function restoreBackup(backupFilePath) {
    try {
      if (fs.existsSync(backupFilePath)) {
        await fs.promises.unlink(htmlFile);
        await fs.promises.copyFile(backupFilePath, htmlFile);
      }
    } catch (e) {
      vscode.window.showInformationMessage(msg.admin);
      throw e;
    }
  }

  async function deleteBackupFiles() {
    const htmlDir = path.dirname(htmlFile);
    const htmlDirItems = await fs.promises.readdir(htmlDir);

    for (const item of htmlDirItems) {
      if (item.endsWith('.bak-fui')) {
        await fs.promises.unlink(path.join(htmlDir, item));
      }
    }
  }

  /**
   * Loads the CSS file's contents to be injected into the main HTML document
   * @param  {} uuidSession
   */
  async function patch(uuidSession) {
    let html = await fs.promises.readFile(htmlFile, 'utf-8');
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
      await fs.promises.writeFile(htmlFile, html, 'utf-8');
    } catch (e) {
      vscode.window.showInformationMessage(msg.admin);
      disabledRestart();
    }

    enabledRestart();
  }

  async function getTags(target) {
    const config = vscode.workspace.getConfiguration('fluent');

    if (target === 'styles') {
      let res = '';

      const styles = ['/css/editor_chrome.css', isDark ? '/css/dark_vars.css' : ''];

      for (const url of styles) {
        const imp = await buildTag(url);

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
        const jsTemplate = await fs.promises.readFile(__dirname + url);

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

  const minifyCss = async (css) => {
    // We pass in an array of the plugins we want to use: `cssnano` and `autoprefixer`
    const output = await postcss([cssnano]).process(css);

    return output.css;
  };

  async function buildTag(url) {
    try {
      const fetched = await fs.promises.readFile(__dirname + url);

      const miniCSS = await minifyCss(fetched);

      return `<style>${miniCSS}</style>\n`;
    } catch (e) {
      console.error(e);
      vscode.window.showWarningMessage(msg.cannotLoad + url);
      return '';
    }
  }
  /**
   * Removes injected files from workbench.html file
   * @param  {} html
   */
  function clearHTML(html) {
    html = html.replace(/<!-- FUI-CSS-START -->[\s\S]*?<!-- FUI-CSS-END -->\n*/, '');
    html = html.replace(/<!-- FUI-ID [\w-]+ -->\n*/g, '');

    return html;
  }

  function enabledRestart() {
    vscode.window.showInformationMessage(msg.enabled, { title: msg.restartIde }).then(reloadWindow);
  }

  function restart() {
    vscode.window
      .showInformationMessage(msg.disabled, { title: msg.restartIde })
      .then(reloadWindow);
  }

  function reloadWindow() {
    // reload vscode-window
    vscode.commands.executeCommand('workbench.action.reloadWindow');
  }

  const installFUI = vscode.commands.registerCommand('fluent.enableEffects', install);
  const uninstallFUI = vscode.commands.registerCommand('fluent.disableEffects', uninstall);
  const updateFUI = vscode.commands.registerCommand('fluent.reload', reinstall);

  context.subscriptions.push(installFUI);
  context.subscriptions.push(uninstallFUI);
  context.subscriptions.push(updateFUI);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
