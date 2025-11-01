import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will be handled by the execution environment.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const invoiceSchema = {
  type: Type.OBJECT,
  properties: {
    invoiceNumber: {
      type: Type.STRING,
      description: "A unique identifier for the invoice (e.g., 'INV-001', '2024-07-A'). If not specified by the user, default to 'INV-001'."
    },
    clientName: {
      type: Type.STRING,
      description: "The full name of the client or company being invoiced."
    },
    description: {
      type: Type.STRING,
      description: "A detailed description of the service rendered or product sold."
    },
    amount: {
      type: Type.NUMBER,
      description: "The total numerical amount to be invoiced."
    },
    currency: {
      type: Type.STRING,
      description: "The three-letter currency code (e.g., USD, EUR, JPY)."
    },
    dueDate: {
      type: Type.STRING,
      description: "The invoice due date in YYYY-MM-DD format. If not specified by the user, calculate it as 30 days from today's date."
    }
  },
  required: ["invoiceNumber", "clientName", "description", "amount", "currency", "dueDate"]
};


export const generateInvoiceData = async (prompt: string): Promise<InvoiceData> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const systemInstruction = `You are an intelligent invoice-parsing assistant. Your task is to accurately extract invoice details from the user's text. Today's date is ${today}. Return the data in the specified JSON format. If a due date isn't mentioned, set it to 30 days from today. If an invoice number isn't mentioned, set it to 'INV-001'. Ensure the currency is a standard 3-letter code.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: invoiceSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation
    if (
      !parsedData.invoiceNumber ||
      !parsedData.clientName ||
      !parsedData.description ||
      typeof parsedData.amount !== 'number' ||
      !parsedData.currency ||
      !parsedData.dueDate
    ) {
      throw new Error("AI response is missing required fields.");
    }

    return parsedData as InvoiceData;
  } catch (error) {
    console.error("Error generating invoice data with Gemini API:", error);
    throw new Error("Failed to parse invoice details from your request. Please try again with a clearer description.");
  }
};