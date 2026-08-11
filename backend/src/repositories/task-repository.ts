import {
  ConnectionError,
  DatabaseError as SequelizeDatabaseError,
  ForeignKeyConstraintError,
  TimeoutError,
  ValidationError,
} from "sequelize";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
} from "../errors/index.js";
import { Task, TaskStatus } from "../entities/index.js";

export type CreateTaskData = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export type TaskAccessScope = {
  userId: string;
};

export class TaskRepository {
  async findAll(scope: TaskAccessScope) {
    return this.execute("list tasks", () =>
      Task.findAll({ where: scope, order: [["createdAt", "DESC"]] }),
    );
  }

  async findById(scope: TaskAccessScope, taskId: string) {
    return this.execute("find task", () => Task.findOne({ where: { id: taskId, ...scope } }));
  }

  async create(scope: TaskAccessScope, data: CreateTaskData) {
    return this.execute("create task", () => Task.create({ ...data, ...scope }));
  }

  async update(scope: TaskAccessScope, taskId: string, data: UpdateTaskData) {
    return this.execute("update task", async () => {
      const [updatedCount, updatedTasks] = await Task.update(data, {
        where: { id: taskId, ...scope },
        returning: true,
      });

      return updatedCount === 0 ? null : updatedTasks[0];
    });
  }

  async delete(scope: TaskAccessScope, taskId: string) {
    return this.execute("delete task", () => Task.destroy({ where: { id: taskId, ...scope } }));
  }

  private async execute<T>(operation: string, callback: () => Promise<T>) {
    try {
      return await callback();
    } catch (error) {
      throw this.toApplicationError(operation, error);
    }
  }

  private toApplicationError(operation: string, error: unknown) {
    const options = { cause: error };

    if (error instanceof ValidationError) {
      return new BadRequestError("Task data is invalid", options);
    }

    if (error instanceof ForeignKeyConstraintError) {
      return new ConflictError("The related user no longer exists", options);
    }

    if (error instanceof ConnectionError || error instanceof TimeoutError) {
      return new ServiceUnavailableError("Database is temporarily unavailable", options);
    }

    if (error instanceof SequelizeDatabaseError) {
      return new InternalServerError("Unable to complete the task operation", options);
    }

    return new InternalServerError(`Unable to ${operation}`, options);
  }
}
