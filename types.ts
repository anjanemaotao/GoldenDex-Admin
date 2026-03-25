
export enum AdminRole {
  SUPER = 'SUPER',
  RISK = 'RISK',
  FINANCE = 'FINANCE',
  OPERATOR = 'OPERATOR'
}

export interface AdminUser {
  id: string;
  name: string;
  wallet: string;
  role: AdminRole;
  addedAt: string;
}

export interface UserAccount {
  uid: string;
  wallet: string;
  email: string;
  registeredAt: string;
  balance: number;
  lastLoginAt: string;
  lastIp: string;
  isFrozen: boolean;
}

export interface Position {
  id: string;
  userWallet: string;
  contract: string;
  direction: 'LONG' | 'SHORT';
  leverage: number;
  margin: number;
  pnl: number;
  roi: number;
  marginRate: number;
  status: 'NORMAL' | 'WARNING' | 'LIQUIDATING' | 'CLOSED';
  openedAt: string;
  closedAt?: string;
  closeType?: 'NORMAL' | 'FORCED';
}

export interface Alert {
  id: string;
  timestamp: string;
  contract: string;
  type: string;
  description: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  isRead: boolean;
}

export interface Wallet {
  id: string;
  name: string;
  address: string;
  privateKey: string;
  balance: number;
  remark: string;
  addedAt: string;
}
