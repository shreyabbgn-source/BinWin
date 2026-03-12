export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  points: number;
  totalRecycledWeight: number;
  level: number;
  badges: string[];
  role?: 'admin' | 'user';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Entertainment';
  imageUrl: string;
  expiryDate?: string;
}

export interface Bin {
  id: string;
  locationName: string;
  type: 'Plastic' | 'Glass' | 'Paper' | 'Metal' | 'General';
  status: 'Empty' | 'Half-Full' | 'Full';
  lastEmptied?: string;
  latitude: number;
  longitude: number;
}

export interface RecyclingHistory {
  id: string;
  userId: string;
  binId: string;
  weight: number;
  pointsEarned: number;
  timestamp: any;
  type: string;
}
