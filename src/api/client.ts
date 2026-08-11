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
  if (
    authToken &&
    !path.startsWith("auth/login") &&
    !path.startsWith("auth/register") &&
    !path.startsWith("auth/forgot") &&
    !path.startsWith("auth/verify") &&
    !path.startsWith("auth/confirm") &&
    !path.startsWith("auth/reset") &&
    !path.startsWith("auth/social") &&
    path !== "login"
  ) {
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
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  }): Promise<UserProfile> {
    if (!USE_REMOTE_API) throw new Error("Register requires remote API");
    const res = await remote<{ token: string; user: UserProfile }>(
      "auth/register",
      { method: "POST", body: JSON.stringify(data) },
    );
    setAuthToken(res.token);
    return res.user;
  },
  async forgotPassword(email: string) {
    if (!USE_REMOTE_API) return { ok: true, debugOtp: "123456" };
    return remote<{ ok: boolean; debugOtp?: string; message?: string }>(
      "auth/forgot-password",
      { method: "POST", body: JSON.stringify({ email }) },
    );
  },
  async verifyOtp(email: string, otp: string) {
    if (!USE_REMOTE_API) return { ok: true, token: "demo", email };
    return remote<{ ok: boolean; token: string; email: string }>(
      "auth/verify-otp",
      { method: "POST", body: JSON.stringify({ email, otp }) },
    );
  },
  async resetPassword(email: string, token: string, password: string) {
    if (!USE_REMOTE_API) return { ok: true };
    return remote("auth/confirm-password", {
      method: "POST",
      body: JSON.stringify({ email, token, password }),
    });
  },
  async changePassword(currentPassword: string, newPassword: string) {
    if (!USE_REMOTE_API) return { ok: true };
    return remote("change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, password: newPassword }),
    });
  },
  async logout() {
    setAuthToken(null);
    if (!USE_REMOTE_API) localStore.logout();
  },
  async stats(): Promise<DashboardStats> {
    if (USE_REMOTE_API) return remote("statistics");
    return localStore.stats();
  },
  async customers(params?: { status?: string; search?: string }): Promise<Customer[]> {
    if (USE_REMOTE_API) {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      if (params?.search) qs.set("search", params.search);
      const q = qs.toString();
      return remote(`customers${q ? `?${q}` : ""}`);
    }
    return localStore.customers();
  },
  async customer(id: string): Promise<Customer> {
    if (USE_REMOTE_API) return remote(`customers/${id}`);
    throw new Error("Requires remote API");
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
  async customerInvoices(id: string) {
    if (USE_REMOTE_API) return remote(`customers/${id}/invoices`);
    return [];
  },
  async invoices(params?: {
    status?: string;
    search?: string;
    customerId?: string;
  }): Promise<Invoice[]> {
    if (USE_REMOTE_API) {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      if (params?.search) qs.set("search", params.search);
      if (params?.customerId) qs.set("customerId", params.customerId);
      const q = qs.toString();
      return remote(`invoices${q ? `?${q}` : ""}`);
    }
    return localStore.invoices();
  },
  async invoice(id: string): Promise<Invoice> {
    if (USE_REMOTE_API) return remote(`invoices/${id}`);
    throw new Error("Requires remote API");
  },
  async createInvoice(data: any): Promise<Invoice> {
    if (USE_REMOTE_API)
      return remote("invoices", { method: "POST", body: JSON.stringify(data) });
    throw new Error("Create invoice requires remote API");
  },
  async updateInvoice(id: string, data: any) {
    if (USE_REMOTE_API)
      return remote(`invoices/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
  },
  async cloneInvoice(id: string) {
    if (USE_REMOTE_API)
      return remote(`invoices/${id}/clone`, {
        method: "POST",
        body: "{}",
      });
  },
  async deleteInvoice(id: string) {
    if (USE_REMOTE_API) return remote(`invoices/${id}`, { method: "DELETE" });
  },
  async payInvoice(id: string, amount: number, note?: string) {
    if (USE_REMOTE_API)
      return remote(`invoices/${id}/pay`, {
        method: "POST",
        body: JSON.stringify({ amount, note }),
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
  async updateProduct(id: string, data: any) {
    if (USE_REMOTE_API)
      return remote(`products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
  },
  async deleteProduct(id: string) {
    if (USE_REMOTE_API) return remote(`products/${id}`, { method: "DELETE" });
  },
  async estimates(params?: { status?: string }): Promise<Estimate[]> {
    if (USE_REMOTE_API) {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      const q = qs.toString();
      return remote(`estimates${q ? `?${q}` : ""}`);
    }
    return localStore.estimates();
  },
  async estimate(id: string) {
    if (USE_REMOTE_API) return remote(`estimates/${id}`);
    throw new Error("Requires remote API");
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
  async estimateDocument(id: string) {
    if (USE_REMOTE_API) return remote(`estimates/${id}/document`);
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
  async deleteExpense(id: string) {
    if (USE_REMOTE_API) return remote(`expenses/${id}`, { method: "DELETE" });
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
  async updateTicketStatus(id: string, status: string) {
    if (USE_REMOTE_API)
      return remote(`tickets/${id}/status`, {
        method: "POST",
        body: JSON.stringify({ status }),
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
  async requestAccountDelete(reason?: string) {
    if (USE_REMOTE_API)
      return remote("account-delete-request", {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
  },
  async plans() {
    if (USE_REMOTE_API) return remote("plans");
    return [];
  },
  async myPlan() {
    if (USE_REMOTE_API) return remote("my-plan");
    return { subscriber: null };
  },
  async activatePlan(planId: string) {
    if (USE_REMOTE_API)
      return remote("plan-buy", {
        method: "POST",
        body: JSON.stringify({ planId }),
      });
  },
  async billings() {
    if (USE_REMOTE_API) return remote("billings");
    return [];
  },
  async subscriptionStatus() {
    if (USE_REMOTE_API) return remote("subscription-status");
    return { expired: false };
  },
  async notifications() {
    if (USE_REMOTE_API) return remote("notifications");
    return [];
  },
  async markNotificationRead(id: string) {
    if (USE_REMOTE_API)
      return remote(`notifications/${id}/read`, {
        method: "POST",
        body: "{}",
      });
  },
  async markAllNotificationsRead() {
    if (USE_REMOTE_API)
      return remote("read-all-notifications", { method: "POST", body: "{}" });
  },
  async paymentMethods() {
    if (USE_REMOTE_API) return remote("payment-methods");
    return [];
  },
  async createPaymentMethod(data: { name: string; type?: string }) {
    if (USE_REMOTE_API)
      return remote("payment-methods", {
        method: "POST",
        body: JSON.stringify(data),
      });
  },
  async deletePaymentMethod(id: string) {
    if (USE_REMOTE_API)
      return remote(`payment-methods/${id}`, { method: "DELETE" });
  },
  async taxes() {
    if (USE_REMOTE_API) return remote("taxes");
    return [];
  },
  async createTax(data: { name: string; rate: number }) {
    if (USE_REMOTE_API)
      return remote("taxes", { method: "POST", body: JSON.stringify(data) });
  },
  async notes(type?: string) {
    if (USE_REMOTE_API)
      return remote(`notes${type ? `?type=${encodeURIComponent(type)}` : ""}`);
    return [];
  },
  async createNote(data: { name: string; note: string; type?: string }) {
    if (USE_REMOTE_API)
      return remote("notes", { method: "POST", body: JSON.stringify(data) });
  },
  async categories(type?: string) {
    if (USE_REMOTE_API)
      return remote(
        `categories${type ? `?type=${encodeURIComponent(type)}` : ""}`,
      );
    return [];
  },
  async createCategory(data: { name: string; type?: string }) {
    if (USE_REMOTE_API)
      return remote("categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
  },
  async users() {
    if (USE_REMOTE_API) return remote("users");
    return [];
  },
  async roles() {
    if (USE_REMOTE_API) return remote("roles");
    return [];
  },
  async inviteUser(email: string, roleId?: string) {
    if (USE_REMOTE_API)
      return remote("user-invite", {
        method: "POST",
        body: JSON.stringify({ email, roleId }),
      });
  },
  async permissions() {
    if (USE_REMOTE_API) return remote("my-permissions");
    return { permissions: [], all: [] };
  },
  async customizations() {
    if (USE_REMOTE_API) return remote("customizations");
    return {};
  },
  async updateCustomization(key: string, value: any) {
    if (USE_REMOTE_API)
      return remote("customizations", {
        method: "PUT",
        body: JSON.stringify({ key, value }),
      });
  },
};
