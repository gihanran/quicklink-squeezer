
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COLORS } from '../utils/chartUtils';

interface LocationsChartProps {
  data: { name: string; value: number }[];
  horizontal?: boolean;
}

const LocationsChart: React.FC<LocationsChartProps> = ({ data, horizontal = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{horizontal ? "Geographic Distribution" : "Top Locations"}</CardTitle>
        <CardDescription>{horizontal ? "Click distribution by country" : "Geographic distribution of clicks"}</CardDescription>
      </CardHeader>
      <CardContent className={horizontal ? "h-96" : "h-80"}>
        <ResponsiveContainer width="100%" height="100%">
          {horizontal ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Clicks" fill="#8B5CF6">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Clicks" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LocationsChart;
