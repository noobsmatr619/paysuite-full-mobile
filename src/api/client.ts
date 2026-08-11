import { API_BASE_URL, USE_REMOTE_API } from "@/constants/config";
import type {
  Customer,
  DashboardStats,
  Estimate,
  Expense,
  Invoice,
  Product,
  Ticket,
  Transaction,
  UserProfile,
} from "@/types/paysuite";
import { localStore } from "./localStore";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

async function remote<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!authToken) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE_URL}/api/mobile/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  async login(email: string, _password: string): Promise<UserProfile> {
    if (USE_REMOTE_API) {
      // Dev bridge: treat password as user UUID token from Wasp admin/DB
      // Production should call a real auth endpoint.
      setAuthToken(_password || email);
      return remote<UserProfile>("my-profile");
    }
    return localStore.login(email);
  },

  async logout() {
    setAuthToken(null);
    if (!USE_REMOTE_API) localStore.logout();
  },

  async stats(): Promise<DashboardStats> {
    if (USE_REMOTE_API) return remote("statistics");
    return localStore.stats();
  },

  async customers(): Promise<Customer[]> {
    if (USE_REMOTE_API) return remote("customers");
    return localStore.customers();
  },

  async createCustomer(
    data: Omit<Customer, "id" | "status"> & { status?: string },
  ): Promise<Customer> {
    if (USE_REMOTE_API) {
      return remote("customers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
    return localStore.createCustomer(data);
  },

  async invoices(): Promise<Invoice[]> {
    if (USE_REMOTE_API) return remote("invoices");
    return localStore.invoices();
  },

  async products(): Promise<Product[]> {
    if (USE_REMOTE_API) return remote("products");
    return localStore.products();
  },

  async createProduct(
    data: Omit<Product, "id">,
  ): Promise<Product> {
    if (USE_REMOTE_API) {
      return remote("products", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
    return localStore.createProduct(data);
  },

  async estimates(): Promise<Estimate[]> {
    if (USE_REMOTE_API) return remote("estimates");
    return localStore.estimates();
  },

  async expenses(): Promise<Expense[]> {
    if (USE_REMOTE_API) return remote("expenses");
    return localStore.expenses();
  },

  async tickets(): Promise<Ticket[]> {
    if (USE_REMOTE_API) return remote("tickets");
    return localStore.tickets();
  },

  async transactions(): Promise<Transaction[]> {
    if (USE_REMOTE_API) return remote("transactions");
    return localStore.transactions();
  },

  async profile(): Promise<UserProfile> {
    if (USE_REMOTE_API) return remote("my-profile");
    return localStore.profile();
  },
};
