import React, { useState, useEffect } from 'react';
import type { JournalEntry } from '../types/entry';
import JournalEntryCard from '../components/JournalEntry';

const Home: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);



  useEffect(() => {
    const saved = localStorage.getItem('journalEntries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const addEntry = () => {
    if (!title.trim() || !content.trim()) return;

    if (editId) {
      // Update existing entry
      const updatedEntries = entries.map((entry) =>
        entry.id === editId
          ? { ...entry, title: title.trim(), content: content.trim(), date: new Date().toISOString() }
          : entry
      );
      setEntries(updatedEntries);
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      setEditId(null); // Reset edit mode
    } else {
      // Add new entry
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
      };
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem('journalEntries', JSON.stringify(updated));
    }

    setTitle('');
    setContent('');
  };

    const deleteEntry = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmed) return;

    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    };


  const startEditing = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditId(entry.id);
  };

  const filteredEntries = entries.filter((entry) =>
  entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl mx-auto bg-white p-6 shadow-md rounded-md flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6">My Journal</h1>
        <div className="flex items-center space-x-2 mb-4">
        <button
            onClick={() => setIsSearchOpen((open) => !open)}
            className="p-2 rounded hover:bg-gray-200 focus:outline-none"
            aria-label="Toggle search"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#123321"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="round"
            >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        </button>

        {isSearchOpen && (
            <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        )}
        </div>
        <button
        className="mt-6 bg-gray-800 text-black py-2 px-4 rounded hover:bg-gray-700 transition"
        onClick={() => setShowAllEntries(true)}
        >
        View All Entries
        </button>



        
        <input
          className="w-full border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your thoughts..."
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-black py-3 rounded font-semibold transition"
          onClick={addEntry}
        >
          {editId ? 'Update Entry' : 'Add Entry'}
        </button>

        <div className="mt-8 space-y-4">
          {filteredEntries.length === 0 ? (
        <p className="text-gray-500 text-center">No entries found.</p>
        ) : (
        filteredEntries.map((entry) => (
            <JournalEntryCard
        key={entry.id}
        entry={entry}
        onEdit={startEditing}
        onDelete={deleteEntry}
        />
        ))
        )}
        </div>

        {showAllEntries && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold">All Entries</h2>
                
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button
              onClick={() => setShowAllEntries(false)}
              className="p-2 hover:bg-gray-200 rounded focus:outline-none"
              aria-label="Close all entries view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600 hover:text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>


            {filteredEntries.length === 0 ? (
            <p className="text-gray-500 text-center">No entries found.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={startEditing}
                    onDelete={deleteEntry}
                />
                ))}
            </div>
            )}
        </div>
        )}

      </div>
    </div>
  );
};

export default Home;
