# beam-server
[![Build Status](https://travis-ci.org/factorialLabs/beam-server.svg)](https://travis-ci.org/factorialLabs/beam-server)
========

## Setup

1. Get Node and npm
2. Clone this repo
3. `npm install`

## DB

DB: [Postgres](postgresql.org) through [node-postgres](https://github.com/brianc/node-postgres)

DB Migration: [Knex](http://knexjs.org/#Migrations)

ORM/Query Generator: [Knex](http://knexjs.org/)

DB Mock for Tests: TBD


### Running migrations

Creation: `npm run db-migrate:create $NAME`

Up: `npm run db-migrate:up`

Down: `npm run db-migrate:down`

Migrations are in the `/migrations` folder
