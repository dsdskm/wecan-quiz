export interface Account {
  id: string;
  userId: string;
  username: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}