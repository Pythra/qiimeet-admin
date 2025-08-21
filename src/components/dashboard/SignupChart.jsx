import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../contexts/DataContext.jsx';

const SignupChart = () => {
  const [signupData, setSignupData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [totalStats, setTotalStats] = useState({ male: 0, female: 0 });
  
  const { fetchUsers, loading: contextLoading, error: contextError } = useData();

  // Fetch user signup data from backend
  const fetchSignupData = async () => {
    try {
      setLocalLoading(true);
      const data = await fetchUsers(1, 1000);
      
      if (data.success && data.users) {
        console.log('Fetched user data:', data.users);
        const processedData = processUserDataForChart(data.users);
        setSignupData(processedData);
        
        // Calculate total stats
        const totals = processedData.reduce((acc, month) => {
          acc.male += month.male || 0;
          acc.female += month.female || 0;
          return acc;
        }, { male: 0, female: 0 });
        setTotalStats(totals);
      } else {
        setLocalError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setLocalError('Failed to fetch user data');
    } finally {
      setLocalLoading(false);
    }
  };

  // Process user data into monthly chart data
  const processUserDataForChart = (users) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = {};

    // Initialize all months
    monthNames.forEach(month => {
      monthlyStats[month] = {
        month,
        male: 0,
        female: 0
      };
    });

    // Process each user
    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthName = monthNames[date.getMonth()];
        
        if (monthlyStats[monthName]) {
          // Determine gender from user data (adjust field name as needed)
          const gender = user.gender?.toLowerCase() || user.sex?.toLowerCase() || 'unknown';
          
          if (gender === 'male' || gender === 'm') {
            monthlyStats[monthName].male += 1;
          } else if (gender === 'female' || gender === 'f') {
            monthlyStats[monthName].female += 1;
          }
        }
      }
    });

    return Object.values(monthlyStats);
  };

  useEffect(() => {
    fetchSignupData();
  }, []);

  if (localLoading) {
    return (
      <div style={{
        width: '100%',
        height: '420px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading signup data...</div>
      </div>
    );
  }

  if (localError) {
    return (
      <div style={{
        width: '100%',
        height: '420px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
      width: '100%',
      height: '420px',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Monthly Signups: Male vs Female
      </h2>
      
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={signupData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            label={{ value: 'Number of Signups', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value, name) => [value, name === 'male' ? 'Male' : 'Female']}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
            formatter={(value) => value === 'male' ? 'Male' : 'Female'}
          />
          <Bar 
            dataKey="male" 
            fill="#6EC531" 
            name="male"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="female" 
            fill="#EC4899" 
            name="female"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
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
            height: '16px',
            backgroundColor: '#6EC531',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
            Male Signups
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#EC4899',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
            Female Signups
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#6EC531',
            borderRadius: '4px',
            marginRight: '8px'
          }}></div>
          <span>Total Male: {totalStats.male}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#EC4899',
            borderRadius: '4px',
            marginRight: '8px'
          }}></div>
          <span>Total Female: {totalStats.female}</span>
        </div>
      </div>
    </div>
  );
};

export default SignupChart;
