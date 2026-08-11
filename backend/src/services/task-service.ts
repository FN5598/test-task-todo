import { TaskStatus } from "../entities/index.js";
import {
  AppError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";
import {
  type CreateTaskData,
  type TaskAccessScope,
  TaskRepository,
  type UpdateTaskData,
} from "../repositories/index.js";

export class TaskNotFoundError extends NotFoundError {
  constructor(taskId: string) {
    super(`Task ${taskId} was not found`);
  }
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export class TaskService {
  private readonly taskRepository = new TaskRepository();

  async listTasks(userId: string) {
    return this.execute("list tasks", () => this.taskRepository.findAll(this.validateAccess(userId)));
  }

  async getTask(userId: string, taskId: string) {
    return this.execute("get task", () => this.findTask(this.validateAccess(userId), taskId));
  }

  async createTask(userId: string, input: CreateTaskInput) {
    return this.execute("create task", async () => {
      const scope = this.validateAccess(userId);

      try {
        return await this.taskRepository.create(scope, this.toCreateData(input));
      } catch (error) {
        if (error instanceof ConflictError) {
          throw new TaskNotFoundError(userId);
        }

        throw error;
      }
    });
  }

  async updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
    return this.execute("update task", async () => {
      const scope = this.validateAccess(userId);
      await this.findTask(scope, taskId);
      const task = await this.taskRepository.update(scope, taskId, this.toUpdateData(input));

      if (!task) {
        throw new TaskNotFoundError(taskId);
      }

      return task;
    });
  }

  async deleteTask(userId: string, taskId: string) {
    return this.execute("delete task", async () => {
      const scope = this.validateAccess(userId);
      await this.findTask(scope, taskId);
      const deletedCount = await this.taskRepository.delete(scope, taskId);

      if (deletedCount === 0) {
        throw new TaskNotFoundError(taskId);
      }
    });
  }

  private toCreateData(input: CreateTaskInput): CreateTaskData {
    return input;
  }

  private toUpdateData(input: UpdateTaskInput): UpdateTaskData {
    return input;
  }

  private validateAccess(userId: string): TaskAccessScope {
    if (!isUuid(userId)) {
      throw new UnauthorizedError();
    }

    return { userId };
  }

  private async findTask(scope: TaskAccessScope, taskId: string) {
    if (!isUuid(taskId)) {
      throw new TaskNotFoundError(taskId);
    }

    const task = await this.taskRepository.findById(scope, taskId);

    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    return task;
  }

  private async execute<T>(operation: string, callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError(`Unable to ${operation}`, { cause: error });
    }
  }
}
