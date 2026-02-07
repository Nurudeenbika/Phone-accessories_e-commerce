import { User } from "next-auth";

export interface ExtendedUser extends User {
  role: string; // Make role required
  id: string; // Make id required
}

export interface ExtendedSession {
  user: ExtendedUser;
  expires: string;
}
