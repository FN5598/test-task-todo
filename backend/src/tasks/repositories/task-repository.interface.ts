import type { Task } from "@tasks/entities/task.js";
import type {
  CreateTaskData,
  TaskAccessScope,
  TaskCounts,
  TaskListFilters,
  TaskListResult,
  TaskPagination,
  UpdateTaskData,
} from "@tasks/types/task-types.js";

export interface TaskRepositoryInterface {
  findAll(
    scope: TaskAccessScope,
    filters: TaskListFilters,
    pagination: TaskPagination,
  ): Promise<TaskListResult>;

  countByStatus(scope: TaskAccessScope): Promise<TaskCounts>;

  findById(scope: TaskAccessScope, taskId: string): Promise<Task | null>;

  findBySlug(scope: TaskAccessScope, slug: string): Promise<Task | null>;

  create(scope: TaskAccessScope, data: CreateTaskData): Promise<Task>;

  update(
    scope: TaskAccessScope,
    taskId: string,
    data: UpdateTaskData,
  ): Promise<Task | null>;

  delete(scope: TaskAccessScope, taskId: string): Promise<number>;
}
