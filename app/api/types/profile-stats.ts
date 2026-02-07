export interface ProfileStats {
  account: {
    userId: string;
    email: string;
    role: string;
    createdAt: string;
    hasAvatar: boolean;
  };
  profile: {
    exists: boolean;
    completionPercent: number;
  };
  activity: {
    lastLogin: string | null;
  };
  stats: {
    favorites: number;
    orders: number;
    reviews: number;
  };
}
