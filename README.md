# redux-error-snapshot-immutable

Redux thunk and Immutable utility that aims to ease the process of retrying last failed action. (WIP)

--------------------------------

## Description

Immutable-compatible version of [**redux-error-snapshot**](https://github.com/jkomyno/redux-error-snapshot).

Every time a dispatched action has an `error` property, `redux-error-snapshot-immutable` takes care
of saving a snapshot of the error'd state in its reducer, which is exposed to the user, and also
provides a set of utilities to try again the last failed action with the same exact arguments.
The user can also decide to *hide* some actions (which have the property `error`) to the reducer:
for more informations about this possibility, checkout [**reducerCreator**](#reducercreator).

## Typings

This project uses Flow as its type system. It automatically exports *.flow files, but not *.ts. If you do know
how to automatically export TypeScript bindings without writing the same types twice, please let me know by
opening a Pull Request.

## Available Scripts

- `clean`: Deletes the compiled lib folder;
- `build`: Runs the clean script, transpiles the code with babel to the lib folder and copies the flow references;
- `build:watch`: Runs the build script in watch mode
- `lint`: Runs eslint
- `flow`: Verifies if there are flow errors;
- `test`: Runs the test suites with jest;
- `test:watch`: Runs the tests in watch mode;
- `test:cov`: Runs the tests and displays coverage (which should't get below 100%!)
- `test:ci`: Tests lint, flow, and jest errors

You can build your own light version of setting the env.targets property in .babelrc to `"node": "current"`.
The version deployed to npm requires NodeJS 6.11.3, which is the current LTS as of September 2017.

## License

[MIT](LICENSE)
