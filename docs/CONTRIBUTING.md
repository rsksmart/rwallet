# Contributing to rWallet

First of all, thanks for thinking of contributing to this project! 👏

## Code of Conduct

Following these guidelines helps to communicate that you respect the time of the maintainer and developing this open
source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping
you finalize your pull requests.

This project has a [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you
agree to abide by its terms.

## ❤️ Ways to Contribute

- Blog or tweet about the project
- Improve documentation
- Fix a bug
- Implement a new feature
- Discuss potential ways to improve project
- Improve existing implementation, performance, etc.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

* `fix`: bug fixes, e.g. fix Button color on DarkTheme.
* `feat`: new features, e.g. add Snackbar component.
* `refactor`: code refactor, e.g. new folder structure for components.
* `docs`: changes into documentation, e.g. add usage example for Button.
* `test`: adding or updating tests, eg unit, snapshot testing.
* `chore`: tooling changes, e.g. change circleci config.
* `BREAKING CHANGE`: for changes that break existing usage, e.g. change API of a component.

*(TO-DO, to be implemented in the near future) Our pre-commit hooks verify that your commit message matches this format when committing.*

## 🛎 Questions & Feature Requests

Feel free to [open a ticket](https://github.com/rsksmart/rwallet/issues/new) with your question. Feature requests
are also welcome. Describe the feature, why you need it, and how it should work. Please provide as much detail and
context as possible.

## 🐛 File a Bug

In case you've encountered a bug, please make sure:

- You are using the [latest version](https://github.com/rsksmart/rwallet/releases).
- You have read the [documentation](https://github.com/rsksmart/rwallet/wiki) first, and
  double-checked your configuration.
- You have acknowledged from [Troubleshooting & debugging](https://github.com/rsksmart/rwallet/wiki/Troubleshooting) the errors are
  likely a bug in this project, and not coming from e.g. your environment or custom scripts/commands.
- In your issue description, please include:
  - What you expected to see, and what happened instead.
  - Your operating system and other environment information.
  - As much information as possible, such as the command and configuration used.
  - Interesting logs from a verbose and/or debug run.
  - All steps to reproduce the issue.

## 🎁 Pull Requests

> **Working on your first pull request?** You can learn how from this *free* series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

1. Fork the repo and create your branch from `master` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/)).
2. Follow [our wiki](https://github.com/rsksmart/rwallet/wiki) to set up your development environment.
3. Do the changes you want and test them out in the example app before sending a pull request.
 
Pull requests are welcome! If you never created a pull request before, here are some tutorials:

- [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)
- [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Please keep the following in mind:

- To match the existing code styling, use `npm run format` before committing code.
- Remember that this project is cross-platform compatible (iOS, Android).

Unsure about whether you should open a pull request? Feel free to discuss it first in a ticket.

[Fork](https://help.github.com/articles/fork-a-repo/) the repository to get started, and set it up on your machine:

```bash
git clone https://github.com/<your-github-username>/rwallet
cd rwallet
npm install
```

