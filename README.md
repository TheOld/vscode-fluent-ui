# VS Code Fluent theme

Inspired by and based on the awesome concept designs by
[u/zeealeidahmad](https://www.reddit.com/r/Windows11/comments/orbgzl/visual_studio_vs_code_and_github_desktop_with/);

The syntax themes VSCode's default Dark and Light. I haven't tested this extensively with other
syntax themes, but most should work fine with a few issues here and there.

To use it

1. Choose your syntax theme, Fluent UI Light or Fluent UI Dark
2. Run `> Fluent UI: Enable`
3. ...
4. Profit! (for your boss)

> NOTE: I don't use breadcrumbs and minimap, so changes for these are minimal, if any.

Naturally, most of the following is persoanl taste, but the custom VS settings I use and recommend
for best results are:

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

Known issues:

- The context menus for the `More actions` buttons on most viewlets is rendering underneath the main
  editor panel. Workaround: move the sidebar to the right [right click on Activity Bar > Move Side
  bar right]

The workbench is set to use Segoe UI Variable (the new standard font for Windows 11). Highly
recommended.

- [Segoe UI variable](https://docs.microsoft.com/en-us/windows/apps/design/downloads/#fonts)
