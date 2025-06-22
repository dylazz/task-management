// src/components/TaskStatusFilter.tsx
import { useState, useRef, useEffect } from 'react';
import { Status } from '../enums/Status';
import { getStatusLabel } from "../utils/statusUtils";

interface TaskStatusFilterProps {
  selectedStatus: Status | null;
  onStatusChange: (status: Status | null) => void;
}

export const TaskStatusFilter = ({ selectedStatus, onStatusChange }: TaskStatusFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-between"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>Status: {selectedStatus === null ? 'All' : getStatusLabel(selectedStatus)}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute mt-2 py-1 w-full sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          role="menu"
        >
          <button
            onClick={() => {
              onStatusChange(null);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm ${
              selectedStatus === null
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            role="menuitem"
          >
            All
          </button>
          <button
            onClick={() => {
              onStatusChange(Status.Todo);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm ${
              selectedStatus === Status.Todo
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            role="menuitem"
          >
            {getStatusLabel(Status.Todo)}
          </button>
          <button
            onClick={() => {
              onStatusChange(Status.InProgress);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm ${
              selectedStatus === Status.InProgress
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            role="menuitem"
          >
            {getStatusLabel(Status.InProgress)}
          </button>
          <button
            onClick={() => {
              onStatusChange(Status.Done);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm ${
              selectedStatus === Status.Done
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            role="menuitem"
          >
            {getStatusLabel(Status.Done)}
          </button>
        </div>
      )}
    </div>
  );
};