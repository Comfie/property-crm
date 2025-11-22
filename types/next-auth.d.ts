import type { DefaultSession } from 'next-auth';
import type { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accountType: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    accountType: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accountType: string;
    role: UserRole;
  }
}
