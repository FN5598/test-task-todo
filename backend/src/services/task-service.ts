import { TaskStatus } from "../entities/index.js";
import {
  AppError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";
import {
  type CreateTaskData,
  type TaskAccessScope,
  type TaskListFilters,
  type TaskPagination,
  TaskRepository,
  type TaskRepositoryInterface,
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

export type TaskListInput = TaskListFilters & {
  limit: number;
  page: number;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export class TaskService {
  private readonly taskRepository: TaskRepositoryInterface = new TaskRepository();

  async listTasks(userId: string, input: TaskListInput) {
    return this.execute("list tasks", async () => {
      const pagination: TaskPagination = {
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
      };
      const result = await this.taskRepository.findAll(this.validateAccess(userId), { status: input.status }, pagination);

      return {
        tasks: result.rows,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: result.count,
          totalPages: Math.max(1, Math.ceil(result.count / input.limit)),
        },
      };
    });
  }

  async getTaskCounts(userId: string) {
    return this.execute("count tasks", () => this.taskRepository.countByStatus(this.validateAccess(userId)));
  }

  async getTask(userId: string, taskId: string) {
    return this.execute("get task", () => this.findTask(this.validateAccess(userId), taskId));
  }

  async getTaskBySlug(userId: string, slug: string) {
    return this.execute("get task", () => this.findTaskBySlug(this.validateAccess(userId), slug));
  }

  async createTask(userId: string, input: CreateTaskInput) {
    return this.execute("create task", async () => {
      const scope = this.validateAccess(userId);
      const slug = await this.nextTaskSlug(scope, input.title);

      return this.taskRepository.create(scope, this.toCreateData(input, slug));
    });
  }

  async updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
    return this.execute("update task", async () => {
      const scope = this.validateAccess(userId);
      const currentTask = await this.findTask(scope, taskId);
      const slug = input.title && input.title !== currentTask.title
        ? await this.nextTaskSlug(scope, input.title)
        : undefined;
      const task = await this.taskRepository.update(scope, taskId, this.toUpdateData(input, slug));

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

  private toCreateData(input: CreateTaskInput, slug: string): CreateTaskData {
    return { ...input, slug };
  }

  private toUpdateData(input: UpdateTaskInput, slug?: string): UpdateTaskData {
    return { ...input, ...(slug ? { slug } : {}) };
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

  private async findTaskBySlug(scope: TaskAccessScope, slug: string) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new TaskNotFoundError(slug);
    }

    const task = await this.taskRepository.findBySlug(scope, slug);

    if (!task) {
      throw new TaskNotFoundError(slug);
    }

    return task;
  }

  private async nextTaskSlug(scope: TaskAccessScope, title: string) {
    const baseSlug = this.slugify(title);

    for (let suffix = 0; suffix < 1_000; suffix += 1) {
      const candidate = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
      const task = await this.taskRepository.findBySlug(scope, candidate);

      if (!task) {
        return candidate;
      }
    }

    throw new InternalServerError("Unable to create a unique task slug");
  }

  private slugify(title: string) {
    const slug = title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 140)
      .replace(/-+$/g, "");

    return slug || "task";
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
