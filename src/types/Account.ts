// src/types/Account.ts

export type AuthToken = string;

export interface Account {
  id: number;
  userId: string;
  username: string; // Consider renaming this if userId is also the username
  token?: string; // Add an optional token property
}

export interface UserCredentials {
  userId: string;
  password: string;
}