
export interface UrlUnlocker {
  id: string;
  userId: string;
  sequence: string[];
  destinationUrl: string;
  title?: string;
  clicks: number;
  unlocks: number;
  createdAt: number;
  updatedAt: number;
}

export type ButtonColor = 'red' | 'blue' | 'green' | 'yellow';
