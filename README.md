# Back-end

## Production:

- Build: [![Build Status](https://travis-ci.com/taller-de-desarrollo-proyectos-III/back-end.svg?branch=main)](https://travis-ci.com/taller-de-desarrollo-proyectos-III/back-end)
- Website: https://nahual-datos-voluntaries.herokuapp.com/

## Staging

- Website: https://tdp3-backend.herokuapp.com

## Documentation

This project has Node.js as a server-side and React as front-end framework to create the UI.

## API documentation

- You can see the document [here](/Documentation/APIdocumentation.pdf)

## ORM with TypeORM

- Using [Data Mapper Pattern](https://typeorm.io/#/active-record-data-mapper/what-is-the-data-mapper-pattern)

## Database

- PostgreSQL v12.1

## Deployment

- Using Node.js buildpack.

## Available scripts

### Install Tools

- **`nvm`**: You can follow the following [instructions](https://github.com/nvm-sh/nvm)
- **`yarn`**: You can follow the following [instructions](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
- **`node`**: `nvm install 12.14.0`

#### Set node version

Stand on the repository root and execute: `nvm use`

### Install dependencies

```bash
yarn install
```

### Run server in development mode

Runs the app in the development mode.
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

```bash
yarn dev
```

The page will reload if you make edits.

### Code formatter

For time saving and good practices, we use [prettier](https://prettier.io/). You only need to run the following instruction:

```bash
yarn format:all
```

### Tests

```bash
yarn test
```

### Linter

```bash
yarn lint
```

### Javascript Compilation

Builds the app for production to the `build` folder.

```bash
yarn build
```

### Database

#### Development setup

- Runs the database container in the background:

```bash
yarn db:start
```

- Runs up the database container:

```bash
yarn db:up
```

- Stops the database container:

```bash
yarn db:stop
```

#### Connections

##### Create

- Creates the current NODE_ENV stage database

```bash
yarn db:create
```

- Creates the test database

```bash
yarn db:test:create
```

##### Migrate

- Migrates the current NODE_ENV stage database

```bash
yarn db:migrate
```

- Migrates the test database

```bash
yarn db:test:migrate
```

##### Drop

- Drops the current NODE_ENV stage database

```bash
yarn db:drop
```

- Drops the test database

```bash
yarn db:test:drop
```

##### Shortcut

- Drops, creates and migrates the current NODE_ENV stage and test database

```bash
yarn db:all:reboot
```
