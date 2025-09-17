import { useQuery } from "@tanstack/react-query";
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import api from "../../lib/api";

const ManagerStatistics = () => {
  // Fetch dashboard statistics
  const { data: statistics, isError, isLoading } = useQuery({
    queryKey: ["manager-statistics"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data;
    },

  });

  // Fetch monthly sales data
  const { data: monthlySales, isLoading: isLoadingSales } = useQuery({
    queryKey: ["monthly-sales"],
    queryFn: async () => {
      const res = await api.get("/dashboard/monthly-sales");
      return res.data;
    },
  });

  // Loading skeleton component
  const StatisticsSkeleton = () => (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <StatisticsSkeleton />;
  
  if (isError) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Statistics</h3>
          <p className="text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  const stats = statistics?.data || {};
  const { totalUsers = 0, totalTurfs = 0, totalRevenue = 0 } = stats;

  // Sample monthly sales data (replace with real data from API)
  const salesData = monthlySales?.data || [
    { day: '1', amount: 1200, bookings: 5 },
    { day: '2', amount: 1900, bookings: 8 },
    { day: '3', amount: 800, bookings: 3 },
    { day: '4', amount: 2400, bookings: 12 },
    { day: '5', amount: 1800, bookings: 7 },
    { day: '6', amount: 2200, bookings: 9 },
    { day: '7', amount: 1500, bookings: 6 },
    { day: '8', amount: 2800, bookings: 14 },
    { day: '9', amount: 2100, bookings: 10 },
    { day: '10', amount: 1700, bookings: 8 },
    { day: '11', amount: 2500, bookings: 11 },
    { day: '12', amount: 1400, bookings: 5 },
    { day: '13', amount: 2300, bookings: 13 },
    { day: '14', amount: 1900, bookings: 9 },
    { day: '15', amount: 2600, bookings: 12 },
    { day: '16', amount: 1600, bookings: 7 },
    { day: '17', amount: 2100, bookings: 10 },
    { day: '18', amount: 1800, bookings: 8 },
    { day: '19', amount: 2400, bookings: 11 },
    { day: '20', amount: 2000, bookings: 9 },
    { day: '21', amount: 2700, bookings: 13 },
    { day: '22', amount: 1500, bookings: 6 },
    { day: '23', amount: 2200, bookings: 10 },
    { day: '24', amount: 1900, bookings: 8 },
    { day: '25', amount: 2500, bookings: 12 },
    { day: '26', amount: 1700, bookings: 7 },
    { day: '27', amount: 2300, bookings: 11 },
    { day: '28', amount: 2100, bookings: 9 },
    { day: '29', amount: 2600, bookings: 14 },
    { day: '30', amount: 1800, bookings: 8 }
  ];

  // Calculate total monthly revenue
  const monthlyTotal = salesData.reduce((sum, day) => sum + day.amount, 0);
  const averageDaily = monthlyTotal / salesData.length;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const statisticsCards = [
    {
      title: "Total Users",
      value: formatNumber(totalUsers),
      subtitle: "Registered users",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Turfs",
      value: formatNumber(totalTurfs),
      subtitle: "Available venues",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtitle: "All time earnings",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200"
    }
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="my-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 text-sm">Overview of your platform's key metrics and performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statisticsCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-sm border ${card.borderColor} p-6 hover:shadow-md transform hover:scale-105 transition-all duration-300 group`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {card.title}
                </h3>
                <div className={`p-3 bg-gradient-to-br ${card.bgGradient} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  {card.icon}
                </div>
              </div>

              {/* Card Value */}
              <div className="mb-2">
                <span className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.value}
                </span>
              </div>

              {/* Card Subtitle */}
              <p className="text-sm text-gray-600 font-medium">
                {card.subtitle}
              </p>

              {/* Progress Bar Animation */}
              <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000 ease-in`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Last Month Sales</h3>
                  <p className="text-sm text-gray-600">Daily revenue breakdown for the past month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(monthlyTotal)}</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-80 w-full">
              {isLoadingSales ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading chart data...
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `৳${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        `৳${formatNumber(value)}`, 
                        name === 'amount' ? 'Revenue' : 'Bookings'
                      ]}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Chart Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(averageDaily)}</p>
                <p className="text-sm text-gray-600 mt-1">Avg Daily Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{salesData.length}</p>
                <p className="text-sm text-gray-600 mt-1">Active Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(...salesData.map(d => d.amount)) > Math.min(...salesData.map(d => d.amount)) 
                    ? `+${(((Math.max(...salesData.map(d => d.amount)) - Math.min(...salesData.map(d => d.amount))) / Math.min(...salesData.map(d => d.amount))) * 100).toFixed(0)}%`
                    : '0%'
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">Peak vs Low</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Quick Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Average Revenue per User</span>
                <span className="font-semibold text-gray-800">
                  {totalUsers > 0 ? formatCurrency(totalRevenue / totalUsers) : formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Turfs per User Ratio</span>
                <span className="font-semibold text-gray-800">
                  {totalUsers > 0 ? (totalTurfs / totalUsers).toFixed(1) : '0.0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Platform Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Action Items Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Action Items</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Monitor User Growth</p>
                  <p className="text-xs text-blue-600 mt-1">Keep track of new registrations and engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-emerald-800">Optimize Turf Listings</p>
                  <p className="text-xs text-emerald-600 mt-1">Ensure all turfs are properly maintained and listed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-amber-800">Revenue Analysis</p>
                  <p className="text-xs text-amber-600 mt-1">Review booking patterns and pricing strategies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerStatistics;