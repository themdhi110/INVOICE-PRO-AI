
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { InvoiceData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface InvoiceFormProps {
  initialData: InvoiceData;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    setInvoiceData(initialData);
  }, [initialData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const exportToPdf = () => {
    const doc = new jsPDF();

    // Add Logo
    if (logo) {
      doc.addImage(logo, 'PNG', 15, 15, 30, 30);
    }
    
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('INVOICE', 195, 25, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Company Name', 15, 60);
    doc.text('123 Your Street', 15, 65);
    doc.text('Your City, ST 12345', 15, 70);


    // Bill To
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 15, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.clientName, 15, 95);

    // Invoice Details
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #:', 140, 50);
    doc.text('Date:', 140, 55);
    doc.text('Due Date:', 140, 60);
    doc.setFont('helvetica', 'normal');
    doc.text('INV-001', 195, 50, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), 195, 55, { align: 'right' });
    doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), 195, 60, { align: 'right' });
    
    // Table Header
    doc.setDrawColor(200);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 110, 180, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 20, 116);
    doc.text('AMOUNT', 190, 116, { align: 'right' });
    
    // Table Body
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(invoiceData.description, 130);
    doc.text(splitDescription, 20, 126);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 190, 126, { align: 'right' });
    
    // Total
    const finalY = 200;
    doc.setDrawColor(0);
    doc.line(130, finalY - 5, 195, finalY - 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 130, finalY);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 195, finalY, { align: 'right' });

    // Footer/Notes
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 15, finalY + 20);

    doc.save(`Invoice-${invoiceData.clientName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">Generated Invoice</h3>
            <button
                onClick={exportToPdf}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Download PDF
            </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
          <input type="text" name="clientName" id="clientName" value={invoiceData.clientName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input type="date" name="dueDate" id="dueDate" value={invoiceData.dueDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" name="description" id="description" value={invoiceData.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" name="amount" id="amount" value={invoiceData.amount} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                <input type="text" name="currency" id="currency" value={invoiceData.currency} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
            </div>
        </div>
        <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Your Logo (Optional)</label>
            <input type="file" name="logo" id="logo" onChange={handleLogoUpload} accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
