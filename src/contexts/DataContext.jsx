import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../../env';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Universal fetch method with error handling
  const fetchData = async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching data';
      setError(errorMessage);
      console.error('Data fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Specific API methods
  const fetchDashboardStats = () => fetchData('/admin/dashboard/stats');
  const fetchUsers = (page = 1, limit = 1000) => fetchData(`/admin/users?page=${page}&limit=${limit}`);
  const fetchTransactions = (page = 1, limit = 1000) => fetchData(`/admin/transactions?page=${page}&limit=${limit}`);
  const fetchSubAdmins = () => fetchData('/admin/sub-admins');

  // Clear error
  const clearError = () => setError(null);

  const value = {
    loading,
    error,
    fetchData,
    fetchDashboardStats,
    fetchUsers,
    fetchTransactions,
    fetchSubAdmins,
    clearError,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
