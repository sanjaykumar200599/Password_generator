// components/VaultItem.tsx

"use client";

import { useState } from 'react';
import { Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

// 1. Define the structure for the 'item' prop.
// This should match the type used in your dashboard page.
interface DecryptedVaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  tags: string[];
}

// 2. Define the props for the entire component.
interface VaultItemProps {
  item: DecryptedVaultItem;
  onEdit: () => void;
  onDelete: () => void;
}

// 3. Apply the props type to the function signature.
export default function VaultItemComponent({ item, onEdit, onDelete }: VaultItemProps) {
  const [copied, setCopied] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 15000);
    });
  };
  
  const handleDelete = async () => {
    // TypeScript now knows `item.title` and `item._id` are strings.
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const res = await fetch(`/api/vault/${item._id}`, { method: 'DELETE' });
        if (res.ok) {
          onDelete(); // TypeScript knows this is a function.
        } else {
          alert('Failed to delete item.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the item.');
      }
    }
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow border border-border">
      <div className="flex justify-between items-start">
        <div>
          {/* All 'item' properties are now type-safe */}
          <h4 className="font-bold text-lg">{item.title}</h4>
          <p className="text-sm text-muted-foreground">{item.username}</p>
          {item.url && <a href={item.url.startsWith('http') ? item.url : `//${item.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{item.url}</a>}
        </div>
        <div className="flex space-x-2 flex-shrink-0 ml-2">
          <button onClick={onEdit} className="p-1 text-muted-foreground hover:text-foreground"><Edit size={16} /></button>
          <button onClick={handleDelete} className="p-1 text-muted-foreground hover:text-red-500"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border">
        <div className="relative flex items-center justify-between">
            <input type={isPasswordVisible ? 'text' : 'password'} value={item.password} readOnly className="text-sm p-1 border-none rounded bg-transparent w-full" />
            <div className="flex items-center">
              <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="p-1 text-muted-foreground hover:text-foreground">
                {isPasswordVisible ? <EyeOff size={16}/> : <Eye size={16} />}
              </button>
              <button onClick={() => handleCopy(item.password)} className="ml-2 p-1 text-muted-foreground hover:text-foreground">
                {copied ? <span className="text-xs text-primary">Copied!</span> : <Copy size={16} />}
              </button>
            </div>
        </div>
        {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag, index) => <span key={index} className="px-2 py-1 text-xs bg-muted rounded-full">{tag}</span>)}
            </div>
        )}
      </div>
    </div>
  );
}