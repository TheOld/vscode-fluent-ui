(function () {
  // Grab body node
  const bodyNode = document.querySelector('body');

  // Add custom styles
  const initFluentUI = (isDark, obs) => {
    console.log('Initializing Fluent UI');

    var themeStyleTag = document.querySelector('.vscode-tokens-styles');

    if (!themeStyleTag) {
      return;
    }

    var initialThemeStyles = themeStyleTag.innerText;

    var updatedThemeStyles = initialThemeStyles;

    // Add style classes

    // Add .acrylic to body
    // bodyNode.classList.add('mica');
    const settingsEditor = document.querySelector('.settings-editor');
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('card');

    /* append the remaining styles */
    updatedThemeStyles = `[THEME]${updatedThemeStyles}[CHROME_STYLES]`;

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute('id', 'fluent-theme-styles');
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');

    document.body.appendChild(newStyleTag);

    // If the theme mode is dark we'll need to override the css variables
    if (isDark) {
      console.log('Theme is dark!');
      // Replace css root vars here
      // document.documentElement.style.setProperty('--your-variable', '#YOURCOLOR');

      document.documentElement.style.setProperty('--foreground', '#ffffff');

      document.documentElement.style.setProperty('--background-color', 'rgba(0, 0, 0, 0.0578)');
      // Card BG
      document.documentElement.style.setProperty(
        '--card-bg',
        'linear-gradient(0deg, rgba(32, 32, 32, 0.65), rgba(32, 32, 32, 0.65))',
      );
      document.documentElement.style.setProperty(
        '--quick-input-widget-bg',
        'linear-gradient(0deg, rgba(32, 32, 32, 0.85), rgba(32, 32, 32, 0.85))',
      );
      document.documentElement.style.setProperty('--hover-bg', 'var(--card-bg)');
      document.documentElement.style.setProperty(
        '--context-menu-bg',
        'linear-gradient(0deg, rgba(32, 32, 32, 0.82), rgba(32, 32, 32, 0.82))',
      );
      document.documentElement.style.setProperty('--editor-bg', 'transparent');
      document.documentElement.style.setProperty('--notification-toast-bg', 'var(--card-bg)');
      document.documentElement.style.setProperty('--card-blend-mode', 'color, luminosity');
      document.documentElement.style.setProperty('--app-bg', '#2c2c2c');
      document.documentElement.style.setProperty('--list-item-bg', 'rgba(255, 255, 255, 0.0605)');
      document.documentElement.style.setProperty('--list-item-fg', '#ffffff99');
      document.documentElement.style.setProperty('--activitybar-indicator-bg', '#60CDFF');
      document.documentElement.style.setProperty('--accent', '#0078d4');
      document.documentElement.style.setProperty('--active-action-item-bg', 'var(--card-bg)');
    }

    console.log('Fluent UI: initialised!');

    // disconnect the observer because we don't need it anymore
    if (obs) {
      obs.disconnect();
    }
  };

  // Callback function to execute when mutations are observed
  const watchForBootstrap = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        // does the style div exist yet?
        const tokensLoaded = document.querySelector('.vscode-tokens-styles');

        // does it have content ?
        const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

        // sometimes VS code takes a while to init the styles content, so stop this observer and add an observer for that
        if (tokensLoaded) {
          observer.disconnect();
          observer.observe(tokensLoaded, { childList: true });
        }
      }

      if (mutation.type === 'childList') {
        const tokensLoaded = document.querySelector('.vscode-tokens-styles');
        const tokenStyles = document.querySelector('.vscode-tokens-styles').innerText;

        // Everything we need is ready, so initialise
        if (tokensLoaded && tokenStyles) {
          initFluentUI([IS_DARK], observer);
        }
      }
    }
  };

  // try to initialise the theme
  initFluentUI([IS_DARK]);

  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap);
  observer.observe(bodyNode, { attributes: true });
})();
