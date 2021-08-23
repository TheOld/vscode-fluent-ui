# Fluent UI theme for VS Code

## ATTENTION: Run `> Fluent UI: Enable` after each update.

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).
Using CSS3 I tried as much as possible to replicate his designs. Some transparency effects are not
possible at the momend due to the current Electron version that VSCode is using.

### Disclaimer

This is a workbench theme. That means that VS Code's UI is being heavily modified for aestethic
purposes only. There's no intention to enhance or compete with the original look. Is merely an
alternative. Also, please bear in mind that this theme is considered an experiment, and therefore
beta software, since there's no official support for this type of modification.

## Install

1. Install extension from
   [Marketplace](https://marketplace.visualstudio.com/items?itemName=leandro-rodrigues.fluent-ui-vscode)
2. Run `> Fluent UI: Enable`
3. ...
4. Profit! (for your boss)

## Settings

The UI theme uses some expensive filters that can cause performance issues on some machines. If
notice VS Code is slower after enabling the theme you can turn this option off. Just go to
Settings > Fluent UI > Disable filters.

You'll need to run `Fluent UI: Enable` again as the effects are compiled with the remaining styles.

### Integrated terminal and minimap background colors

Due to limitations on overriding some colours and depending on the syntax theme you choose, the
Terminal and Minimap's background colors might be off. You can set the colors for these panels
manually via settings, like so:

```
"workbench.colorCustomizations": {
  "terminal.background": "#ffffff",
  "minimap.background": "#ffffff"
}
```

# Screenshots

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

1. Sometimes when changing a setting (eg.: enabling compact mode) you may have to run
   `> Fluent UI: Enable` twice for it to work.
2. Sometimes when changing from one project to another, the workbench will disable the theme/reset
   the UI to the original state. Closing VSCode then opening and re-applying seems to fix it.

Now, to toggle between light and dark modes, you first need to choose a theme and then run the
`> Fluent UI: Enable` command again. The correct mode will be applied based on the main syntax theme
type.

So for example, if you set the syntax theme to `Night Owl` and then run `> Fluent UI: Enable`, the
extension will detect that `Night Owl` is a dark theme and set the workbench theme to dark. The same
is valid for light themes.

> Warning! Most, if not all colours that are not syntax related will be overriden by the UI theme,
> so not every single syntax theme out there will be compatible and will not have proper
> contrast/readability.

> Note: I don't use breadcrumbs and minimap, so changes for these are minimal, if any.

> Note again: This was only tested on Windows 10 (so far)

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

# To complete the look and slay!

Product icon themes:

- [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
  (the one you see on the screenshots)
- [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I highly
recommend downloading and installing it. If you don't, the theme will fallback to the default font.

- [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)
