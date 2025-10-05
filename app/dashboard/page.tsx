'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { decryptData } from '@/lib/crypto';
import Navbar from '@/components/Navbar';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultItemComponent from '@/components/VaultItem';
import AddEditVaultItemModal from '@/components/AddEditVaultItemModal';

interface DecryptedVaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  tags: string[];
}

interface EncryptedVaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { encryptionKey, isAuthenticated } = useAuth();
  const [items, setItems] = useState<EncryptedVaultItem[]>([]);
  const [decryptedItems, setDecryptedItems] = useState<DecryptedVaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DecryptedVaultItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/vault');
      if (res.ok) {
        const data: EncryptedVaultItem[] = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [isAuthenticated]);

  useEffect(() => {
    if (items.length > 0 && encryptionKey) {
      const decrypted: DecryptedVaultItem[] = items.map(item => {
        try {
          const decryptedTags = item.tags.map(tag => decryptData(tag, encryptionKey));
          return {
            _id: item._id,
            title: decryptData(item.title, encryptionKey),
            username: decryptData(item.username, encryptionKey),
            password: decryptData(item.password, encryptionKey),
            url: decryptData(item.url, encryptionKey),
            notes: decryptData(item.notes, encryptionKey),
            tags: decryptedTags,
          };
        } catch (e) {
          console.error("Failed to decrypt item:", item._id, e);
          return null;
        }
      }).filter((item): item is DecryptedVaultItem => item !== null);
      setDecryptedItems(decrypted);
    } else {
      setDecryptedItems([]);
    }
  }, [items, encryptionKey]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return decryptedItems;
    const lower = searchTerm.toLowerCase();
    return decryptedItems.filter(item =>
      item.title.toLowerCase().includes(lower) ||
      item.username.toLowerCase().includes(lower) ||
      item.url.toLowerCase().includes(lower) ||
      item.tags.some(tag => tag.toLowerCase().includes(lower))
    );
  }, [searchTerm, decryptedItems]);

  const handleExport = () => {
    const dataStr = JSON.stringify({ vaultData: items }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `secure-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const { vaultData } = JSON.parse(content);
        if (!Array.isArray(vaultData)) throw new Error("Invalid file format");
        const res = await fetch('/api/vault/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: vaultData }),
        });
        if (res.ok) {
          alert("Import successful!");
          fetchItems();
        } else {
          const error = await res.json();
          alert(`Import failed: ${error.message}`);
        }
      } catch (err) {
        alert("Failed to read or parse import file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (!isAuthenticated) return <div>Loading session...</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <PasswordGenerator />
            <div className="p-4 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-white">Manage Vault</h3>
              <div className="space-y-2">
                <button
                  onClick={handleExport}
                  className="w-full py-2 border rounded-lg text-white hover:bg-gray-800 transition-colors"
                >
                  Export Encrypted Vault
                </button>
                <label className="w-full block text-center py-2 border rounded-lg text-white hover:bg-gray-800 cursor-pointer transition-colors">
                  Import Encrypted Vault
                  <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <input
                type="text"
                placeholder="Search by title, username, url, or tag..."
                className="p-3 border rounded-lg w-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => { setCurrentItem(null); setIsModalOpen(true); }}
                className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-400 py-10">Loading vault items...</p>
              ) : filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <VaultItemComponent
                    key={item._id}
                    item={item}
                    onEdit={() => { setCurrentItem(item); setIsModalOpen(true); }}
                    onDelete={fetchItems}
                  />
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-xl border-gray-700">
                  <p className="text-gray-400">Your vault is empty.</p>
                  <p className="text-sm text-gray-500">Click "+ Add Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <AddEditVaultItemModal
            item={currentItem}
            onClose={() => setIsModalOpen(false)}
            onSave={fetchItems}
          />
        )}
      </div>
    </>
  );
}
