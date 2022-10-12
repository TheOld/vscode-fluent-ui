# ChangeLog

## 3.4.0 (2022-10-13)

-   Added faux-Mica material implementation
-   Multiple UI fixes and adjustments to better align with Fluent UI guidelines
-   Custom styles are now injected into the `<header>` tag allowing for a slight startup perfomance
    gain while making the styles render much earlier.
-   Improved backup and backup restore functionality. Should be more robust and reliable now.
-   Fixed CSS background declaration on many instances, which was causing the background effects to
    not work as intended
-   Fixed activity bar icon spacing in compact mode
-   General style updates and other minor fixes

## 3.1.1 (2022-10-11)

-   Updated ReadMe

## 3.1.0 (2022-10-11)

-   Updated styles and fixed inconsistencies
-   Caret colour is no longer hard-coded and will respect color set by either the syntax theme or
    user config

## 3.0.0 (2022-10-11)

-   Refactored codebase; Now using TypeScript;
-   Fixed issues with deployment due to changed folder path
-   Eliminated some irrelevant dependencies

## 0.3.12 (2021-09-10)

-   Removed What's New page

## 0.3.10 (2021-08-25)

-   Changed file path resolution for What's New page

## 0.3.9 (2021-08-23)

-   Decreased transparency of menus on dark mode

## 0.3.8 (2021-08-19)

-   New dynamic mode. Changing from a light based syntax to a dark based one (and vice-versa) will
    cause the workbench theme to also change

## 0.3.7 (2021-08-18)

-   New compact mode! You can toggle between regular and compact modes in settings.
-   Removed some unecessary overrides that were conflicting with decorations
-   Whats new page

## 0.3.6 (2021-08-16)

-   Dark mode fixes for integrated terminal
-   Decreased transparency on Dark mode

## 0.3.5 (2021-08-16)

-   Fixed item spacing on sidebar
-   Added option to toggle filter effects on and off.
-   Better integrated Breadcrumbs
-   Bottom panel (Terminal/Output, etc) fully integrated - background colour must be set via
    settings for proper best results
-   General layout updates and consistency.

## 0.3.3 (2021-08-13)

-   Fixed: Custom styles were being removed when closing VSCode
