# AnyDSL website

This is the website of the AnyDSL project and based on jekyll

## Building

```bash
$ git clone https://github.com/AnyDSL/anydsl.github.io
$ cd anydsl.github.io
$ jekyll serve
```

Or using the docker image of jekyll

```shell
$ cd anydsl.github.io
$ docker run --rm -it -p 4000:4000 -v $(pwd):/srv/jekyll jekyll/jekyll jekyll serve
```

## Editing

Please add your content as markdown pages with jekyll frontmatter

```markdown
---
title: my new page has an extensive and full title
short_title: my new page # [optional]
menu: my new page # [optional] entry for the navigation tree
parent: Other-Page.md # [optional] place your page in the navigation below some other page
weight: 5 # [optional] may define the order of entries in the navigation tree
---

## heading A

this is my content under heading A

## heading B

this is my content under heading B
```
