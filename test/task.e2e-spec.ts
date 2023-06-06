import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { Task } from './../src/task/task.model';

const PORT = process.env.PORT;
describe('Task (E2E)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let accessToken: string;
  let refreshToken: string;

  // BUILD UP LOGIC
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('/api/v1');
    await app.init();
    await app.listen(PORT);

    // Get sequenlize instance for acccessing the db
    sequelize = moduleFixture.get(Sequelize);

    // Signup a test user
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'TestUser',
    };
    const userResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/local/signup')
      .send(testUser)
      .expect(HttpStatus.CREATED);

    userId = userResponse.body.id;

    // Signin as the test user to obtain an access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/local/signin')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(HttpStatus.OK);

    accessToken = loginResponse.body.access_token;
    refreshToken = loginResponse.body.refresh_token;
  });

  // TEAR DOWN LOGIC
  afterAll(async () => {
    // delete all entries in the user table
    await Task.destroy({ where: {} });

    // close sequelize connection
    await sequelize.close();

    // close nestjs app
    await app.close();
  });

  // -----------VALUES-----------------
  let userId: string;
  const taskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    dueDate: '2023-06-01',
    reminderDate: '2023-05-31',
  };
  let taskId: string;
  const nonExistingTaskId = '3f02c10a-03fa-11ee-be56-0242ac120002';
  const updatedTaskData = {
    title: 'Updated Task',
    description: 'This is an updated task',
    dueDate: '2023-07-15',
    reminderDate: '2023-07-12',
  };
  const updateTaskCompleteDto = {
    isComplete: true,
  };
  const testUser2 = {
    email: 'test2@example.com',
    password: 'password123',
    name: 'Test2User',
  };

  // **********************CREATE A TEST**********************
  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      // Create a new task using the obtained access token
      const createTaskResponse = await request(app.getHttpServer())
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(taskDto)
        .expect(HttpStatus.CREATED);

      const createdTask = createTaskResponse.body;
      taskId = createdTask.id;

      // Assert the response of the created task
      expect(createdTask).toHaveProperty('id');
      expect(createdTask.title).toBe('Test Task');
      expect(createdTask.description).toBe('This is a test task');
    });
  });

  // **********************GET A TASK TEST**********************
  describe('GET /api/v1/tasks/:id', () => {
    it('should get a task detail', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('This is a test task');
    });

    it('should return 404 if task does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${nonExistingTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  // **********************EDIT A TASK TEST**********************
  describe('PUT /api/v1/tasks/:id', () => {
    it('should edit a task', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedTaskData);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.title).toBe('Updated Task');
    });
  });

  // **********************UPDATE TASK COMPLETE STATUS TEST**********************
  describe('PATCH /api/v1/tasks/:id', () => {
    it('should update the complete status of a task', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateTaskCompleteDto);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  // **********************ADD USERS TO A TASK TEST**********************
  describe('PATCH /api/v1/tasks/:id/users', () => {
    it('should add users to a task', async () => {
      // create a user
      const userResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/local/signup')
        .send(testUser2)
        .expect(HttpStatus.CREATED);

      const user2Id = userResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/tasks/${taskId}/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          emails: [user2Id],
        });

      expect(response.status).toBe(HttpStatus.OK);
      //   expect(response.body.users).toEqual(
      //     expect.arrayContaining([userId, user2Id]),
      //   );
    });
  });
});
