# beam-server
[![Build Status](https://travis-ci.org/factorialLabs/beam-server.svg)](https://travis-ci.org/factorialLabs/beam-server)
========

## Setup

1. Get Node and npm
2. Clone this repo
3. `npm install`
4. `npm install -g knex`

## DB

DB: [Postgres](postgresql.org) through [node-postgres](https://github.com/brianc/node-postgres)

DB Migration: [Knex](http://knexjs.org/#Migrations)

ORM/Query Generator: [Knex](http://knexjs.org/)

DB Mock for Tests: TBD


### Running migrations

Creation: `knex migrate:make NAME`

Up: `knex migrate:latest`

Down: `knex migrate:rollback`

For debug, run with `DEBUG=knex:tx` prefixed. Migrations are in the `/migrations` folder
