import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from './dto';
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

  // GET A TASK DETAIL API
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a task details' })
  @ApiBearerAuth()
  @Get(':id')
  getTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @GetUser('sub') userId: string,
  ): Promise<Task> {
    return this.taskService.getTask(userId, taskId);
  }

  // EDIT A TASK ITEM
  @HttpCode(200)
  @ApiOperation({ summary: 'Edit task item detail' })
  @ApiBearerAuth()
  @Put(':id')
  editTask(
    @Body() dto: UpdateTaskDto,
    @Param('id', ParseUUIDPipe) taskId: string,
    @GetUser('sub') userId: string,
  ): Promise<Task> {
    return this.taskService.editTask(taskId, userId, dto);
  }
}
