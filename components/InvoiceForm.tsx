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
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimalist' | 'corporate' | 'simple'>('classic');
  const [accentColor, setAccentColor] = useState<string>('#3b82f6');

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

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }; // Return black on failure
  };

  const renderClassicPdf = (doc: jsPDF, { invoiceData, logo, accentColor }: { invoiceData: InvoiceData, logo: string | null, accentColor: string }) => {
    const color = hexToRgb(accentColor);
    
    if (logo) doc.addImage(logo, 'PNG', 15, 15, 30, 30);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(color.r, color.g, color.b);
    doc.text('INVOICE', 195, 25, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Company Name', 15, 60);
    doc.text('123 Your Street', 15, 65);
    doc.text('Your City, ST 12345', 15, 70);

    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 15, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.clientName, 15, 95);

    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #:', 140, 50);
    doc.text('Date:', 140, 55);
    doc.text('Due Date:', 140, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceNumber, 195, 50, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), 195, 55, { align: 'right' });
    doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), 195, 60, { align: 'right' });
    
    doc.setDrawColor(200);
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(15, 110, 180, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DESCRIPTION', 20, 116);
    doc.text('AMOUNT', 190, 116, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(invoiceData.description, 130);
    doc.text(splitDescription, 20, 126);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 190, 126, { align: 'right' });
    
    const finalY = 200;
    doc.setDrawColor(0);
    doc.line(130, finalY - 5, 195, finalY - 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 130, finalY);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 195, finalY, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 15, finalY + 20);
  };

  const renderModernPdf = (doc: jsPDF, { invoiceData, logo, accentColor }: { invoiceData: InvoiceData, logo: string | null, accentColor: string }) => {
    const color = hexToRgb(accentColor);

    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE', 15, 25);
    
    doc.setTextColor(0,0,0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if(logo) doc.addImage(logo, 'PNG', 165, 10, 30, 30);
    
    doc.text('Your Company Name', 15, 55);
    doc.text('123 Your Street', 15, 60);
    
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 15, 75);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 80);
    doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`, 15, 85);
    
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 140, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.clientName, 140, 60);

    doc.setDrawColor(200);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 100, 180, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 20, 106);
    doc.text('AMOUNT', 190, 106, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(invoiceData.description, 130);
    const descriptionY = 116;
    doc.text(splitDescription, 20, descriptionY);
    const descriptionHeight = doc.getTextDimensions(splitDescription).h;
    
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 190, descriptionY, { align: 'right' });
    
    const finalY = descriptionY + descriptionHeight + 20;
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.5);
    doc.line(130, finalY, 195, finalY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TOTAL:', 130, finalY + 6);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 195, finalY + 6, { align: 'right' });
  };
  
  const renderMinimalistPdf = (doc: jsPDF, { invoiceData, logo, accentColor }: { invoiceData: InvoiceData, logo: string | null, accentColor: string }) => {
    const color = hexToRgb(accentColor);
    
    if(logo) doc.addImage(logo, 'PNG', 15, 15, 20, 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(color.r, color.g, color.b);
    doc.text('INVOICE', 195, 25, { align: 'right' });

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const startY = 60;
    doc.text('Your Company', 15, startY);
    doc.text('123 Your Street', 15, startY + 5);

    doc.text(invoiceData.clientName, 80, startY);
    doc.text('Bill To', 80, startY - 5);


    doc.text(invoiceData.invoiceNumber, 195, startY, { align: 'right' });
    doc.text('Invoice #', 195, startY - 5, { align: 'right' });

    doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), 195, startY + 15, { align: 'right' });
    doc.text('Due Date', 195, startY + 10, { align: 'right' });
    
    const tableY = startY + 40;
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 15, tableY);
    doc.text('AMOUNT', 195, tableY, { align: 'right' });
    
    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.5);
    doc.line(15, tableY + 3, 195, tableY + 3);
    
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(invoiceData.description, 130);
    doc.text(splitDescription, 15, tableY + 10);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 195, tableY + 10, { align: 'right' });

    const finalY = 200;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, finalY, 195, finalY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total', 15, finalY + 8);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 195, finalY + 8, { align: 'right' });
  };
  
  const renderCorporatePdf = (doc: jsPDF, { invoiceData, logo, accentColor }: { invoiceData: InvoiceData, logo: string | null, accentColor: string }) => {
    const color = hexToRgb(accentColor);
    
    if (logo) doc.addImage(logo, 'PNG', 15, 15, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Your Company Name', 15, 50);
    doc.text('123 Your Street, Your City', 15, 55);

    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(130, 15, 65, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE', 195, 24, { align: 'right' });

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 15, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.clientName, 15, 80);

    const detailsX = 140;
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #:', detailsX, 50);
    doc.text('Date:', detailsX, 55);
    doc.text('Due Date:', detailsX, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceNumber, 195, 50, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), 195, 55, { align: 'right' });
    doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), 195, 60, { align: 'right' });

    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(15, 100, 180, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DESCRIPTION', 20, 106);
    doc.text('AMOUNT', 190, 106, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(invoiceData.description, 130);
    doc.rect(15, 110, 180, 20 + doc.getTextDimensions(splitDescription).h, 'S');
    doc.text(splitDescription, 20, 118);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 190, 118, { align: 'right' });

    const finalY = 200;
    doc.setFillColor(240, 240, 240);
    doc.rect(120, finalY - 10, 75, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 125, finalY);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 195, finalY, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Payment is due within 30 days. Thank you for your business.', 105, 280, { align: 'center' });
  };

  const renderSimplePdf = (doc: jsPDF, { invoiceData, logo, accentColor }: { invoiceData: InvoiceData, logo: string | null, accentColor: string }) => {
    const color = hexToRgb(accentColor);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Your Company Name', 20, 20);
    if(logo) doc.addImage(logo, 'PNG', 170, 15, 20, 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(color.r, color.g, color.b);
    doc.text('Invoice', 20, 40);

    doc.setTextColor(0,0,0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed to', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.clientName, 20, 66);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Number', 120, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceNumber, 120, 66);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date of Issue', 120, 76);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString(), 120, 82);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Due Date', 120, 92);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), 120, 98);

    doc.setDrawColor(color.r, color.g, color.b);
    doc.setLineWidth(0.5);
    doc.line(20, 120, 190, 120);

    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, 128);
    doc.text('Amount', 190, 128, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(invoiceData.description, 120);
    doc.text(splitDescription, 20, 136);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 190, 136, { align: 'right' });

    doc.line(20, 190, 190, 190);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Total:', 140, 200, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color.r, color.g, color.b);
    doc.text(`${invoiceData.amount.toFixed(2)} ${invoiceData.currency}`, 190, 200, { align: 'right' });
  };


  const exportToPdf = () => {
    const doc = new jsPDF();
    const data = { invoiceData, logo, accentColor };
    
    switch (template) {
        case 'modern':
            renderModernPdf(doc, data);
            break;
        case 'minimalist':
            renderMinimalistPdf(doc, data);
            break;
        case 'corporate':
            renderCorporatePdf(doc, data);
            break;
        case 'simple':
            renderSimplePdf(doc, data);
            break;
        case 'classic':
        default:
            renderClassicPdf(doc, data);
            break;
    }
    
    doc.save(`Invoice-${invoiceData.clientName.replace(/\s/g, '_')}.pdf`);
  };

  const templates: Array<{ id: 'classic' | 'modern' | 'minimalist' | 'corporate' | 'simple'; name: string }> = [
      { id: 'classic', name: 'Classic' },
      { id: 'modern', name: 'Modern' },
      { id: 'minimalist', name: 'Minimalist' },
      { id: 'corporate', name: 'Corporate' },
      { id: 'simple', name: 'Simple' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md animate-fade-in transition-colors">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Generated Invoice</h3>
            <button
                onClick={exportToPdf}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Download PDF
            </button>
        </div>

        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
             <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Customize</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Template</label>
                    <div className="flex flex-wrap gap-2">
                        {templates.map(({id, name}) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setTemplate(id)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                    template === id
                                        ? 'bg-primary-600 text-white shadow'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                }`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Accent Color</label>
                    <div className="mt-2 relative flex items-center h-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                        <input
                            type="text"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-full pl-3 pr-12 h-full rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-0 bg-transparent dark:text-white"
                            placeholder="#3b82f6"
                        />
                         <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="absolute right-0 top-0 h-full w-10 p-1 border-none cursor-pointer rounded-r-md bg-transparent"
                            style={{ backgroundColor: accentColor }}
                            aria-label="Color picker"
                        />
                    </div>
                </div>
             </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Client Name</label>
          <input type="text" name="clientName" id="clientName" value={invoiceData.clientName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"/>
        </div>
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Invoice Number</label>
          <input type="text" name="invoiceNumber" id="invoiceNumber" value={invoiceData.invoiceNumber || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
          <input type="text" name="description" id="description" value={invoiceData.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"/>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Amount</label>
                <input type="number" name="amount" id="amount" value={invoiceData.amount} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"/>
            </div>
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Currency</label>
                <input type="text" name="currency" id="currency" value={invoiceData.currency} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"/>
            </div>
        </div>
         <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Due Date</label>
          <input type="date" name="dueDate" id="dueDate" value={invoiceData.dueDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"/>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Your Logo (Optional)</label>
            <input type="file" name="logo" id="logo" onChange={handleLogoUpload} accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:dark:bg-primary-900/50 file:dark:text-primary-300 hover:file:dark:bg-primary-900/70"/>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;