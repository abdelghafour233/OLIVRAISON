import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} متجر النخبة. جميع الحقوق محفوظة.</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <a href="#" className="hover:text-white">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white">الشروط والأحكام</a>
            <a href="#" className="hover:text-white">اتصل بنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
};