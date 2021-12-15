# Fluent UI theme for VS Code

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).
Using CSS3 I tried as much as possible to replicate his designs. Some transparency effects are not
possible at the momend due to the current Electron version that VSCode is using.

# Disclaimer

This is a workbench theme. That means that VS Code's UI is being heavily modified for aestethic
purposes only. There's no intention to enhance or compete with the original look. Is merely an
alternative. Also, please bear in mind that this theme is considered an experiment, and therefore
beta software, since there's no official support for this type of modification,  **so used it at your own risk**.

>
# New major version is now live!
I have completely reworked the main code to be more reliable, faster and simple. Now instead of spitting out a file and then loading that file into VSCode's HTML, the necessary bits are extracted from the source files and injected into the HTML as minified and uglyfied `<style>` and `<script>` tags.
This makes the whole process more generic and OS/architecture independent, so it **should** work on other OSs other than Windows, not tested though.

### Notable fixes
1. Scrollbars are now displayed correctly
2.

## Install

1. Install extension from
   [Marketplace](https://marketplace.visualstudio.com/items?itemName=leandro-rodrigues.fluent-ui-vscode)
2. Run `> Fluent UI: Enable` and reload

## Uninstall
1. Run `> Fluent: Disable` and reload when prompted
2. Uninstall the extension like your normally would

## Known issues
When the search widget is visible with the `Replace` option toggled and new vertical panel is opened (split editor), the second input on the widget will not automatically resize to fit the new window, looking like this:

![Search widget](https://github.com/TheOld/vscode-fluent-ui/blob/main/search-widget-issue.png?raw=true 'Sidebar')

To fix that, just toggle the `Replace` option off and on again.
# Features

## Dynamic light/dark theme

The UI is dynamic and will apply the light and dark themes based on the current syntax theme type.
For example, if you're using [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme), when you run `> Fluent UI: Enable`, the extension will
identify [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme) as a `dark` syntax theme and apply the correct UI mode. Same for light themes.

The extension will also do the same on the fly as you preview your syntax theme using
`Ctrl/Cmd + k Ctrl/Cmd + t`.

## Settings

The UI theme uses some expensive filters that can cause performance issues on some machines. If
notice VS Code is slower after enabling the theme you can turn this option off. Just go to
Settings > Fluent UI > Disable filters and run `> Fluent: Reload` (that will prompt a VSCode restart) to apply the changes.


## Integrated terminal and minimap background colors

Due to limitations on overriding some colours and depending on the syntax theme you choose, the
Terminal and Minimap's background colors will be off. You can set the colors for these panels
manually via settings, like so:

```
"workbench.colorCustomizations": {
  "terminal.background": "#ffffff",
  "minimap.background": "#ffffff"
}
```

## Screenshots

#### Sidebar

![Sidebar preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/sidebar.png?raw=true 'Sidebar')

#### Activity bar

![Activity bar preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/activitybar.png?raw=true 'Activity bar')

#### Tabs

![Tabs preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/tab-list.png?raw=true 'Tabs')

#### Terminal

![Terminal preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/terminal.png?raw=true 'Terminal')

#### Search widget

![Search widget preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/search-widget.png?raw=true 'Search widget')

#### Command palette

![Command palette preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/command-palette-light.png?raw=true 'Command palette')

## Known bugs

1. If the search widget is visible and the replace option toggled and a new .

> Warning! Most, if not all colors that are not syntax related will be overriden by the UI theme, so
> not every single syntax theme out there will be compatible and will not have proper
> contrast/readability.

> Also note: I haven't tested this extensively with that many syntax themes but most should work
> fine with just a few issues here and there.

Some of the great themes that go along with this UI (in no particular order):

## [Serendipity](https://marketplace.visualstudio.com/items?itemName=wicked-labs.wvsc-serendipity)

![Serendipity Light theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/serendipity-light.png?raw=true 'Serendipity Light')
![Serendipity Dark theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/serendipity-dark.png?raw=true 'Serendipity Dard')

## [Copilot](https://marketplace.visualstudio.com/items?itemName=BenjaminBenais.copilot-theme)

![Copilot theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/copilot.png?raw=true 'Copilot')

## [Mariana Pro](https://marketplace.visualstudio.com/items?itemName=rickynormandeau.mariana-pro)

![Mariana Prot theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/mariana-pro.png?raw=true 'Mariana Pro')

## [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl)

![Night Owl Light theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/night-owl-light.png?raw=true 'Night Owl Light')
![Night Owl Dark theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/night-owl-dark.png?raw=true 'Night Owl Dark')

## [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)

![One Dark Pro theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/one-dark-pro.png?raw=true 'One Dark Pro ')

## VSCode default white

![VSCode light theme preview](https://github.com/TheOld/vscode-fluent-ui/blob/main/vscode-default-light.png?raw=true 'VSCode light')

---

# To complete the look

Product icon themes:

- [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
  (the one you see on the screenshots)
- [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I highly
recommend downloading and installing it. If you don't, the theme will fallback to the default font.

- [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)
