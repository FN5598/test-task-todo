import type { Request, Response } from "express";
import { UnauthorizedError } from "../errors/index.js";
import {
  TaskService,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../services/index.js";
import {
  createTaskSchema,
  updateTaskSchema,
  validateInput,
} from "../validators/index.js";

function createTaskInput(body: unknown): CreateTaskInput {
  return validateInput(createTaskSchema, body);
}

function updateTaskInput(body: unknown): UpdateTaskInput {
  return validateInput(updateTaskSchema, body);
}

function taskId(request: Request) {
  const value = request.params.taskId;
  return Array.isArray(value) ? value[0] : value;
}

function authenticatedUserId(request: Request) {
  if (!request.auth) {
    throw new UnauthorizedError();
  }

  return request.auth.userId;
}

export class TaskController {
  private readonly taskService = new TaskService();

  list = async (request: Request, response: Response) => {
    const tasks = await this.taskService.listTasks(authenticatedUserId(request));
    response.status(200).json(tasks);
  };

  get = async (request: Request, response: Response) => {
    const task = await this.taskService.getTask(authenticatedUserId(request), taskId(request));
    response.status(200).json(task);
  };

  create = async (request: Request, response: Response) => {
    const task = await this.taskService.createTask(authenticatedUserId(request), createTaskInput(request.body));
    response.status(201).json(task);
  };

  update = async (request: Request, response: Response) => {
    const task = await this.taskService.updateTask(
      authenticatedUserId(request),
      taskId(request),
      updateTaskInput(request.body),
    );
    response.status(200).json(task);
  };

  delete = async (request: Request, response: Response) => {
    await this.taskService.deleteTask(authenticatedUserId(request), taskId(request));
    response.status(204).send();
  };
}
