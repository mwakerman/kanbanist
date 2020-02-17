# Contributing
> TLDR: Thank you for your help and remember treat others as one's self would wish to be treated. 

<!--
## Table of Contents
- [Foreword](#foreword)
- [Getting Started](#getting-started)
- [Issues](#issues)
    - [Small Contributions](#small-contributions)
    - [Upvoting Issues](#upvoting-issues)
- [Pull Requests](#pull-requests)
    - [Testing](#testing)
    - [Linting](#linting)
-->

## Foreword

Thank you for your interest in contributing for Kanbanist. Kanbanist is an open source project and we love to receive contributions from our community — you! There are many ways to contribute, from 

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

Please remember to follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and read the [Code Style Guidelines](.prettierrc).

## Getting Started
1. [Open an issue](https://github.com/kanbanist/kanbanist/issues/new) to discuss proposed changes e.g. issue #45
2. [Fork](https://github.com/kanbanist/kanbanist/fork) the repository
3. Create your feature branch: `git checkout -b feature/#45-foobar`
4. Commit your changes: `git commit -am 'Add feature foobar'`
5. Push to the branch: `git push origin feature/#45-foobar`
6. Create a new [pull request](https://github.com/kanbanist/kanbanist/compare)

## Issues
**IMPORTANT: If you find a security vulnerability, do NOT open an issue. Email XXXX instead.**

### Small Contributions

Small contributions that do not involve any new functionality or creative thinking can be done without an issue as long as the change does not affect functionality. Some likely examples include the following:
- Spelling / grammar fixes
- Typo correction, white spaces and formatting changes
- Comment clean up

### Upvoting Issues

Understanding how to improve the project for the most amount of people is only possible if we understand which issues affect the most number of people. Use the reactions feature to +1 existing issues that you affect you. In most cases this would simply be features you would like to see implemented.

## Pull Requests

### Testing

Please ensure all changes have been thoughoutly tested and all the tests pass using `yarn test`.

### Linting

Please use the following `prettier` configuration on all javascript files (or run `yarn format`):
```bash
    prettier --print-width 120 ---tab-width 4 -single-quote --jsx-bracket-same-line --arrow-parens avoid --trailing-comma es5 --write src/**/*.js
```

<!--
## Translations

If you wish to contribute translations, please do so on [Transifex](https://www.transifex.com/kanbanist/kanbanist/).

## Getting in touch
* Ask usage questions (“How do I?”) on [StackOverflow](https://stackoverflow.com/questions/tagged/kanbanist).
* Report bugs, suggest features or view the source code on GitHub.
* Discuss topics on Gitter.
* On IRC find us at #readthedocs.
* Mailing List
-->
