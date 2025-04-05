
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { CountryData } from './types';

interface CountryChartProps {
  countriesData: CountryData[];
}

const CountryChart = ({ countriesData }: CountryChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Members by Country
        </CardTitle>
      </CardHeader>
      <CardContent>
        {countriesData.length > 0 ? (
          <div className="h-[300px]">
            <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
              <RechartsPrimitive.BarChart data={countriesData}>
                <RechartsPrimitive.XAxis dataKey="country" />
                <RechartsPrimitive.YAxis />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Bar dataKey="count" fill="#8884d8" />
              </RechartsPrimitive.BarChart>
            </RechartsPrimitive.ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-500 my-12">No country data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryChart;
