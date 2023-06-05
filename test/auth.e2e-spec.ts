import { HttpStatus, INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { AppModule } from "src/app.module";
import { User } from "src/user/user.model";
import * as request from 'supertest';

describe('Authentication (E2E)', () => {
    let app: INestApplication;
    let sequelize: Sequelize;

    // BUILD UP LOGIC
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({imports: [AppModule], }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('/api/v1');
        await app.init();

        // Get sequenlize instance for acccessing the db
        sequelize = moduleFixture.get(Sequelize);
    });

    // TEAR DOWN LOGIC
    afterAll(async () => {
        // delete all entries in the user table
        await User.destroy({where: {}});

        // close sequelize connection
        await sequelize.close();

        // close nestjs app
        await app.close();
    });

    const userDto = {
      name: 'user',
      email: 'user@testing.com',
      password: 'password123',
    };

    // SIGN UP TEST
    describe('POST /auth/local/signup', () => {
        it('should create a new user', async () => {
    
          const response = await request(app.getHttpServer())
            .post('/auth/local/signup')
            .send(userDto)
            .expect(HttpStatus.CREATED);
    
          const user: User = response.body;
    
          expect(user).toBeDefined();
          expect(user.name).toBe(userDto.name);
          expect(user.email).toBe(userDto.email);
        });
    
        it('should return 409 Conflict if email already exists', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/local/signup')
            .send(userDto)
            .expect(HttpStatus.CONFLICT);
    
          expect(response.body.message).toBe('Email already exists');
        });
    
        it('should return 500 Internal Server Error for other errors', async () => {
          const invalidUserDto = {
            name: 'Invalid User',
            email: 'invalid', // Invalid email
            password: 'password789',
          };
    
          const response = await request(app.getHttpServer())
            .post('/auth/local/signup')
            .send(invalidUserDto)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    
          expect(response.body.message).toBe('Invalid email');
        });
      });

      // SIGN IN TEST
      describe('POST /auth/local/signin', () => {
        it('should sign in a user', async () => {
          const email = userDto.email;
          const password = userDto.password;
    
          // Make a request to sign in the user
          const response = await request(app.getHttpServer())
            .post('/auth/local/signin')
            .send({ email, password })
            .expect(HttpStatus.OK);
    
          // Assert the response
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body).toHaveProperty('refreshToken');
        });
    
        it('should return Unauthorized if invalid credentials are provided', async () => {
          const email = userDto.email;
          const password = 'incorrect-password';
    
          // Make a request to sign in with invalid credentials
          const response = await request(app.getHttpServer())
            .post('/auth/local/signin')
            .send({ email, password })
            .expect(HttpStatus.UNAUTHORIZED);
    
          // Assert the response
          expect(response.body).toHaveProperty('statusCode', HttpStatus.UNAUTHORIZED);
          expect(response.body).toHaveProperty('message', 'Incorrect Password');
        });
    
        it('should return NotFound if user does not exist', async () => {
          const email = 'user2@testing.com';
          const password = userDto.password;
    
          // Make a request to sign in with non-existent user
          const response = await request(app.getHttpServer())
            .post('/auth/local/signin')
            .send({ email, password })
            .expect(HttpStatus.NOT_FOUND);
    
          // Assert the response
          expect(response.body).toHaveProperty('statusCode', HttpStatus.NOT_FOUND);
          expect(response.body).toHaveProperty('message', 'User does not exist');
        });
      });
})