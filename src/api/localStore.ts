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

function id() {
  return Math.random().toString(36).slice(2, 10);
}

const seedCustomers: Customer[] = [
  {
    id: "c1",
    firstName: "Amina",
    lastName: "Rahman",
    email: "amina@example.com",
    phoneNumber: "+8801700000001",
    companyName: "Rahman Trading",
    status: "active",
  },
  {
    id: "c2",
    firstName: "James",
    lastName: "Cole",
    email: "james@cole.io",
    companyName: "Cole Studio",
    status: "active",
  },
];

const seedProducts: Product[] = [
  { id: "p1", name: "Website design", price: 1200, code: "WEB-01" },
  { id: "p2", name: "Monthly retainer", price: 499, code: "RET-01" },
  { id: "p3", name: "Consulting hour", price: 85, code: "CON-01" },
];

let customers = [...seedCustomers];
let products = [...seedProducts];
let invoices: Invoice[] = [
  {
    id: "i1",
    invoiceFullNumber: "INV-00001",
    status: "due",
    grandTotal: 1200,
    receivedAmount: 0,
    dueAmount: 1200,
    customer: seedCustomers[0],
    customerId: "c1",
  },
  {
    id: "i2",
    invoiceFullNumber: "INV-00002",
    status: "partially_paid",
    grandTotal: 998,
    receivedAmount: 499,
    dueAmount: 499,
    customer: seedCustomers[1],
    customerId: "c2",
  },
];
let estimates: Estimate[] = [
  {
    id: "e1",
    estimateFullNumber: "EST-00001",
    status: "pending",
    grandTotal: 2400,
    customer: seedCustomers[0],
  },
];
let expenses: Expense[] = [
  {
    id: "x1",
    title: "Software subscription",
    amount: 49,
    date: new Date().toISOString(),
    category: { name: "Tools" },
  },
];
let tickets: Ticket[] = [
  {
    id: "t1",
    subject: "Need invoice PDF export",
    status: "open",
    department: { name: "Technical" },
    priority: { name: "Medium" },
  },
];
let transactions: Transaction[] = [
  {
    id: "tx1",
    amount: 499,
    receivedOn: new Date().toISOString(),
    invoiceFullNumber: "PAY-00001",
    customer: seedCustomers[1],
    paymentMethod: { name: "Stripe" },
  },
];

let currentUser: UserProfile | null = null;

export const localStore = {
  async login(email: string): Promise<UserProfile> {
    currentUser = {
      id: "local-user",
      email,
      firstName: "Demo",
      lastName: "Owner",
      companyName: "PaySuite Demo Co",
      phoneNumber: "+10000000000",
      tenantId: "local-tenant",
    };
    return currentUser;
  },

  logout() {
    currentUser = null;
  },

  async profile(): Promise<UserProfile> {
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser;
  },

  async stats(): Promise<DashboardStats> {
    const totalRevenue = invoices.reduce((s, i) => s + i.grandTotal, 0);
    const totalPaid = invoices.reduce((s, i) => s + i.receivedAmount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    return {
      customerCount: customers.length,
      productCount: products.length,
      invoiceCount: invoices.length,
      totalRevenue,
      totalPaid,
      totalDue: Math.max(0, totalRevenue - totalPaid),
      totalExpenses,
    };
  },

  async customers() {
    return customers;
  },

  async createCustomer(
    data: Omit<Customer, "id" | "status"> & { status?: string },
  ) {
    const row: Customer = {
      id: id(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      address: data.address,
      taxNo: data.taxNo,
      status: data.status || "active",
    };
    customers = [row, ...customers];
    return row;
  },

  async invoices() {
    return invoices;
  },

  async products() {
    return products;
  },

  async createProduct(data: Omit<Product, "id">) {
    const row: Product = { id: id(), ...data };
    products = [row, ...products];
    return row;
  },

  async estimates() {
    return estimates;
  },

  async expenses() {
    return expenses;
  },

  async tickets() {
    return tickets;
  },

  async transactions() {
    return transactions;
  },
};
