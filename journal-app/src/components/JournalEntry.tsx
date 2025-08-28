import React from 'react';
import type { JournalEntry } from '../types/entry';

interface Props {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const JournalEntryCard: React.FC<Props> = ({ entry, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {entry.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(entry.date).toLocaleString()}
      </p>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{entry.content}</p>
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => onEdit(entry)}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-red-600 dark:text-red-400 hover:underline font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JournalEntryCard;
