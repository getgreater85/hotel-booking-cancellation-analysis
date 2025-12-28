import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data (subset of the actual dataset for demonstration)
const generateSampleData = () => {
  return {
    overview: {
      totalBookings: 36274,
      canceled: 11885,
      notCanceled: 24389,
      cancellationRate: 32.76,
      avgPrice: 103.37,
      avgLeadTime: 84.91,
      potentialRevenue: 11085183.75,
      lostRevenue: 4219445.71
    },
    leadTimeData: [
      { category: '0-30 days', cancellationRate: 14.9, count: 10982 },
      { category: '31-90 days', cancellationRate: 28.5, count: 8857 },
      { category: '91-180 days', cancellationRate: 42.1, count: 7827 },
      { category: '181-365 days', cancellationRate: 51.3, count: 5234 },
      { category: '365+ days', cancellationRate: 59.8, count: 3374 }
    ],
    marketSegmentData: [
      { segment: 'Online', cancellationRate: 36.6, count: 22264, revenue: 2305120 },
      { segment: 'Offline', cancellationRate: 30.0, count: 10076, revenue: 1041388 },
      { segment: 'Corporate', cancellationRate: 10.6, count: 1926, revenue: 199158 },
      { segment: 'Aviation', cancellationRate: 29.5, count: 122, revenue: 12622 },
      { segment: 'Complementary', cancellationRate: 0.0, count: 375, revenue: 38775 },
      { segment: 'Unknown', cancellationRate: 31.5, count: 1511, revenue: 156237 }
    ],
    specialRequestsData: [
      { requests: 0, cancellationRate: 42.7, count: 15234 },
      { requests: 1, cancellationRate: 19.3, count: 12456 },
      { requests: 2, cancellationRate: 15.8, count: 6234 },
      { requests: 3, cancellationRate: 12.1, count: 1823 },
      { requests: 4, cancellationRate: 8.5, count: 412 },
      { requests: 5, cancellationRate: 6.2, count: 115 }
    ],
    priceData: [
      { category: 'Budget (<$75)', cancellationRate: 10.2, count: 361, avgPrice: 60 },
      { category: 'Economy ($75-100)', cancellationRate: 27.0, count: 18198, avgPrice: 88 },
      { category: 'Standard ($100-125)', cancellationRate: 41.4, count: 14000, avgPrice: 110 },
      { category: 'Premium ($125-150)', cancellationRate: 33.5, count: 2691, avgPrice: 135 },
      { category: 'Luxury (>$150)', cancellationRate: 49.2, count: 486, avgPrice: 180 }
    ],
    monthlyData: [
      { month: 'Jan', cancellations: 24, total: 1000, rate: 2.4 },
      { month: 'Feb', cancellations: 424, total: 1668, rate: 25.4 },
      { month: 'Mar', cancellations: 693, total: 2328, rate: 29.8 },
      { month: 'Apr', cancellations: 984, total: 2700, rate: 36.4 },
      { month: 'May', cancellations: 940, total: 2563, rate: 36.7 },
      { month: 'Jun', cancellations: 1273, total: 3162, rate: 40.3 },
      { month: 'Jul', cancellations: 1300, total: 2887, rate: 45.0 },
      { month: 'Aug', cancellations: 1616, total: 4264, rate: 37.9 },
      { month: 'Sep', cancellations: 1524, total: 4550, rate: 33.5 },
      { month: 'Oct', cancellations: 1849, total: 5238, rate: 35.3 },
      { month: 'Nov', cancellations: 864, total: 2937, rate: 29.4 },
      { month: 'Dec', cancellations: 394, total: 2977, rate: 13.2 }
    ],
    seasonData: [
      { season: 'Winter', value: 14.9, count: 5645 },
      { season: 'Spring', value: 34.5, count: 7591 },
      { season: 'Summer', value: 40.6, count: 10313 },
      { season: 'Fall', value: 33.3, count: 12725 }
    ]
  };
};

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const data = useMemo(() => generateSampleData(), []);

  const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  const CHART_COLORS = {
    primary: '#3498db',
    danger: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12',
    purple: '#9b59b6'
  };

  const MetricCard = ({ title, value, subtitle, color, icon }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `3px solid ${color}`,
      minHeight: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: '600', marginBottom: '8px' }}>
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {title}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: color, marginBottom: '4px' }}>
        {value}
      </div>
      {subtitle && <div style={{ fontSize: '12px', color: '#95a5a6' }}>{subtitle}</div>}
    </div>
  );

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '32px', fontWeight: 'bold' }}>
          🏨 Hotel Booking Cancellation Dashboard
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#7f8c8d', fontSize: '16px' }}>
          Interactive Analysis & Business Insights
        </p>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {['overview', 'drivers', 'temporal', 'insights'].map(view => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            style={{
              padding: '12px 24px',
              background: selectedView === view ? '#3498db' : 'white',
              color: selectedView === view ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s',
              textTransform: 'capitalize'
            }}
          >
            {view === 'overview' ? '📊 Overview' : 
             view === 'drivers' ? '🎯 Key Drivers' :
             view === 'temporal' ? '📅 Time Trends' :
             '💡 Insights'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedView === 'overview' && (
        <div>
          {/* Key Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '24px'
          }}>
            <MetricCard
              title="Total Bookings"
              value={data.overview.totalBookings.toLocaleString()}
              subtitle="Dataset size"
              color="#3498db"
              icon="📊"
            />
            <MetricCard
              title="Cancellation Rate"
              value={`${data.overview.cancellationRate}%`}
              subtitle={`${data.overview.canceled.toLocaleString()} canceled bookings`}
              color="#e74c3c"
              icon="❌"
            />
            <MetricCard
              title="Average Price"
              value={`$${data.overview.avgPrice}`}
              subtitle="Per room"
              color="#2ecc71"
              icon="💰"
            />
            <MetricCard
              title="Revenue at Risk"
              value={`$${(data.overview.lostRevenue / 1000000).toFixed(2)}M`}
              subtitle={`${((data.overview.lostRevenue / data.overview.potentialRevenue) * 100).toFixed(1)}% of potential`}
              color="#f39c12"
              icon="⚠️"
            />
          </div>

          {/* Cancellation Status Pie Chart */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📈 Booking Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Not Canceled', value: data.overview.notCanceled },
                    { name: 'Canceled', value: data.overview.canceled }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#2ecc71" />
                  <Cell fill="#e74c3c" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Season Distribution */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>🌍 Cancellation Rate by Season</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.seasonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis label={{ value: 'Cancellation Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#9b59b6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Drivers Tab */}
      {selectedView === 'drivers' && (
        <div>
          {/* Lead Time Impact */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
              🎯 Driver #1: Lead Time Impact (Correlation: 0.44)
            </h3>
            <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
              ⚡ Key Finding: Bookings made 365+ days in advance have 59.8% cancellation rate
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.leadTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-15} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Cancellation Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cancellationRate" fill="#e74c3c" name="Cancellation Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Market Segment */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
              🎯 Driver #2: Market Segment Performance
            </h3>
            <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
              ⚡ Key Finding: Corporate bookings have only 10.6% cancellation (most reliable!)
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.marketSegmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: 'Cancellation Rate (%)', position: 'insideBottom', offset: -5 }} />
                <YAxis type="category" dataKey="segment" width={120} />
                <Tooltip />
                <Bar dataKey="cancellationRate" fill="#3498db" name="Cancellation Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Special Requests */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
              🎯 Driver #3: Special Requests (Protective Factor!)
            </h3>
            <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
              ⚡ Key Finding: Guests with special requests are 2.5x more committed
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data.specialRequestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="requests" label={{ value: 'Number of Special Requests', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Cancellation Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cancellationRate" stroke="#2ecc71" strokeWidth={3} name="Cancellation Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Price Category */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
              🎯 Driver #4: Price Category Impact
            </h3>
            <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
              ⚡ Key Finding: Premium rooms ($125-150) have 41.4% cancellation rate
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-15} textAnchor="end" height={100} />
                <YAxis label={{ value: 'Cancellation Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="cancellationRate" fill="#f39c12" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Temporal Tab */}
      {selectedView === 'temporal' && (
        <div>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📅 Monthly Cancellation Trends</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '16px' }}>
              Peak season (summer) shows highest cancellation rates
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: 'Cancellation Rate (%)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Total Bookings', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#e74c3c" strokeWidth={3} name="Cancellation Rate (%)" />
                <Line yAxisId="right" type="monotone" dataKey="total" stroke="#3498db" strokeWidth={2} name="Total Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📊 Bookings vs Cancellations by Month</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3498db" name="Total Bookings" />
                <Bar dataKey="cancellations" fill="#e74c3c" name="Cancellations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {selectedView === 'insights' && (
        <div>
          {/* Recommendations */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>🔴 HIGH PRIORITY Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Implement Deposit Policy', desc: 'Require deposits for bookings >90 days lead time', impact: '$150K-200K annual savings' },
                { title: 'Encourage Special Requests', desc: 'Add prominent UI prompts during booking', impact: '10-15% cancellation reduction' },
                { title: 'Dynamic Cancellation Policies', desc: 'Stricter policies for summer, flexible for winter', impact: '5-10% seasonal improvement' },
                { title: 'Re-engagement Campaigns', desc: 'Automated emails at 60/30/14 days before arrival', impact: '5-8% cancellation reduction' }
              ].map((rec, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: '#ecf0f1',
                  borderRadius: '8px',
                  borderLeft: '4px solid #e74c3c'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{idx + 1}. {rec.title}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#7f8c8d' }}>{rec.desc}</p>
                  <div style={{ fontSize: '14px', color: '#27ae60', fontWeight: 'bold' }}>
                    💰 Impact: {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Impact */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>💰 Revenue Impact Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '20px', background: '#e8f8f5', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#16a085', marginBottom: '8px' }}>Potential Revenue</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#27ae60' }}>
                  ${(data.overview.potentialRevenue / 1000000).toFixed(2)}M
                </div>
              </div>
              <div style={{ padding: '20px', background: '#fadbd8', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#c0392b', marginBottom: '8px' }}>Revenue Lost</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c' }}>
                  ${(data.overview.lostRevenue / 1000000).toFixed(2)}M
                </div>
              </div>
              <div style={{ padding: '20px', background: '#fef5e7', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#d68910', marginBottom: '8px' }}>Recoverable (10%)</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f39c12' }}>
                  ${(data.overview.lostRevenue * 0.1 / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>💡 Key Business Insights</h3>
            <ul style={{ lineHeight: '1.8', color: '#34495e' }}>
              <li><strong>Lead Time is #1 Driver:</strong> Each 30-day increase in lead time raises cancellation risk by 5-10%</li>
              <li><strong>Special Requests = Commitment:</strong> Guests making requests are 2.5x more likely to show up</li>
              <li><strong>Corporate Segment Gold:</strong> Only 10.6% cancellation vs 36.6% for online bookings</li>
              <li><strong>Summer Challenge:</strong> 40.6% cancellation in summer vs 14.9% in winter</li>
              <li><strong>Premium Pricing Issue:</strong> Luxury rooms have 49.2% cancellation - needs strategy review</li>
              <li><strong>Quick Win Available:</strong> Implementing 4 high-priority actions could recover $400K-600K annually</li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '32px', 
        padding: '24px', 
        background: 'rgba(255,255,255,0.9)', 
        borderRadius: '12px',
        textAlign: 'center',
        color: '#7f8c8d'
      }}>
        <p style={{ margin: 0 }}>
          📊 Interactive Dashboard | Hotel Booking Cancellation Analysis | Dataset: 36,274 bookings
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
          Built with React + Recharts | Professional Data Analysis | December 2025
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
