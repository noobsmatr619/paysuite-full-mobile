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

async function remote<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (authToken && !path.startsWith("auth/login") && path !== "login") {
    // Do not use Authorization: Bearer — Wasp session middleware may intercept it.
    headers["X-PaySuite-Token"] = authToken;
  }
  const res = await fetch(`${API_BASE_URL}/api/mobile/${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  async login(email: string, password: string): Promise<UserProfile> {
    if (USE_REMOTE_API) {
      const res = await remote<{ token: string; user: UserProfile }>(
        "auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
      );
      setAuthToken(res.token);
      return res.user;
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
  async createCustomer(data: any): Promise<Customer> {
    if (USE_REMOTE_API)
      return remote("customers", { method: "POST", body: JSON.stringify(data) });
    return localStore.createCustomer(data);
  },
  async updateCustomer(id: string, data: any): Promise<Customer> {
    if (USE_REMOTE_API)
      return remote(`customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    return { id, status: "active", ...data };
  },
  async deleteCustomer(id: string) {
    if (USE_REMOTE_API) return remote(`customers/${id}`, { method: "DELETE" });
  },
  async invoices(): Promise<Invoice[]> {
    if (USE_REMOTE_API) return remote("invoices");
    return localStore.invoices();
  },
  async createInvoice(data: any): Promise<Invoice> {
    if (USE_REMOTE_API)
      return remote("invoices", { method: "POST", body: JSON.stringify(data) });
    throw new Error("Create invoice requires remote API");
  },
  async payInvoice(id: string, amount: number) {
    if (USE_REMOTE_API)
      return remote(`invoices/${id}/pay`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
    throw new Error("Pay requires remote API");
  },
  async invoiceDocument(id: string) {
    if (USE_REMOTE_API) return remote(`invoices/${id}/document`);
    return {
      fullNumber: "INV-DEMO",
      html: "<html><body><h1>Demo</h1></body></html>",
      pdfBase64: null as string | null,
    };
  },
  async products(): Promise<Product[]> {
    if (USE_REMOTE_API) return remote("products");
    return localStore.products();
  },
  async createProduct(data: any): Promise<Product> {
    if (USE_REMOTE_API)
      return remote("products", { method: "POST", body: JSON.stringify(data) });
    return localStore.createProduct(data);
  },
  async deleteProduct(id: string) {
    if (USE_REMOTE_API) return remote(`products/${id}`, { method: "DELETE" });
  },
  async estimates(): Promise<Estimate[]> {
    if (USE_REMOTE_API) return remote("estimates");
    return localStore.estimates();
  },
  async createEstimate(data: any) {
    if (USE_REMOTE_API)
      return remote("estimates", { method: "POST", body: JSON.stringify(data) });
    throw new Error("Requires remote API");
  },
  async convertEstimate(id: string) {
    if (USE_REMOTE_API)
      return remote(`estimates/${id}/convert`, { method: "POST", body: "{}" });
    throw new Error("Requires remote API");
  },
  async expenses(): Promise<Expense[]> {
    if (USE_REMOTE_API) return remote("expenses");
    return localStore.expenses();
  },
  async createExpense(data: any) {
    if (USE_REMOTE_API)
      return remote("expenses", { method: "POST", body: JSON.stringify(data) });
    throw new Error("Requires remote API");
  },
  async tickets(): Promise<Ticket[]> {
    if (USE_REMOTE_API) return remote("tickets");
    return localStore.tickets();
  },
  async createTicket(data: any) {
    if (USE_REMOTE_API)
      return remote("tickets", { method: "POST", body: JSON.stringify(data) });
    throw new Error("Requires remote API");
  },
  async ticketDetail(id: string) {
    if (USE_REMOTE_API) return remote(`tickets/${id}`);
    throw new Error("Requires remote API");
  },
  async addTicketComment(id: string, comment: string) {
    if (USE_REMOTE_API)
      return remote(`tickets/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment }),
      });
  },
  async transactions(): Promise<Transaction[]> {
    if (USE_REMOTE_API) return remote("transactions");
    return localStore.transactions();
  },
  async profile(): Promise<UserProfile> {
    if (USE_REMOTE_API) return remote("my-profile");
    return localStore.profile();
  },
  async updateProfile(data: any) {
    if (USE_REMOTE_API)
      return remote("my-profile", { method: "PUT", body: JSON.stringify(data) });
  },
  async plans() {
    if (USE_REMOTE_API) return remote("plans");
    return [];
  },
  async myPlan() {
    if (USE_REMOTE_API) return remote("my-plan");
    return { subscriber: null };
  },
};
