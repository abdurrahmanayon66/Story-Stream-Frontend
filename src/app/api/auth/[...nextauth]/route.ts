// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/utils/authConfig';

// Type augmentation (move this to a separate types file if preferred)
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    graphqlResult?: any;
  }
  
  interface User {
    accessToken?: string;
    refreshToken?: string;
    graphqlResult?: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    graphqlResult?: any;
  }
}

// Clean, simple route handler - no mutations or overrides
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };