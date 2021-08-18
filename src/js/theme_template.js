(function () {
  // Grab body node
  const bodyNode = document.querySelector('body');
  let isLayoutCompact = false;
  let withResizeListener = false;

  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.contentBoxSize) {
        // debounce(() => applyCompactStyles());
        applyCompactStyles();
      }
    }
  });

  // Add custom styles
  const initFluentUI = (disableFilters, isCompact, obs) => {
    isLayoutCompact = isCompact;
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

    const splitViewContainer = sidebar.parentElement.closest('.split-view-container');

    sidebar.classList.add('card');

    if (isCompact) {
      const sidebarContainer = sidebar.parentElement;
      const editorContainer = document.querySelector('.editor-container');

      console.log('Attaching resize observers');
      // Mutation observer to check layout changes and apply corresponding classes
      const layoutObserver = new MutationObserver(watchLayout);
      layoutObserver.observe(splitViewContainer, { childList: true });

      // init resize observer on sidebarContainer to refresh layout when it changes
      resizeObserver.observe(sidebarContainer);
      resizeObserver.observe(editorContainer);

      applyCompactStyles();
    }

    /* append the remaining styles */
    updatedThemeStyles = `[CHROME_STYLES][VARS]`;

    if (disableFilters) {
      console.log('Disabling filters');
      document.documentElement.style.setProperty('--backdrop-filter', 'none');
    }

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute('id', 'fluent-theme-styles');
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');

    document.body.appendChild(newStyleTag);

    // Here we'll attach an event listener to fix the compact layout when the window resizes
    window.onresize = applyCompactStyles;

    console.log('Fluent UI: initialised!');

    // disconnect the observer because we don't need it anymore
    if (obs) {
      obs.disconnect();
    }
  };

  const applyCompactStyles = () => {
    if (isLayoutCompact) {
      const sidebar = document.querySelector('.sidebar');

      const activitybar = document.querySelector('.activitybar');
      activitybar.classList.add('compact');

      sidebar.classList.add('compact');
      const sidebarContainer = sidebar.parentElement;

      const bottomPanel = document.querySelector('.part.panel.bottom');
      bottomPanel.classList.add('compact');

      const breadcrumbs = document.querySelector('.monaco-breadcrumbs');
      breadcrumbs.classList.add('compact');

      const editor = document.querySelector('.editor');
      editor.classList.add('compact');

      const editorContainer = document.querySelector('.editor-container');
      editorContainer.classList.add('compact');

      // Here we override the activitybar width
      document.documentElement.style.setProperty('--activity-bar-width', '36px');

      const activitybarContainer = activitybar.parentElement;
      activitybarContainer.style.setProperty('width', '36px');
      activitybarContainer.style.setProperty('max-width', '36px');

      if (sidebar.classList.contains('left')) {
        sidebarContainer.style.setProperty('left', '42px');
      }

      if (activitybar.classList.contains('right')) {
        sidebarContainer.style.setProperty('right', '36px');
        activitybarContainer.style.removeProperty('left');
        activitybarContainer.style.setProperty('right', '0');
        activitybarContainer.style.setProperty('margin-right', '2px');
      }
    }
  };

  const watchLayout = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        applyCompactStyles();
      }
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
          initFluentUI([DISABLE_FILTERS], [IS_COMPACT], observer);
        }
      }
    }
  };

  function debounce(func, timeout = 120) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  // try to initialise the theme
  initFluentUI([DISABLE_FILTERS], [IS_COMPACT]);

  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap);
  observer.observe(bodyNode, { attributes: true });
})();
