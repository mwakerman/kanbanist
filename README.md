# Kanbanist 1.0 ⏤ The missing Kanban board for [Todoist](https://todoist.com/)

## Update: September, 2023

I'm excited to announce the launch of [Kanbanist 2](https://kanban.ist), a ground-up rewrite of Kanbanist, designed to support many of the features requested here, including project columns, dark mode, customizable task cards, task search, and much more. Kanbanist 2 is not open-source (yet), and Kanbanist 1.0 (this project) is still available at https://old.kanban.ist.

![Kanbanist](src/pages/home-light.png#gh-light-mode-only "Kanbanist 2")
![Kanbanist](src/pages/home-dark.png#gh-dark-mode-only "Kanbanist 2")

## Features (Kanbanist 1.0)

![Kanbanist](src/pages/kanbanist.png?raw=true "Kanbanist")

🖥️ Create a dynamic fullscreen Kanban boards for all your Todoist tasks

🔁 Syncs directly with Todoist, so changes instanstly show up in all your Todoist apps

🔒 Private and secure: no server means no place for unwanted eyes to look at your tasks.

⚡️ Full support for [Todoist quick-add syntax](https://support.todoist.com/hc/en-us/articles/115001745265-Task-Quick-Add).

🎉 Full support for `markdown` and emojis


## Known Issues

- As described in [Issue 74](https://github.com/mwakerman/kanbanist/issues/74), you cannot scroll the board by dragging a task to the edge as is possible in Trello. This is an issue with the underlying drag-and-drop library [`react-beautiful-dnd`](https://github.com/atlassian/react-beautiful-dnd).

## Development

Kanbanist is a static (serverless) website built using [`create-react-app`](https://github.com/facebook/create-react-app) and dependencies are managed using [`yarn`](https://yarnpkg.com/en/)

To get started `git clone` the repository and then run `yarn` (to install dependencies) and `yarn start` to start the development server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please use the following `prettier` configuration on all javascript files (or run `yarn format`):


		prettier --print-width 120 ---tab-width 4 -single-quote --jsx-bracket-same-line --arrow-parens avoid --trailing-comma es5 --write src/**/*.js

## Say Thanks

If Kanbanist adds value to your productivity workflow, please consider supporting the project.


<a href="https://www.buymeacoffee.com/RUZ5hab"><img src="https://img.buymeacoffee.com/button-api/?text=&emoji=&slug=RUZ5hab&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff" /></a>


## License
Kanbanist is proudly open source software licensed under [MIT](LICENSE).
