/**
 * @fileoverview Utility functions for interacting with localStorage.
 * These functions are client-side only and will not work in a server environment.
 */

"use client";

/**
 * Saves a value to localStorage.
 * @param key The key to save the value under.
 * @param value The value to save. It will be stringified.
 */
export function saveToStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
}

/**
 * Retrieves a value from localStorage.
 * @param key The key of the value to retrieve.
 * @returns The parsed value, or null if the key doesn't exist or an error occurs.
 */
export function getFromStorage(key: string): any {
  if (typeof window !== 'undefined') {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }
  return null;
}

/**
 * Removes a value from localStorage.
 * @param key The key of the value to remove.
 */
export function removeFromStorage(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }
}
