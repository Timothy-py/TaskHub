import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto';
import { GetUser } from 'src/decorators';
import { Task } from './task.model';

@ApiTags('Task')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // CREATE TASK API
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiBearerAuth()
  @Post('')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('sub') userId: string,
  ): Promise<Task> {
    return this.taskService.createTask(userId, createTaskDto);
  }
}
