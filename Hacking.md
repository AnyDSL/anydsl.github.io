---
title: Hacking
parent: Developers-Corner.md
weight: 3
---

Here, you'll find some information about hacking on and debugging AnyDSL.

## Tools

### yComp

Install the [yComp](https://pp.ipd.kit.edu/firm/yComp) graph viewer to visualize Thorin graphs:
```bash
./scripts/install_ycomp.sh <install_dir>
```
### Vim

#### Setting the ```make``` Variable

If you like [Vim](https://www.vim.org), you might also like:
```bash
./scripts/setup_vim_projects.sh
```
As mentioned by the script, put this in your ```~.vimrc``` in order to automatically set your ```make``` variable in Vim:
```vimscript
if filereadable(".project.vim")
    source .project.vim
endif
```

#### Syntax Highlighting

You might also like to symlink this into your ```~/.vim/``` directory:
```bash
ln -s anydsl/vim/ftdetect/* ~/.vim/ftdetect/.
ln -s anydsl/vim/syntax/* ~/.vim/syntax/.
```
This enables syntax highlighting for Impala and Thorin.

## Hacking

### Breakpoints

TODO

## Logging

TODO

## Web Stuff

### Wiki

Setup this wiki with a git hook to automatically generate a table of contents:
```bash
./scripts/setup_wiki.sh
```
You need [doctoc](https://github.com/thlorenz/doctoc) installed for this magic to work.

### Web Pages and Doxygen

Setup web pages with:
```bash
./scripts/setup_web_pages.sh
```
Now you can bump the online doxygen help with:
```bash
./scripts/update_doxygen.sh (thorin | impala) [commit_sha1]
```
If you don't specify a commit hash, ```master``` will be used.
This will create a local doxygen folder for thorin & impala.

