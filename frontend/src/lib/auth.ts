import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { db } from '@/lib/db';
import { user } from '@/lib/db-config';
import { eq } from 'drizzle-orm';

export const authOptions: Parameters<typeof NextAuth>[0] = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@ejemplo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) return null;

        const foundUsers = await db
          .select()
          .from(user)
          .where(eq(user.email, email));

        const foundUser = foundUsers[0];

        if (!foundUser || foundUser.password !== password) {
          return null;
        }

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          nombre_usuario: foundUser.nombre_usuario, // añadido aquí
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'mi-super-secreto',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔥 jwt callback - user:", user);
        token.id = user.id;
        token.email = user.email;
        token.nombre_usuario = (user as any).nombre_usuario;
      }
      console.log("🧠 jwt callback - token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("🧠 session callback - token:", token);
      if (token?.id) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).nombre_usuario = token.nombre_usuario;
      }
      console.log("✅ Final session.user:", session.user);
      return session;
    },
  }
  ,
};
