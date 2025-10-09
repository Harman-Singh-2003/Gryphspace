"use client";
// Mobile drawer for filters - non-modal side sheet
// Only shown on mobile (< lg breakpoint)
import React, { useEffect } from 'react';

interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileFiltersDrawer({ isOpen, onClose, children }: MobileFiltersDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-900 border-l border-gray-800 z-50 lg:hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <h2 id="mobile-filters-title" className="text-lg font-semibold text-slate-200">
            Filters & Controls
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}

