import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "github" || !profile) return false;

      const githubProfile = profile as unknown as {
        id: number;
        login: string;
        name: string;
        avatar_url: string;
        bio?: string;
      };

      const username = githubProfile.login;
      const githubId = String(githubProfile.id);

      await db.user.upsert({
        where: { githubId },
        create: {
          githubId,
          username,
          name: githubProfile.name ?? username,
          avatar: githubProfile.avatar_url,
          bio: githubProfile.bio ?? null,
        },
        update: {
          name: githubProfile.name ?? username,
          avatar: githubProfile.avatar_url,
          bio: githubProfile.bio ?? null,
        },
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const user = await db.user.findUnique({
          where: { githubId: token.sub },
          select: { id: true, username: true, avatar: true, isPublic: true },
        });
        if (user) {
          session.user.id = user.id;
          (session.user as typeof session.user & { username: string }).username =
            user.username;
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        token.sub = String((profile as unknown as { id: number }).id);
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
});
