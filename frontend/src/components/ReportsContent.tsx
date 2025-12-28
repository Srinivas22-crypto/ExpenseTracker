import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { reportsService, ReportsData } from "@/services/reportsService";
import { format, parseISO, eachDayOfInterval, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, getMonth, getYear, isWithinInterval } from "date-fns";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

interface ChartDataPoint {
  label: string;
  income: number;
  expense: number;
}

// Custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ReportsContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange1, setSelectedRange1] = useState<TimeRange>("monthly");
  const [selectedRange2, setSelectedRange2] = useState<TimeRange>("monthly");
  
  // Cache for storing fetched data
  const cacheRef = useRef<Map<string, ReportsData>>(new Map());
  
  // State for chart data
  const [chartData1, setChartData1] = useState<ChartDataPoint[]>([]);
  const [chartData2, setChartData2] = useState<ChartDataPoint[]>([]);
  
  // Get current month and year for API calls
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Debounce selected ranges to prevent excessive API calls
  const debouncedRange1 = useDebounce(selectedRange1, 300);
  const debouncedRange2 = useDebounce(selectedRange2, 300);

  // Transform backend data to chart format
  // Defined before fetchReportsData to avoid initialization error
  const transformBackendData = useCallback((data: ReportsData, range: TimeRange): ChartDataPoint[] => {
    if (!data || !data.labels || data.labels.length === 0) {
      return [];
    }
    return data.labels.map((label, index) => ({
      label,
      income: data.income[index] || 0,
      expense: data.expense[index] || 0,
    }));
  }, []);

  // Fetch reports data with caching
  const fetchReportsData = useCallback(async (range: TimeRange, chartNumber: 1 | 2) => {
    const cacheKey = `${range}-${currentMonth}-${currentYear}`;
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      const cachedData = cacheRef.current.get(cacheKey)!;
      const transformedData = transformBackendData(cachedData, range);
      
      if (chartNumber === 1) {
        setChartData1(transformedData);
      } else {
        setChartData2(transformedData);
      }
      setLoading(false);
      return;
    }
    
    try {
      if (chartNumber === 1) {
        setLoading(true);
      }
      setError(null);
      
      const response = await reportsService.getReports(range, currentMonth, currentYear);
      
      if (response.success) {
        // Store in cache
        cacheRef.current.set(cacheKey, response.data);
        
        // Transform backend data to chart format
        const transformedData = transformBackendData(response.data, range);
        
        if (chartNumber === 1) {
          setChartData1(transformedData);
        } else {
          setChartData2(transformedData);
        }
      } else {
        setError(response.message || "Failed to load reports data");
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      setError(err.response?.data?.message || "Failed to load reports data");
    } finally {
      if (chartNumber === 1) {
        setLoading(false);
      }
    }
  }, [currentMonth, currentYear, transformBackendData]);

  // Fetch data when debounced ranges change (includes initial load)
  useEffect(() => {
    fetchReportsData(debouncedRange1, 1);
  }, [debouncedRange1, fetchReportsData]);

  useEffect(() => {
    fetchReportsData(debouncedRange2, 2);
  }, [debouncedRange2, fetchReportsData]);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="font-semibold">{payload[0]?.payload?.label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₹{entry.value.toLocaleString("en-IN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading && chartData1.length === 0 && chartData2.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </GlassCard>
          <GlassCard className="p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </GlassCard>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights</p>
        </div>
        <GlassCard className="p-6">
          <p className="text-destructive">Error: {error}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analytics and insights</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart 1: Income & Expenses - Line Chart */}
        <GlassCard className="p-6 relative hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Income & Expenses Trend
            </h2>
            <Select value={selectedRange1} onValueChange={(value) => setSelectedRange1(value as TimeRange)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartData1.length > 0 ? (
              <LineChart
                data={chartData1}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  angle={selectedRange1 === "monthly" || selectedRange1 === "daily" ? -45 : 0}
                  textAnchor={selectedRange1 === "monthly" || selectedRange1 === "daily" ? "end" : "middle"}
                  height={selectedRange1 === "monthly" || selectedRange1 === "daily" ? 60 : 30}
                  interval={selectedRange1 === "daily" ? "preserveStartEnd" : 0}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => 
                    value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Income"
                  animationDuration={500}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Expense"
                  animationDuration={500}
                />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available for the selected time range
              </div>
            )}
          </ResponsiveContainer>
        </GlassCard>

        {/* Chart 2: Income vs Expense Comparison - Bar Chart */}
        <GlassCard className="p-6 relative hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Income vs Expense Comparison</h2>
            <Select value={selectedRange2} onValueChange={(value) => setSelectedRange2(value as TimeRange)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartData2.length > 0 ? (
              <BarChart
                data={chartData2}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  angle={selectedRange2 === "monthly" || selectedRange2 === "daily" ? -45 : 0}
                  textAnchor={selectedRange2 === "monthly" || selectedRange2 === "daily" ? "end" : "middle"}
                  height={selectedRange2 === "monthly" || selectedRange2 === "daily" ? 60 : 30}
                  interval={selectedRange2 === "daily" ? "preserveStartEnd" : 0}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => 
                    value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#22c55e"
                  name="Income"
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
                <Bar
                  dataKey="expense"
                  fill="#f97316"
                  name="Expense"
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available for the selected time range
              </div>
            )}
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Empty State */}
      {chartData1.length === 0 && chartData2.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No data available for this period. Add some income and expenses to see your reports.
          </p>
        </GlassCard>
      )}

      {/* Summary Cards */}
      {chartData1.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-500">
              ₹
              {chartData1
                .reduce((sum, item) => sum + item.income, 0)
                .toLocaleString("en-IN")}
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-orange-500">
              ₹
              {chartData1
                .reduce((sum, item) => sum + item.expense, 0)
                .toLocaleString("en-IN")}
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
            <p
              className={`text-2xl font-bold ${
                chartData1.reduce((sum, item) => sum + item.income - item.expense, 0) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹
              {Math.abs(
                chartData1.reduce((sum, item) => sum + item.income - item.expense, 0)
              ).toLocaleString("en-IN")}
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
