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
    const settingsEditor = document.querySelector('.settings-editor');
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('card');

    /* append the remaining styles */
    updatedThemeStyles = `[CHROME_STYLES][VARS]`;

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute('id', 'fluent-theme-styles');
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');

    document.body.appendChild(newStyleTag);

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
          initFluentUI(false, observer);
        }
      }
    }
  };

  // try to initialise the theme
  initFluentUI(false);

  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap);
  observer.observe(bodyNode, { attributes: true });
})();
