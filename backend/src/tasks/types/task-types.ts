import type { Task, TaskStatus } from "@tasks/entities/task.js";

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
