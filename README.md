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

## Known Issues

- As described in [Issue 9](https://github.com/mwakerman/kanbanist/issues/9), the drag-and-drop functionality is visually buggy (offset) and not working at all in Safari.

## Development

Kanbanist is a static (serverless) website built using [`create-react-app`](https://github.com/facebook/create-react-app) and dependencies are managed using [`yarn`](https://yarnpkg.com/en/)

To get started `git clone` the repository and then run `yarn` (to install dependencies) and `yarn start` to start the development server.

In case you prefer a more isolated test environment, you can also use Docker or even the more convenient `docker-compose up` to start the development server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please use the following `prettier` configuration on all javascript files (or run `yarn format`):

```
prettier --print-width 120 ---tab-width 4 -single-quote --jsx-bracket-same-line --arrow-parens avoid --trailing-comma es5 --write src/**/*.js
```

## License

Kanbanist is proudly open source software licensed under [MIT](LICENSE).
