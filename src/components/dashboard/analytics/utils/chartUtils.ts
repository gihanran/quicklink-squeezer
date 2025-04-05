
export const COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#22C55E', '#0EA5E9', '#6366F1', '#A855F7'];

export const DEVICE_COLORS = {
  desktop: '#8B5CF6',
  mobile: '#EC4899',
  tablet: '#F97316'
};

export const BROWSER_COLORS = {
  chrome: '#22C55E',
  firefox: '#0EA5E9',
  safari: '#6366F1',
  other: '#A855F7'
};

// Generate chart configuration for charts
export const generateChartConfig = () => {
  return {
    devices: {
      desktop: { label: "Desktop", theme: { light: DEVICE_COLORS.desktop, dark: DEVICE_COLORS.desktop } },
      mobile: { label: "Mobile", theme: { light: DEVICE_COLORS.mobile, dark: DEVICE_COLORS.mobile } },
      tablet: { label: "Tablet", theme: { light: DEVICE_COLORS.tablet, dark: DEVICE_COLORS.tablet } },
    },
    browsers: {
      chrome: { label: "Chrome", theme: { light: BROWSER_COLORS.chrome, dark: BROWSER_COLORS.chrome } },
      firefox: { label: "Firefox", theme: { light: BROWSER_COLORS.firefox, dark: BROWSER_COLORS.firefox } },
      safari: { label: "Safari", theme: { light: BROWSER_COLORS.safari, dark: BROWSER_COLORS.safari } },
      other: { label: "Other", theme: { light: BROWSER_COLORS.other, dark: BROWSER_COLORS.other } },
    }
  };
};
