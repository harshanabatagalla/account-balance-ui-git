export interface AccountBalance {
  accountName: string;
  balance: number;
  month: string;
  formattedBalance: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  processedRecords: number;
}

export interface MonthlySummary {
  month: string;
  totalBalance: number;
  accountBalances: AccountBalance[];
}

export interface User {
  name?: string;
  email?: string;
  roles?: string[];
}