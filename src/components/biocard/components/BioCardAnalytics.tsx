
import React from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { BioCardLink } from '@/types/bioCardTypes';

interface BioCardAnalyticsProps {
  links: BioCardLink[];
}

const BioCardAnalytics: React.FC<BioCardAnalyticsProps> = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-3 border rounded-md p-3 bg-white">
      <h4 className="text-sm font-medium mb-2">Click Analytics</h4>
      <div className="h-64">
        <ChartContainer
          config={{
            views: { color: "#8B5CF6" },
            clicks: { color: "#F97316" }
          }}
        >
          <BarChart
            data={links.map(link => ({
              name: link.title,
              clicks: link.clicks || 0
            }))}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="clicks" fill="var(--color-clicks, #F97316)" name="Clicks" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BioCardAnalytics;
