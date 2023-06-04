import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AddUsersToTaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  updateTaskComplete,
} from './dto';
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

  // UPDATE TASK isComplete
  @HttpCode(200)
  @ApiOperation({ summary: 'Update the complete status of a task' })
  @ApiBearerAuth()
  @Patch(':id')
  updateTaskComplete(
    @Body() dto: updateTaskComplete,
    @Param('id', ParseUUIDPipe) taskId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.taskService.updateTaskComplete(taskId, userId, dto);
  }

  // DELETE TASK ITEM
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a task item' })
  @ApiBearerAuth()
  @Delete(':id')
  deleteTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.taskService.deleteTask(taskId, userId);
  }

  // ADD USER TO TASK
  @HttpCode(200)
  @ApiOperation({ summary: 'Add user to a task' })
  @ApiBearerAuth()
  @Patch('add-users/:id')
  addUsersToTask(
    @Body() dto: AddUsersToTaskDto,
    @Param('id', ParseUUIDPipe) taskId: string,
    @GetUser('sub') userId: string,
  ): Promise<Task> {
    return this.taskService.addUsersToTask(taskId, userId, dto);
  }
}
