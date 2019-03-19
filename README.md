# Kanbanist 
The missing kanban board for [Todoist](https://todoist.com/).

![Kanbanist](src/pages/kanbanist.png?raw=true "Kanbanist")

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

## Development

Kanbanist is a static (serverless) website built using [`create-react-app`](https://github.com/facebook/create-react-app) and dependencies are managed using [`yarn`](https://yarnpkg.com/en/)

To get started `git checkout` the repository and then run `yarn` (to install dependencies) and `yarn start` to start the development server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please use the following `prettier` configuration on all javascript files (or run `yarn format`):


		prettier --print-width 120 ---tab-width 4 -single-quote --jsx-bracket-same-line --arrow-parens avoid --trailing-comma es5 --write src/**/*.js


## License
Kanbanist is proudly open source software licensed under [MIT](LICENSE).
