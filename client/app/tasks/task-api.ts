import "server-only";

import { cookies } from "next/headers";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskStatusFilter = TaskStatus | "active";

export const DEFAULT_TASK_PAGE_LIMIT = 20;

export type Task = {
  createdAt: string;
  description: string | null;
  id: string;
  slug: string;
  status: TaskStatus;
  title: string;
  updatedAt: string;
};

type ErrorResponse = {
  error?: string;
};

export type TaskPagination = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type TaskCounts = {
  active: number;
  done: number;
  total: number;
};

function getApiBaseUrl() {
  const configuredUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const baseUrl = configuredUrl.replace(/\/$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}

async function backendRequest(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();

  return fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...init.headers,
      cookie: cookieStore.toString(),
    },
  });
}

function safePage(value: number | undefined) {
  return Number.isInteger(value) && value && value > 0 ? value : 1;
}

function safeLimit(value: number | undefined) {
  if (!Number.isInteger(value) || !value || value < 1) {
    return DEFAULT_TASK_PAGE_LIMIT;
  }

  return Math.min(value, DEFAULT_TASK_PAGE_LIMIT);
}

export async function listTasks({
  page,
  limit,
  status,
}: {
  limit?: number;
  page?: number;
  status?: TaskStatusFilter;
} = {}) {
  const query = new URLSearchParams({
    page: String(safePage(page)),
    limit: String(safeLimit(limit)),
  });

  if (status) {
    query.set("status", status);
  }

  try {
    const response = await backendRequest(`/tasks?${query.toString()}`);

    if (response.status === 401) {
      return { unauthorized: true as const };
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      return { error: body?.error ?? "Unable to load tasks." };
    }

    return {
      result: (await response.json()) as {
        pagination: TaskPagination;
        tasks: Task[];
      },
    };
  } catch {
    return { error: "Unable to reach the server." };
  }
}

export async function getTaskCounts() {
  try {
    const response = await backendRequest("/tasks/counts");

    if (response.status === 401) {
      return { unauthorized: true as const };
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      return { error: body?.error ?? "Unable to load task counts." };
    }

    return { counts: (await response.json()) as TaskCounts };
  } catch {
    return { error: "Unable to reach the server." };
  }
}

export async function createTask(input: {
  description: string;
  status: TaskStatus;
  title: string;
}) {
  try {
    const response = await backendRequest("/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });

    if (response.status === 401) {
      return { unauthorized: true as const };
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      return { error: body?.error ?? "Unable to create the task." };
    }

    return { success: true as const };
  } catch {
    return { error: "Unable to reach the server." };
  }
}

export async function updateTask(
  taskId: string,
  input: {
    description: string;
    status: TaskStatus;
    title: string;
  },
) {
  try {
    const response = await backendRequest(`/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });

    if (response.status === 401) {
      return { unauthorized: true as const };
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      return { error: body?.error ?? "Unable to update the task." };
    }

    return { task: (await response.json()) as Task };
  } catch {
    return { error: "Unable to reach the server." };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const response = await backendRequest(`/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
    });

    if (response.status === 401) {
      return { unauthorized: true as const };
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      return { error: body?.error ?? "Unable to delete the task." };
    }

    return { success: true as const };
  } catch {
    return { error: "Unable to reach the server." };
  }
}

export async function getTaskBySlug(slug: string) {
  try {
    const response = await backendRequest(`/tasks/slug/${encodeURIComponent(slug)}`);

    if (response.status === 401) {
      return { unauthorized: true as const };
    }

    if (response.status === 404) {
      return { notFound: true as const };
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      return { error: body?.error ?? "Unable to load the task." };
    }

    return { task: (await response.json()) as Task };
  } catch {
    return { error: "Unable to reach the server." };
  }
}
