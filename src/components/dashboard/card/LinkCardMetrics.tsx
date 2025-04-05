
import React from 'react';
import { Smartphone, Globe, Clock } from "lucide-react";

interface LinkCardMetricsProps {
  link: any;
}

const LinkCardMetrics: React.FC<LinkCardMetricsProps> = ({ link }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="flex items-center">
        <Smartphone className="h-5 w-5 text-brand-purple mr-2" />
        <div>
          <p className="text-xs text-gray-500">Devices</p>
          <p className="text-sm">
            {link.devices ? (
              `Desktop: ${link.devices.desktop || 0}, Mobile: ${link.devices.mobile || 0}`
            ) : "No data yet"}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Globe className="h-5 w-5 text-brand-blue mr-2" />
        <div>
          <p className="text-xs text-gray-500">Top Locations</p>
          <p className="text-sm truncate">
            {link.locations ? (
              Object.entries(link.locations)
                .slice(0, 2)
                .map(([country, count]) => `${country}: ${count}`)
                .join(', ')
            ) : "No data yet"}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-green-500 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Created</p>
          <p className="text-sm">
            {new Date(link.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkCardMetrics;
