
export interface DashboardStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  countriesData: CountryData[];
}

export interface CountryData {
  country: string;
  count: number;
}
