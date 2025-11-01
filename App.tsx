import React from 'react';
import Header from './components/Header';
import InvoiceGenerator from './components/InvoiceGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <InvoiceGenerator />
      </main>
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} InvoicePro AI. Democratizing financial tools for everyone.</p>
      </footer>
    </div>
  );
}

export default App;