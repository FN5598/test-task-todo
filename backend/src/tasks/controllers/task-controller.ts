import type { Request, Response } from "express";
import { UnauthorizedError } from "@errors/errors.js";
import { validateInput } from "@shared/validators/validate-input.js";
import { TaskService } from "@tasks/services/task-service.js";
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from "@tasks/validators/task-schemas.js";

function taskId(request: Request) {
  const value = request.params.taskId;
  return Array.isArray(value) ? value[0] : value;
}

function taskSlug(request: Request) {
  const value = request.params.slug;
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
    const tasks = await this.taskService.listTasks(
      authenticatedUserId(request),
      validateInput(listTasksQuerySchema, request.query),
    );
    response.status(200).json(tasks);
  };

  counts = async (request: Request, response: Response) => {
    const counts = await this.taskService.getTaskCounts(
      authenticatedUserId(request),
    );
    response.status(200).json(counts);
  };

  get = async (request: Request, response: Response) => {
    const task = await this.taskService.getTask(
      authenticatedUserId(request),
      taskId(request),
    );
    response.status(200).json(task);
  };

  getBySlug = async (request: Request, response: Response) => {
    const task = await this.taskService.getTaskBySlug(
      authenticatedUserId(request),
      taskSlug(request),
    );
    response.status(200).json(task);
  };

  create = async (request: Request, response: Response) => {
    const task = await this.taskService.createTask(
      authenticatedUserId(request),
      validateInput(createTaskSchema, request.body),
    );
    response.status(201).json(task);
  };

  update = async (request: Request, response: Response) => {
    const task = await this.taskService.updateTask(
      authenticatedUserId(request),
      taskId(request),
      validateInput(updateTaskSchema, request.body),
    );
    response.status(200).json(task);
  };

  delete = async (request: Request, response: Response) => {
    await this.taskService.deleteTask(
      authenticatedUserId(request),
      taskId(request),
    );
    response.status(204).send();
  };
}
