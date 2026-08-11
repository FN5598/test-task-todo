import {
  ConnectionError,
  DatabaseError as SequelizeDatabaseError,
  ForeignKeyConstraintError,
  Op,
  TimeoutError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
} from "@errors/errors.js";
import { Task, TaskStatus } from "@tasks/entities/task.js";
import type {
  CreateTaskData,
  TaskAccessScope,
  TaskListFilters,
  TaskPagination,
  UpdateTaskData,
} from "@tasks/types/task-types.js";
import type { TaskRepositoryInterface } from "./task-repository.interface.js";

export class TaskRepository implements TaskRepositoryInterface {
  async findAll(scope: TaskAccessScope, filters: TaskListFilters, pagination: TaskPagination) {
    return this.execute("list tasks", () =>
      Task.findAndCountAll({
        where: this.listWhere(scope, filters),
        order: [["createdAt", "DESC"]],
        limit: pagination.limit,
        offset: pagination.offset,
      }),
    );
  }

  async countByStatus(scope: TaskAccessScope) {
    return this.execute("count tasks", async () => {
      const [total, active, done] = await Promise.all([
        Task.count({ where: scope }),
        Task.count({ where: { ...scope, status: { [Op.ne]: TaskStatus.DONE } } }),
        Task.count({ where: { ...scope, status: TaskStatus.DONE } }),
      ]);

      return { total, active, done };
    });
  }

  async findById(scope: TaskAccessScope, taskId: string) {
    return this.execute("find task", () => Task.findOne({ where: { id: taskId, ...scope } }));
  }

  async findBySlug(scope: TaskAccessScope, slug: string) {
    return this.execute("find task", () => Task.findOne({ where: { slug, ...scope } }));
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

    if (error instanceof UniqueConstraintError) {
      return new ConflictError("A task with this title already exists", options);
    }

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

  private listWhere(scope: TaskAccessScope, filters: TaskListFilters) {
    if (filters.status === "active") {
      return { ...scope, status: { [Op.ne]: TaskStatus.DONE } };
    }

    return { ...scope, ...(filters.status ? { status: filters.status } : {}) };
  }
}
