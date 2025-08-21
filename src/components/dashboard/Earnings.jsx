import React, { useState, useEffect } from 'react';
import recent from '../../assets/images/recent.png';
import searchIcon from '../../assets/images/searchicon.png';
import { API_BASE_URL } from '../../../env';

const Earnings = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch transactions from backend
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/transactions?page=${page}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.transactions);
        setTotalPages(data.pagination.pages);
        setCurrentPage(data.pagination.page);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/transactions/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.userPhone.includes(searchTerm) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchTransactions(page);
  };

  if (loading && !transactions.length) {
    return (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#6b7280'
        }}>
          Loading transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#ef4444'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Statistics Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {formatCurrency(stats.total.amount)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.total.transactions} transactions
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Today's Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {formatCurrency(stats.today.amount)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.today.transactions} transactions
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>This Week</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {formatCurrency(stats.week.amount)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.week.transactions} transactions
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>This Month</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              {formatCurrency(stats.month.amount)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.month.transactions} transactions
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <input
          type="text"
          placeholder="Search Transactions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '6px 16px 6px 60px', 
            borderRadius: '90px',
            width: '633px',height: '56px',
            fontSize: '14px',
            backgroundColor: '#fff',
            border: '1px solid rgb(255, 255, 255)',
            backgroundImage: `url(${searchIcon})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '24px center',
            backgroundSize: '20px'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>View by</span>
          <div style={{
            backgroundColor: '#fff',
            color: 'black',
            borderRadius: '8px',
            padding: '6px 0px',
            paddingLeft: '16px',
            fontSize: '13px',
            cursor: 'pointer',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Most Recent
            <img src={recent} alt="Recent" style={{ width: '56px', height: '56px', }} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Reference</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{
                  ...tdStyle,
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '40px 16px'
                }}>
                  {searchTerm ? 'No transactions found matching your search' : 'No transactions found'}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <tr key={transaction.id} style={{ 
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? 'rgba(18, 18, 18, 0.03)' : 'transparent'
                }}>
                  <td style={tdStyle}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {transaction.userName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {transaction.userEmail}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ 
                      fontWeight: '600',
                      color: transaction.amount >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                      {transaction.description}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {transaction.reference}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '2px 6px',
                      backgroundColor: transaction.type === 'credit' ? '#dcfce7' : '#fef3c7',
                      color: transaction.type === 'credit' ? '#166534' : '#92400e',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {transaction.type}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: getStatusColor(transaction.status) + '20',
                      color: getStatusColor(transaction.status),
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {transaction.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {formatDate(transaction.createdAt)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Previous
            </button>
            
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Earnings;

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px'
}; 