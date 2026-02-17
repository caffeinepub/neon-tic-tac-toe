import { useState, useEffect } from 'react';

const USERNAME_STORAGE_KEY = 'tictactoe_username';

export function useUsername() {
  const [username, setUsername] = useState<string>('');

  // Load username from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (stored) {
      setUsername(stored);
    }
  }, []);

  const saveUsername = (newUsername: string) => {
    const trimmed = newUsername.trim();
    setUsername(trimmed);
    if (trimmed) {
      localStorage.setItem(USERNAME_STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(USERNAME_STORAGE_KEY);
    }
  };

  const isValid = (name: string): boolean => {
    return name.trim().length > 0 && name.trim().length <= 20;
  };

  return {
    username,
    saveUsername,
    isValid,
  };
}
