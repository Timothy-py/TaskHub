import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './../src/app.module';
import { User } from './../src/user/user.model';
import * as request from 'supertest';

const PORT = process.env.PORT;
describe('Authentication (E2E)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

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
  });

  // TEAR DOWN LOGIC
  afterAll(async () => {
    // delete all entries in the user table
    await User.destroy({ where: {} });

    // close sequelize connection
    await sequelize.close();

    // close nestjs app
    await app.close();
  });

  // -----------VALUES-----------------
  const userDto = {
    name: 'user',
    email: 'user@testing.com',
    password: 'password123',
  };

  let accessToken: string;
  let refreshToken: string;

  // **********************SIGN UP TEST**********************
  describe('POST auth/local/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/signup')
        .send(userDto)
        .expect(HttpStatus.CREATED);

      const user: User = response.body;

      expect(user).toBeDefined();
      expect(user.name).toBe(userDto.name);
      expect(user.email).toBe(userDto.email);
    });

    it('should return 409 Conflict if email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/signup')
        .send(userDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe('Email already exist');
    });
  });

  // **********************SIGN IN TEST**********************
  describe('POST /auth/local/signin', () => {
    it('should sign in a user', async () => {
      const email = userDto.email;
      const password = userDto.password;

      // Make a request to sign in the user
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/signin')
        .send({ email, password })
        .expect(HttpStatus.OK);

      // Assert the response
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      // Save the tokens
      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });

    it('should return Unauthorized if invalid credentials are provided', async () => {
      const email = userDto.email;
      const password = 'incorrect-password';

      // Make a request to sign in with invalid credentials
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/signin')
        .send({ email, password })
        .expect(HttpStatus.UNAUTHORIZED);

      // Assert the response
      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.UNAUTHORIZED,
      );
      expect(response.body).toHaveProperty('message', 'Incorrect Password');
    });

    it('should return NotFound if user does not exist', async () => {
      const email = 'user2@testing.com';
      const password = userDto.password;

      // Make a request to sign in with non-existent user
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/signin')
        .send({ email, password })
        .expect(HttpStatus.NOT_FOUND);

      // Assert the response
      expect(response.body).toHaveProperty('statusCode', HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'User does not exist');
    });
  });

  // // **********************REFRESH TOKEN TEST**********************
  describe('POST /auth/local/refresh', () => {
    it('should refresh the access token', async () => {
      // Refresh the access token using the obtained refresh token
      const refreshResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/local/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.OK);

      // Assert the response
      expect(refreshResponse.body).toHaveProperty('access_token');
      expect(refreshResponse.body).toHaveProperty('refresh_token');

      accessToken = refreshResponse.body.access_token;

      // Perform protected requests using the new access token
    });
  });

  // // **********************LOGOUT TEST**********************
  describe('POST /auth/local/logout', () => {
    it('should log out a user', async () => {
      // Make a request to log out the user
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      // Assert the response
      expect(response.body).toBeDefined();
    });

    it('should return 401 Unauthorized if not authenticated', async () => {
      // Make a request to log out without authentication
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/local/logout')
        .expect(HttpStatus.UNAUTHORIZED);

      // Assert the response
      expect(response.body).toBeDefined();
    });
  });
});
