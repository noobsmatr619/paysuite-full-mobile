export type Customer = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  companyName?: string | null;
  address?: string | null;
  taxNo?: string | null;
  status: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  code?: string | null;
  description?: string | null;
};

export type Invoice = {
  id: string;
  invoiceFullNumber: string;
  status: string;
  grandTotal: number;
  receivedAmount: number;
  dueAmount?: number;
  issueDate?: string;
  dueDate?: string;
  customer?: Customer | null;
  customerId?: string;
};

export type Estimate = {
  id: string;
  estimateFullNumber: string;
  status: string;
  grandTotal: number;
  customer?: Customer | null;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  category?: { name: string } | null;
};

export type Ticket = {
  id: string;
  subject: string;
  status: string;
  department?: { name: string } | null;
  priority?: { name: string } | null;
};

export type Transaction = {
  id: string;
  amount: number;
  receivedOn: string;
  invoiceFullNumber?: string | null;
  customer?: Customer | null;
  paymentMethod?: { name: string } | null;
};

export type DashboardStats = {
  customerCount: number;
  productCount: number;
  invoiceCount: number;
  totalRevenue: number;
  totalPaid: number;
  totalDue: number;
  totalExpenses: number;
};

export type UserProfile = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  taxNo?: string | null;
  tenantId?: string | null;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  frequency: string;
  numberOfCustomers?: number;
  numberOfProducts?: number;
  numberOfInvoices?: number;
};

export type MyPlan = {
  subscriber: { plan: Plan } | null;
};

export type DocumentPayload = {
  fullNumber: string;
  html: string;
  pdfBase64: string | null;
};
