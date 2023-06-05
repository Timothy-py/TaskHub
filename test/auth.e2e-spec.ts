import { HttpStatus, INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { AppModule } from "src/app.module";
import { User } from "src/user/user.model";
import * as request from 'supertest';

describe('Authentication (E2E)', () => {
    let app: INestApplication;
    let sequelize: Sequelize;

    // Build up logic
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({imports: [AppModule], }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('/api/v1');
        await app.init();

        // Get sequenlize instance for acccessing the db
        sequelize = moduleFixture.get(Sequelize);
    });

    // Tear down logic
    afterAll(async () => {
        // delete all entries in the user table
        await User.destroy({where: {}});

        // close sequelize connection
        await sequelize.close();

        // close nestjs app
        await app.close();
    });

    describe('POST /auth/local/signup', () => {
        it('should create a new user', async () => {
          const userDto = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
          };
    
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
          const existingUserDto = {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            password: 'password456',
          };
    
          await request(app.getHttpServer())
            .post('/auth/local/signup')
            .send(existingUserDto)
            .expect(HttpStatus.CREATED);
    
          const response = await request(app.getHttpServer())
            .post('/auth/local/signup')
            .send(existingUserDto)
            .expect(HttpStatus.CONFLICT);
    
          expect(response.body.message).toBe('Email already exists');
        });
    
        it('should return 500 Internal Server Error for other errors', async () => {
          const invalidUserDto = {
            name: 'Invalid User',
            email: '', // Invalid email
            password: 'password789',
          };
    
          const response = await request(app.getHttpServer())
            .post('/auth/local/signup')
            .send(invalidUserDto)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    
          expect(response.body.message).toBe('Invalid email');
        });
      });
})