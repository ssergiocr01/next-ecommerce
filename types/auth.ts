// types/auth.ts
export type ActionResponse = 

  | { error: string; success?: never } 
  | { success: boolean; error?: never } 
  | null;
