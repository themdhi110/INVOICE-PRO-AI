export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string; // YYYY-MM-DD
}