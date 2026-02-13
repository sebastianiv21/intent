import type {
  Transaction,
  Category,
  Budget,
  InsightsData,
  RecurringTransaction,
  AllocationSummary,
  FinancialProfile,
} from "@/types";

const API_BASE = "/api/v1";

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<unknown> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json?.data ?? json;
}

// Build URL with query params (@vercel js-cache-function-results)
function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return endpoint;
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) searchParams.set(key, String(value));
  }
  const query = searchParams.toString();
  return query ? `${endpoint}?${query}` : endpoint;
}

// Generic CRUD factory with explicit return types (@vercel bundle-barrel-imports)
interface CRUDClient<T> {
  list: (params?: Record<string, string | number | undefined>) => Promise<T[]>;
  get: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

function createCRUDClient<T>(endpoint: string): CRUDClient<T> {
  return {
    list: (params?: Record<string, string | number | undefined>) =>
      fetchWithAuth(buildUrl(`${API_BASE}/${endpoint}`, params)) as Promise<T[]>,
    get: (id: string) => fetchWithAuth(`${API_BASE}/${endpoint}/${id}`) as Promise<T>,
    create: (data: Partial<T>) =>
      fetchWithAuth(`${API_BASE}/${endpoint}`, { method: "POST", body: JSON.stringify(data) }) as Promise<T>,
    update: (id: string, data: Partial<T>) =>
      fetchWithAuth(`${API_BASE}/${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(data) }) as Promise<T>,
    delete: (id: string) => fetchWithAuth(`${API_BASE}/${endpoint}/${id}`, { method: "DELETE" }) as Promise<void>,
  };
}

export const api = {
  transactions: {
    ...createCRUDClient<Transaction>("transactions"),
    list: (params?: {
      type?: string;
      categoryId?: string;
      limit?: number;
      offset?: number;
      orderBy?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
    }) => fetchWithAuth(buildUrl(`${API_BASE}/transactions`, params)) as Promise<Transaction[]>,
  },

  categories: {
    ...createCRUDClient<Category>("categories"),
    list: (type?: string) => fetchWithAuth(buildUrl(`${API_BASE}/categories`, type ? { type } : undefined)) as Promise<Category[]>,
  },

  budgets: createCRUDClient<Budget>("budgets"),
  recurring: createCRUDClient<RecurringTransaction>("recurring"),

  financialProfile: {
    get: () => fetchWithAuth(`${API_BASE}/financial-profile`) as Promise<FinancialProfile>,
    create: (data: Partial<FinancialProfile>) =>
      fetchWithAuth(`${API_BASE}/financial-profile`, { method: "POST", body: JSON.stringify(data) }) as Promise<FinancialProfile>,
    update: (data: Partial<FinancialProfile>) =>
      fetchWithAuth(`${API_BASE}/financial-profile`, { method: "PATCH", body: JSON.stringify(data) }) as Promise<FinancialProfile>,
  },

  insights: {
    get: (period?: string) =>
      fetchWithAuth(buildUrl(`${API_BASE}/insights`, period ? { period } : undefined)) as Promise<InsightsData>,
    allocationSummary: (month: string) =>
      fetchWithAuth(`${API_BASE}/insights/allocation-summary?month=${month}`) as Promise<AllocationSummary>,
  },
};
