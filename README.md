<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

Todo App is based on [Nest](https://nestjs.com/) and [PostgresSQL](https://www.postgresql.org/) database. Boot services (APP and DB) is dockerized. App is based on JWT token authentication.

To run this application you must have [nodejs](https://nodejs.org/en) and [docker](https://www.docker.com/) installed on your pc.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# start booth services (App, Db)
$ ./start.sh

$ ./stop.sh
```
## Migration
Migrations start automatically after the first application launch,
but you can run also from command line. Be careful, if you want to start migrations manually, you must be connected inside the app docker container.

```bash
# run migration
$ npm run migration:run


# revert migration
$ npm run migration:revert
```

## Environment variables
All environment variables is located in docker.env file in app root folder. Warning: the docker.env is only for development demonstration purposes. Best practices is add env files to .gitignore

```bash
APP_PORT
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
JWT_EXPIRATION_TIME
```
## API documentation
REST API documentation is writen in [OpenApi](https://swagger.io/specification/) and is available at: 
```bash
http://localhost:3000/api
```
