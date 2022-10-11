# Fluent UI theme for VS Code

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).
Using CSS3 I tried as much as possible to replicate his designs. Some transparency effects are not
possible at the momend due to the current Electron version that VSCode is using.

## Disclaimer

This is a workbench theme. That means that VS Code's UI is being heavily modified for aestethic
purposes only. There's no intention to enhance or compete with the original look. Is merely an
alternative. Also, please bear in mind that this theme is considered an experiment, and therefore
beta software, since there's no official support for this type of modification, **so used it at your
own risk**.

## Install

1. Run VSCode as admin.
    1. This is important, the extension won't work otherwise
2. Install extension from
   [Marketplace](https://marketplace.visualstudio.com/items?itemName=leandro-rodrigues.fluent-ui-vscode)
3. Run `> Fluent UI: Enable` and reload

> VSCode will display a notification saying that the installtion is corrupt. That's normal, VSCode
> sees the installation as corrupt because the HTML (workbench.html) file is now changed.
>
> Just click the lil' cog on the message and select `Don't show again` and you should be good to go.

## Uninstall

1. Run VSCode as admin.
    1. This is important, you'll end up with a messed up `workbench.html` file if you run the
       `Disable` command as regular user.
2. Run `> Fluent: Disable` and reload when prompted
3. Uninstall the extension like your normally would

> If you ran the command as regular user, here's how you can fix your installation:
>
> 1. On Windows, go to
>    `C:\Users\{username}\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench`.
> 2. Open the file `workbench.html` as admin
> 3. Remove everything between the comments `<!-- FUI-CSS-START -->` and `<!-- FUI-CSS-END -->`.
> 4. Save and reload VSCode

## Known issues

-   I'm unable to override the minimap and in some cases, the scrollbar background. So depending on
    the syntax theme you choose, the Terminal and Minimap's background colors will be off. You can
    set the colors for these panels (and others) manually via settings, like so:

```json
"workbench.colorCustomizations": {
  "terminal.background": "#ffffff",
  "minimap.background": "#ffffff"
}
```

## Features

### Compact mode

Running `> Fluent UI: Compact` will apply the theme using slight less padding around some of the
elements. Difference is subtle but can help those with limited space.

![Normal
mode](https://github.com/TheOld/vscode-fluent-ui/blob/main/normal-mode.png?raw=true 'Normal mode')

![Compact
mode](https://github.com/TheOld/vscode-fluent-ui/blob/main/normal-mode.png?raw=true 'Normal mode')

### Lite mode

The UI theme uses some filters that can cause performance issues on some machines. If notice VS Code
is slower after enabling the theme you can apply a version withoud the filters. Just run
`> Fluent: Lite (no effects)` (that will prompt a VSCode restart) to apply the changes.

### Dynamic light/dark theme

The UI is dynamic and will apply the light and dark themes based on the current syntax theme type.
For example, if you're using
[One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme),
when you run `> Fluent UI: Enable`, the extension will identify
[One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme) as a
`dark` syntax theme and apply the correct UI mode. Same for light themes.

The extension will also do the same on the fly as you preview your syntax theme using
`Ctrl/Cmd + k Ctrl/Cmd + t`

## To complete the look

Product icon themes:

-   [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
    (the one you see in the screenshots)
-   [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I highly
recommend downloading and installing it. If you don't, the theme will fallback to the default font.

-   [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)

### Screenshots

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
