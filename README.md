# TASKHUB BACKEND API

## Description

Connect and collaborate with your team on TaskHub, a task management solution that streamlines your workflow and enhances productivity.

## MODULES

### Authentication Resource

### User Resource

### Task Resource

### Reminder Service

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

# Setting up and running the app on your machine

### Step 1:

```bash
 $ git clone git@github.com:Timothy-py/TaskHub.git
```

### Step 2:

Navigate to the project directory i.e TaskHub/

### Step 3: Environment Setup

Create '.env' file in the root directory  
Copy the contents '.env.sample' file and paste into .env  
Set your desired configurations, especially the database name, username and password

### Step 4: Database setup

Ensure mysql server is installed and running on your system  
Create a database with the name used above or default 'taskhub'

### Step 5: Install the packages

Run this command in the root directory

```bash
$ npm install
```

### Step 6: Running the app

Run this command in the root directory

```bash
$ npm run start
or
# watch mode
$ npm run start:dev
```

# Setting up and running the app on Docker container

### Step 1: Install the docker and docker compose on your machine

### Step 2: Spin up the app

Run this command in the root directory

```bash
$ docker-compose up
or
$ sudo docker-compose up
```

<!-- # Start Commands for Docker

Build your image:
`docker build <your path> -t <<user>/project-name>`

Run:
`docker run -p 8080:3000 <<user>/project-name>` -->

## OpenAPI Documentation

When the app is running on either your machine or docker, access the api docs on this url

```
http://localhost:3000/api/doc
```

## Test

To run the E2E tests for the app, setup the appropriate configs in '.env.test' file in the root directory.  
Run this command

```bash
# e2e tests
$ npm run test:e2e
```

## Stay in touch

- _contact me @ adeyeyetimothy33@gmail.com_
