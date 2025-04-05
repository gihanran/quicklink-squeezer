
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineChartProps {
  data: { date: string; clicks: number }[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clicks Over Time</CardTitle>
        <CardDescription>Daily click trends for the past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 45 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#8B5CF6" 
              strokeWidth={2} 
              dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#8B5CF6' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;
