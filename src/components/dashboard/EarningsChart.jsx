import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../contexts/DataContext.jsx';

export const EarningsChart = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  
  const { fetchDashboardStats, fetchTransactions, loading: contextLoading, error: contextError } = useData();

  // Fetch dashboard stats from backend
  const fetchStats = async () => {
    try {
      setLocalLoading(true);
      const data = await fetchDashboardStats();
      
      if (data.success) {
        console.log('Fetched earnings stats:', data.stats);
        setStats(data.stats);
        
        // Process earnings stats for chart data
        if (data.stats.earnings) {
          const processedChartData = processEarningsForChart(data.stats.earnings);
          setChartData(processedChartData);
        }
      } else {
        setLocalError('Failed to fetch earnings stats');
      }
    } catch (err) {
      console.error('Error fetching earnings stats:', err);
      setLocalError('Failed to fetch earnings stats');
    } finally {
      setLocalLoading(false);
    }
  };

  // Process earnings stats into chart data
  const processEarningsForChart = (earnings) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Create chart data with the current month's earnings and weekly trends
    const chartData = monthNames.map((month, index) => {
      if (index === currentMonth) {
        return {
          month,
          totalEarnings: earnings.month || 0,
          weeklyEarnings: earnings.week || 0 // Weekly earnings for the second line
        };
      } else {
        // For other months, you could either show 0 or fetch historical data
        return {
          month,
          totalEarnings: 0,
          weeklyEarnings: 0
        };
      }
    });

    return chartData;
  };

  // Fetch transactions as fallback if earnings stats don't have enough data
  const fetchChartData = async () => {
    try {
      const data = await fetchTransactions(1, 1000);
      
      if (data.success && data.transactions && data.transactions.length > 0) {
        // Only use transaction data if we don't have earnings stats
        if (!stats?.earnings) {
          const monthlyData = processTransactionsForChart(data.transactions);
          setChartData(monthlyData);
        }
      }
    } catch (err) {
      console.error('Error fetching transaction data:', err);
      // Don't set error here as it's just fallback data
    }
  };

  // Process transactions into monthly chart data (fallback method)
  const processTransactionsForChart = (transactions) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = {};

    // Initialize all months
    monthNames.forEach(month => {
      monthlyStats[month] = {
        month,
        totalEarnings: 0,
        weeklyEarnings: 0
      };
    });

    // Process each transaction
    transactions.forEach(transaction => {
      if (transaction.status?.toLowerCase() === 'completed' && transaction.amount > 0) {
        const date = new Date(transaction.createdAt);
        const monthName = monthNames[date.getMonth()];
        
        if (monthlyStats[monthName]) {
          monthlyStats[monthName].totalEarnings += transaction.amount;
          
          // For weekly earnings, we'll use a portion of monthly earnings as fallback
          // This is just a fallback when we don't have actual weekly stats
          monthlyStats[monthName].weeklyEarnings = Math.floor(monthlyStats[monthName].totalEarnings * 0.25);
        }
      }
    });

    return Object.values(monthlyStats);
  };

  useEffect(() => {
    fetchStats();
    // Fetch chart data after a delay to allow stats to load first
    setTimeout(() => {
      fetchChartData();
    }, 1000);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate totals from chart data for the cards
  const totalEarnings = chartData.reduce((sum, month) => sum + (month.totalEarnings || 0), 0);
  const totalWeeklyEarnings = chartData.reduce((sum, month) => sum + (month.weeklyEarnings || 0), 0);

  const earningsData = [
    {
      label: 'Total Earnings', 
      value: localLoading ? 'Loading...' : localError ? 'Error' : formatCurrency(stats?.earnings?.total || totalEarnings),
      bgColor: '#FCE7F3',
      textColor: '#EC4899'
    },
    { 
      label: 'This Month', 
      value: localLoading ? 'Loading...' : localError ? 'Error' : formatCurrency(stats?.earnings?.month || 0),
      bgColor: '#D1FAE5',
      textColor: '#6EC531'
    },
    {
      label: 'This Week',
      value: localLoading ? 'Loading...' : localError ? 'Error' : formatCurrency(stats?.earnings?.week || 0),
      bgColor: '#FEF3C7',
      textColor: '#F59E0B'
    },
    {
      label: 'Today',
      value: localLoading ? 'Loading...' : localError ? 'Error' : formatCurrency(stats?.earnings?.today || 0),
      bgColor: '#E0E7FF',
      textColor: '#6366F1'
    }
  ];

  if (localLoading) {
    return (
      <div style={{ 
        backgroundColor: 'white',  
        padding: '24px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '647px',
        height: '420px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading earnings data...</div>
      </div>
    );
  }

  if (localError) {
    return (
      <div style={{ 
        backgroundColor: 'white',  
        padding: '24px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '647px',
        height: '420px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'red'
      }}>
        <div>Error: {localError}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'white',  
      padding: '24px', 
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      width: '647px',
      height: '420px',
      margin: '0 auto'
    }}>
      {/* Header with title and stats cards */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Earnings Overview
        </h3>

        {/* Horizontal stats cards */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          {earningsData.map(item => (
            <div 
              key={item.label} 
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: item.bgColor,
                textAlign: 'center',
                minWidth: '0' // Allow flex items to shrink
              }}
            >
              <div style={{ 
                fontSize: '11px', 
                color: '#6b7280', 
                marginBottom: '4px',
                fontWeight: '500'
              }}>{item.label}</div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#000000'
              }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div style={{ height: '280px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [
                formatCurrency(value), 
                name === 'totalEarnings' ? 'Total Earnings' : 'Weekly Earnings'
              ]}
              labelStyle={{ color: '#374151', fontWeight: '500' }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value) => value === 'totalEarnings' ? 'Total Earnings' : 'Weekly Earnings'}
            />
            <Line 
              type="monotone" 
              dataKey="totalEarnings" 
              stroke="#6EC531" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#6EC531', strokeWidth: 2 }}
              name="totalEarnings"
            />
            <Line 
              type="monotone" 
              dataKey="weeklyEarnings" 
              stroke="#ec066a" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#ec066a', strokeWidth: 2 }}
              name="weeklyEarnings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend below chart */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '3px',
            backgroundColor: '#6EC531',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
            Total Earnings (Monthly)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '3px',
            backgroundColor: '#ec066a',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
            Weekly Earnings
          </span>
        </div>
      </div>
    </div>
  )
}

export default EarningsChart