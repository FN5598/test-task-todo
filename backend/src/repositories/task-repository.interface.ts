import type { Task, TaskStatus } from "../entities/index.js";

export type CreateTaskData = {
  slug: string;
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskData = {
  slug?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export type TaskAccessScope = {
  userId: string;
};

export type TaskListFilters = {
  status?: TaskStatus | "active";
};

export type TaskPagination = {
  limit: number;
  offset: number;
};

export type TaskCounts = {
  active: number;
  done: number;
  total: number;
};

export type TaskListResult = {
  count: number;
  rows: Task[];
};

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
