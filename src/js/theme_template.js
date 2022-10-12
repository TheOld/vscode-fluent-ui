(function () {
    // Grab body node
    const bodyNode = document.querySelector('body');
    let isLayoutCompact = false;
    let isUILite = false;
    let withResizeListener = false;

    let debounceTimer;
    const debounce = (callback, time) => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(callback, time);
    };

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            if (entry.contentBoxSize) {
                // applyCompactStyles();
                debounce(applyCompactStyles, 300);
            }
        }
    });

    const watchLayout = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // applyCompactStyles();
                debounce(applyCompactStyles, 300);
            }
        }
    };

    const watchAttributes = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                console.log('Attribute changed on chromium');
                const chromium = document.querySelector('div.chromium');

                const { classList } = chromium;
                if (classList.contains('vs')) {
                    if (isUILite) {
                        applyLightStyles(1);
                    } else {
                        applyLightStyles();
                    }
                }

                if (classList.contains('vs-dark')) {
                    if (isUILite) {
                        applyDarkStyles(1);
                    } else {
                        applyDarkStyles();
                    }
                }
            }
        }
    };

    // Callback function to execute when mutations are observed
    const watchForBootstrap = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                debugger;
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

    // Add custom styles
    const initFluentUI = (disableFilters, isCompact, obs) => {
        isLayoutCompact = isCompact;

        var themeStyleTag = document.querySelector('.vscode-tokens-styles');

        if (!themeStyleTag) {
            return;
        }

        // var initialThemeStyles = themeStyleTag.innerText;
        // var updatedThemeStyles = initialThemeStyles;

        // Add style classes
        const settingsEditor = document.querySelector('.settings-editor');
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.add('card');

        const splitViewContainer = sidebar.parentElement.closest('.split-view-container');

        if (isLayoutCompact) {
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

        const chromium = document.querySelector('div.chromium');
        const chromeThemeObserver = new MutationObserver(watchAttributes);
        chromeThemeObserver.observe(chromium, { attributes: true });

        if (disableFilters) {
            console.log('Disabling filters');
            isUILite = true;
            document.documentElement.style.setProperty('--backdrop-filter', 'none');
        }

        // Here we'll attach an event listener to fix the compact layout when the window resizes
        // window.onresize = applyCompactStyles;

        console.log('Fluent UI: initialised!');

        // disconnect the observer because we don't need it anymore
        if (obs) {
            obs.disconnect();
        }
    };

    const overrideDocumentStyle = ({ property, value }) => {
        document.documentElement.style.setProperty(property, value);
    };

    const applyDarkStyles = (opacity = 0.7) => {
        try {
            // Yeap, I have to override each one individually until VSCode allows me to dynamically add <style> tags to the document
            overrideDocumentStyle({ property: '--accent', value: '#0078d4' });
            overrideDocumentStyle({ property: '--active-action-item-bg', value: 'var(--card-bg)' });
            // overrideDocumentStyle({ property: '--activitybar-indicator-bg', value: '#60cdff' });
            overrideDocumentStyle({ property: '--app-bg', value: 'rgba(44, 44, 44, 0.85)' });
            overrideDocumentStyle({
                property: '--background-color',
                value: 'rgba(0, 0, 0, 0.0578)',
            });
            overrideDocumentStyle({
                property: '--card-bg',
                value: `rgba(32, 32, 32, ${opacity})`,
            });
            overrideDocumentStyle({ property: '--card-bg-blend-mode', value: 'color, luminosity' });
            overrideDocumentStyle({
                property: '--context-menu-bg',
                value: `rgba(32, 32, 32, ${opacity})`,
            });
            overrideDocumentStyle({
                property: '--editor-bg',
                value: `rgba(32, 32, 32, ${opacity})`,
            });
            overrideDocumentStyle({ property: '--editor-widget-bg', value: 'var(--card-bg)' });
            overrideDocumentStyle({ property: '--foreground', value: '#ffffff' });
            overrideDocumentStyle({ property: '--hover-bg', value: 'var(--card-bg)' });
            overrideDocumentStyle({
                property: '--list-item-bg',
                value: 'rgba(255, 255, 255, 0.0605)',
            });
            overrideDocumentStyle({ property: '--list-item-fg', value: '#ffffff99' });
            overrideDocumentStyle({
                property: '--notification-toast-bg',
                value: `rgba(32, 32, 32, ${opacity})`,
            });
            overrideDocumentStyle({
                property: '--quick-input-widget-bg',
                value: `rgba(32, 32, 32, ${opacity})`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const applyLightStyles = (opacity = 0.7) => {
        try {
            // Yeap, I have to override each one individually until VSCode allows me to dynamically add <style> tags to the document
            overrideDocumentStyle({ property: '--accent', value: '#005fb8' });
            overrideDocumentStyle({
                property: '--active-action-item-bg',
                value: 'rgba(0, 0, 0, 0.0605)',
            });
            // overrideDocumentStyle({ property: '--activitybar-indicator-bg', value: '#60cdff' });
            overrideDocumentStyle({ property: '--app-bg', value: 'rgba(243, 243, 243, 0.85)' });
            overrideDocumentStyle({
                property: '--flyout-bg',
                value: `rgba(252, 252, 252, ${opacity})`,
            });
            overrideDocumentStyle({
                property: '--background-color',
                value: `rgba(255, 255, 255, ${opacity})`,
            });
            overrideDocumentStyle({
                property: '--card-bg',
                value: `rgba(255, 255, 255, ${opacity})`,
            });
            overrideDocumentStyle({ property: '--card-bg-blend-mode', value: 'multiply' });
            overrideDocumentStyle({
                property: '--context-menu-bg',
                value: 'var(--menu-bg)',
            });
            overrideDocumentStyle({ property: '--editor-bg', value: 'var(--card-bg)' });
            overrideDocumentStyle({ property: '--editor-widget-bg', value: 'var(--flyout-bg)' });
            overrideDocumentStyle({ property: '--foreground', value: '#000000' });
            overrideDocumentStyle({ property: '--hover-bg', value: ' var(--flyout-bg)' });
            overrideDocumentStyle({ property: '--list-item-bg', value: 'rgba(0, 0, 0, 0.0373)' });
            overrideDocumentStyle({ property: '--list-item-fg', value: '#0000009b' });
            overrideDocumentStyle({
                property: '--notification-toast-bg',
                value: 'var(--flyout-bg)',
            });
            overrideDocumentStyle({
                property: '--quick-input-widget-bg',
                value: 'var(--flyout-bg)',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const applyCompactStyles = () => {
        if (isLayoutCompact) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.add('compact');
            const sidebarContainer = sidebar.parentElement;

            const activitybar = document.querySelector('.activitybar');
            activitybar.classList.add('compact');

            const tabs = document.querySelector('.tabs');
            tabs.classList.add('compact');

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

    // try to initialise the theme
    initFluentUI([DISABLE_FILTERS], [IS_COMPACT]);

    // Use a mutation observer to check when we can bootstrap the theme
    const observer = new MutationObserver(watchForBootstrap);
    observer.observe(bodyNode, { attributes: true, childList: true });
})();
