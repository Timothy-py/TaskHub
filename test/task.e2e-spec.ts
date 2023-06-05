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
    await request(app.getHttpServer())
      .post('/api/v1/auth/local/signup')
      .send(testUser)
      .expect(HttpStatus.CREATED);

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
  const taskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    dueDate: '2023-06-01',
    reminderDate: '2023-05-31',
  };
  let taskId: string;

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
      const nonExistingTaskId = '3f02c10a-03fa-11ee-be56-0242ac120002';

      const response = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${nonExistingTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
