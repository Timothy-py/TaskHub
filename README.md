# TASKHUB BACKEND API

## Description

Connect and collaborate with your team on TaskHub, a task management solution that streamlines your workflow and enhances productivity.

## MODULE

### Authentication Resource

### User Resource

### Task Resource

## API Functionalities

- User signup, login, logout, refresh token
- Create task
- Get a task details
- Edit a task
- Mark task complete
- Delete a task
- Add users to a task
- View all assigned users to a task

## Tech Stacks

- Language -> Typescript (Node.js)
- Backend Framework -> Nestjs
- Database -> MySQL
- ORM - > Sequelize
- Cache -> Redis
- Container -> Docker and Docker-compose
- Test -> E2E with Jest and Supertest
- API Documentation -> OpenAPI(Swagger)

## Installation

```bash
$ npm install
```

## Environment Setup

Create '.env' file in the root directory and use the '.env.sample' file to add the necessary configurations.

## Running the app

```bash
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## Swagger API

```
http://localhost:3000/api/doc
```

## Stay in touch

- _contact me @ adeyeyetimothy33@gmail.com_
