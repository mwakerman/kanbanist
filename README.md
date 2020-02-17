# Kanbanist 

<!-- TODO: Shields (see:shields.io) -->

> The missing kanban board for [Todoist](https://todoist.com/).

![Kanbanist](src/pages/kanbanist.png?raw=true "Kanbanist")

<!--
## Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Development](#development)
    - [Building](#building)
    - [Testing](#testing)
    - [Releasing](#releasing)
    - [Debugging](#debugging)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Authors](#authors)
    - [Achknowledgements](#achknowledgements)
	- [Built With](#built-with)
- [License](#license)
-->

## Features
- Create a dynamic kanban board for Todoist tasks.
- Completely serverless: the application syncs to/from Todoist directly so changes instanstly show up in all your Todoist apps.
- Private and secure: no server means no place for unwanted eyes to look at your tasks.
- Build the perfect board using filters and then save your board as a bookmark.
- Full support for [Todoist quick-add syntax](https://support.todoist.com/hc/en-us/articles/115001745265-Task-Quick-Add).
- Full support for `markdown` and emojis 🎉.

## Thanks

<div style="display: flex; flex-direction: row; align-items: center;">
	<div style="margin-bottom: -6px">
		<a href="https://www.browserstack.com?ref=kanbanist">
			<img src="https://p14.zdusercontent.com/attachment/1015988/z4K7dDR7vr27LN9zoQik5OSZI?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..fZbBaVczeG1OGqEejryeag.trvEOZksETCwsNOKeF7uuwNouu71q1RuviE-F4yy2LpBoCGxZhDta5BTD91ihprg8R6UGjj-5M-Cefx0XgpRejkHY-c46Q2qz10vqul9NSSPyps95Vgk-MZAcdqTTT2as0nJ2G9O624TqvVGrwhy2Ucex1VY1-yYkWFW9buFP2cFpSMb-luTtYmXR74-O3YjOMeIJ7gMU7Xo5Y4ba2NR9Phj_hRB8KlqPuUQwIwyBRHlIccN49i8X0XpIpgUYueclbPnM5-90HKLzmNLJSTfrv45oEFX3JI7uhkxJcfCJWc.KBy5HhXYdNPS92FXnCR6hw" alt="drawing" width="145"/>
		</a>
	</div>
	<div style="padding-left: 8px;">
		supports Kanbanist by providing free access to it's range of cross-browser testing tools.
	</div>
</div>

## Known Issues
- As described in [Issue 9](https://github.com/mwakerman/kanbanist/issues/9), the drag-and-drop functionality is visually buggy (offset) and not working at all in Safari.

## Getting Started
To get started `git clone` the repository and then run `yarn` (to install dependencies) and `yarn start` to start the development server.


## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Changelog
All notable changes are documented in [CHANGELOG.md](CHANGELOG.md). For past available versions, see the [tags on this repository](https://github.com/kanbanist/kanbanist/tags).

## Authors
<!-- Thoses who have written code -->
**Misha Wakerman** -- Maintainer -- [@mwakerman](https://github.com/mwakerman)

See also the list of [contributors](https://github.com/kanbanist/kanbanist/contributors) who participated in this project.

### Acknowledgements
<!-- Anyone whose code was used, inspirations, etc. -->
**Full Name** -- [Reason](https://github.com/username/repo) -- [@username](https://github.com/username)

### Built With
* [Create React App](https://github.com/facebook/create-react-app) -- React boilerplate code generator.
* [Yarn](https://yarnpkg.com/en/) --  Dependency management.

## License
Kanbanist is proudly open source software licensed under [MIT](LICENSE).
