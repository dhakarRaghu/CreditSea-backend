export enum Role {
    ADMIN = "admin",
    VERIFIER = "verifier",
    USER = "user",
  }
  
  export enum LoanStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    APPROVED = "approved",
    REJECTED = "rejected",
  }
  
  export interface User {
    id: string
    name: string
    email: string
    role: Role
  }
  
  export interface Loan {
    id: string
    userId: string
    customerName: string
    amount: number
    reason: string
    status: LoanStatus
    createdAt: string
    updatedAt: string
    verifiedBy?: string
    approvedBy?: string
    rejectedBy?: string
    rejectionReason?: string
  }
  
  export interface DashboardStats {
    activeUsers: number
    borrowers: number
    cashDisbursed: number
    cashReceived: number
    savings: number
    repaidLoans: number
    otherAccounts: number
    loans: number
  }
  
  