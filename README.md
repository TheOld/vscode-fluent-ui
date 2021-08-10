# Fluent UI theme for VS Code

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/).
Using CSS3 I tried as much as possible to replicate his designs. Some transparency effects are not
possible at the momend due to the current Electron version that VSCode is using.

## Install

1. Install extension from
   [Marketplace](https://marketplace.visualstudio.com/search?target=VSCode&category=Themes&sortBy=Installs)
2. Run `> Fluent UI: Enable`
3. ...
4. Profit! (for your boss)

### Sidebar

![Sidebar preview](sidebar.png 'Sidebar')

### Activity bar

![Activity bar preview](activitybar.png 'Activity bar')

### Tabs

![Tabs preview](tab-list.png 'Tabs')

### Search widget

![Search widget preview](search-widget.png 'Search widget')

### Command palette

![Command palette preview](command-palette-light.png 'Command palette')

## Known bugs

1. You may have to run `> Fluent UI: Enable` twice for it to work.
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

![Serendipity Light theme preview](serendipity-light.png 'Serendipity Light')
![Serendipity Dark theme preview](serendipity-dark.png 'Serendipity Dard')

## [Copilot](https://marketplace.visualstudio.com/items?itemName=BenjaminBenais.copilot-theme)

![Copilot theme preview](copilot.png 'Copilot')

## [Mariana Pro](https://marketplace.visualstudio.com/items?itemName=rickynormandeau.mariana-pro)

![Mariana Prot theme preview](mariana-pro.png 'Mariana Pro')

## [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl)

![Night Owl Light theme preview](night-owl-light.png 'Night Owl Light')
![Night Owl Dark theme preview](night-owl-dark.png 'Night Owl Dark')

## [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)

![One Dark Pro theme preview](one-dark-pro.png 'One Dark Pro ')

## VSCode default white

![VSCode light theme preview](vscode-default-light.png 'VSCode light')

---

# Recommended settings and extensions

Naturally, most of the following is persoanl taste, but the custom VS settings I use and recommend
for best results:

```
{
  "editor.fontFamily": "Cascadia Code",
  "editor.lineHeight": 1.5,
  "editor.cursorSmoothCaretAnimation": true,
  "editor.cursorBlinking": "phase",
  "editor.cursorStyle": "block",
  "workbench.editor.decorations.colors": false,
}
```

### To complete the look

Product icon themes:

- [Fluent Icons](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
  (the one you see on the screenshots)
- [Carbon](https://marketplace.visualstudio.com/items?itemName=antfu.icons-carbon)

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). I highly
recommend downloading and installing it.

- [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)
