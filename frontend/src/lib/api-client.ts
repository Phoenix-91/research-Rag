/** API client for communicating with the PaperMind backend. */

import { env } from "./env";

const BASE_URL = env.backendUrl;

interface ApiError {
  detail: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = {
        detail: await response.text(),
        status: response.status,
      };
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = {
        detail: await response.text(),
        status: response.status,
      };
      throw error;
    }

    return response.json() as Promise<T>;
  }

  /** Health check against the backend. */
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.get("/api/v1/health");
  }
}

export const apiClient = new ApiClient(BASE_URL);
