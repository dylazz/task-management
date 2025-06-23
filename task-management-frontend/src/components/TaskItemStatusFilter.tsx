// src/components/TaskStatusFilter.tsx
import { useState, useRef, useEffect } from 'react';
import { Status } from '../enums/Status';
import {getStatusLabel, getStatusOptions} from "../utils/statusUtils";

interface TaskStatusFilterProps {
  selectedStatus: Status | null;
  onStatusChange: (status: Status | null) => void;
}

/**
 * Component for filtering tasks by status
 *
 * Provides a dropdown menu to filter tasks by their status (All, Incomplete,
 * In Progress, Complete). Handles click-outside detection.
 */

export const TaskStatusFilter = ({ selectedStatus, onStatusChange }: TaskStatusFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Reference to detect clicks outside the component
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

  // Get status options from our utility function
  const statusOptions = getStatusOptions();

  return (
    <div className="relative" ref={menuRef}>
      {/* Status filter dropdown button */}
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

      {/* Dropdown menu  */}
      {isOpen && (
        <div 
          className="absolute mt-2 py-1 w-full sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          role="menu"
        >
          {/* Render status options */}
          {statusOptions.map((option) => (
              <button
                  key={option.label}
                  onClick={() => {
                    onStatusChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                      selectedStatus === option.value
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  role="option"
                  aria-selected={selectedStatus === option.value}
              >
                {option.label}
              </button>
          ))}
        </div>
      )}
    </div>
  );
};
