import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CPIData {
  month: string;
  value: number;
}

export const CPIChart = () => {
  const [data, setData] = useState<CPIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCPIData();
  }, []);

  const fetchCPIData = async () => {
    try {
      const response = await fetch('https://px.hagstofa.is:443/pxis/sq/ae5adc9f-a822-4cb6-964b-f98804aebd5f');
      const text = await response.text();
      
      // Parse the CSV-like data
      const lines = text.split('\n');
      const parsedData: CPIData[] = [];
      
      // Skip header and parse data lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          // Handle different possible delimiters
          const parts = line.split(/[,;\t]/);
          if (parts.length >= 2) {
            const month = parts[0].replace(/"/g, '');
            const value = parseFloat(parts[1].replace(/"/g, '').replace(',', '.'));
            
            if (!isNaN(value)) {
              parsedData.push({ month, value });
            }
          }
        }
      }
      
      setData(parsedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      
      // Use sample data as fallback
      setData(sampleData);
    }
  };

  // Sample data based on the analysis
  const sampleData: CPIData[] = [
    { month: '1988M05', value: 100.0 },
    { month: '1989M05', value: 122.3 },
    { month: '1990M05', value: 131.2 },
    { month: '1991M05', value: 139.8 },
    { month: '1992M05', value: 145.3 },
    { month: '1993M05', value: 151.2 },
    { month: '1994M05', value: 153.6 },
    { month: '1995M05', value: 156.8 },
    { month: '1996M05', value: 160.1 },
    { month: '1997M05', value: 162.7 },
    { month: '1998M05', value: 165.5 },
    { month: '1999M05', value: 170.8 },
    { month: '2000M05', value: 178.4 },
    { month: '2001M05', value: 189.6 },
    { month: '2002M05', value: 198.2 },
    { month: '2003M05', value: 202.1 },
    { month: '2004M05', value: 208.7 },
    { month: '2005M05', value: 217.3 },
    { month: '2006M05', value: 232.4 },
    { month: '2007M05', value: 243.9 },
    { month: '2008M05', value: 272.5 },
    { month: '2009M05', value: 305.8 },
    { month: '2010M05', value: 321.3 },
    { month: '2011M05', value: 334.8 },
    { month: '2012M05', value: 352.7 },
    { month: '2013M05', value: 367.4 },
    { month: '2014M05', value: 375.2 },
    { month: '2015M05', value: 381.3 },
    { month: '2016M05', value: 387.4 },
    { month: '2017M05', value: 395.1 },
    { month: '2018M05', value: 404.8 },
    { month: '2019M05', value: 418.7 },
    { month: '2020M05', value: 431.5 },
    { month: '2021M05', value: 448.2 },
    { month: '2022M05', value: 487.6 },
    { month: '2023M05', value: 538.9 },
    { month: '2024M05', value: 587.3 },
    { month: '2025M05', value: 651.0 }
  ];

  const formatXAxis = (tickItem: string) => {
    // Convert YYYYMM to YYYY
    return tickItem.substring(0, 4);
  };

  const formatTooltipLabel = (value: string) => {
    // Convert YYYYMM to Month Year
    const year = value.substring(0, 4);
    const month = value.substring(5, 7);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Vísitala neysluverðs (Consumer Price Index) - Iceland
      </h2>
      
      {error && (
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '10px' }}>
          {error} - Using sample data
        </p>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data.length > 0 ? data : sampleData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={formatXAxis}
            interval={Math.floor((data.length > 0 ? data.length : sampleData.length) / 10)}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={formatTooltipLabel}
            formatter={(value: number) => value.toFixed(1)}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            name="CPI Value"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '40px' }}>
        <h3>Data Table</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', position: 'sticky', top: 0 }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                  Month
                </th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>
                  CPI Value
                </th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>
                  Year-over-Year Change (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {(data.length > 0 ? data : sampleData).map((item, index) => {
                const previousYearIndex = index - 12;
                const yoyChange = previousYearIndex >= 0 
                  ? ((item.value - (data.length > 0 ? data : sampleData)[previousYearIndex].value) / 
                     (data.length > 0 ? data : sampleData)[previousYearIndex].value * 100)
                  : null;

                return (
                  <tr key={item.month} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px' }}>{formatTooltipLabel(item.month)}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{item.value.toFixed(1)}</td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'right',
                      color: yoyChange && yoyChange > 5 ? '#ef4444' : '#10b981'
                    }}>
                      {yoyChange !== null ? `${yoyChange.toFixed(1)}%` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};