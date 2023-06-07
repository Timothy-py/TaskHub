import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Task } from './../task/task.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userModel: typeof User,
    @InjectModel(Task) private taskModel: typeof Task, 
    private readonly logger: Logger, @Inject(CACHE_MANAGER) private cache: Cache){}

    SERVICE: string = UserService.name;

    // ***********************GET USER PROFILE*********************
    async myProfile(userId: string): Promise<User> {
        try {
            let profile;
            // check cache
            const cacheKey = `user_${userId}`;
            let user: User = await this.cache.get(cacheKey);

            profile = user;

            // if it is not available
            if(!user) {
                user = await this.userModel.findByPk(userId, {
                    include: {
                        model: Task, as: 'assignedTasks'
                    },
                })

                // get user owned tasks
                const my_tasks = await this.taskModel.findAll({
                    where: {
                        ownerId: userId
                    }
                })

                profile = {user, my_tasks};
                // save user in the db
                await this.cache.set(cacheKey, user)
            }

            this.logger.log(`User details retrieved successfully - ${userId}`, this.SERVICE);

            return profile;
        } catch (error) {
            this.logger.error(
                `Unable to retrieve user details - ${userId}`,
                error.stack,
                this.SERVICE,
              );
        
              throw new HttpException(
                `${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
        }
    }
}
