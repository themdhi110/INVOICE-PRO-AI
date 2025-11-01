import React, { useState, useCallback } from 'react';
import { generateInvoiceData } from '../services/geminiService';
import { InvoiceData } from '../types';
import InvoiceForm from './InvoiceForm';
import { SparklesIcon } from './icons/SparklesIcon';

const InvoiceGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your invoice.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedInvoice(null);

    try {
      const data = await generateInvoiceData(prompt);
      setGeneratedInvoice(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleGenerate();
    }
  };

  const examplePrompts = [
    "Invoice INV-2024-01 for $1500 to Acme Corp for web development services, due in 15 days.",
    "Bill John Doe 300 EUR for a logo design project.",
    "Create an invoice for Smith & Co. for 2500 GBP for consulting work delivered today.",
  ];

  const handleExampleClick = (example: string) => {
      setPrompt(example);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Invoice with AI</h2>
        <p className="text-gray-600 mb-4">
          Simply describe the invoice you want to create. Our AI will handle the rest.
        </p>
        
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g., "Invoice for 300 USD for web design to John Doe"'
            className="w-full h-28 p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            disabled={isLoading}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
            Or try an example:
            <div className="flex flex-wrap gap-2 mt-1">
                {examplePrompts.map((ex, index) => (
                    <button key={index} onClick={() => handleExampleClick(ex)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1 transition-colors">
                        {ex}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 mb-2 sm:mb-0">
            Press <kbd className="font-sans font-semibold">Ctrl</kbd> + <kbd className="font-sans font-semibold">Enter</kbd> to generate.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate Invoice
              </>
            )}
          </button>
        </div>

        {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p><strong>Error:</strong> {error}</p>
            </div>
        )}
      </div>

      {generatedInvoice && (
        <div className="mt-8">
            <InvoiceForm initialData={generatedInvoice} />
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;