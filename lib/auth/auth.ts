import { Adapter, AdapterSession } from "next-auth/adapters";
import { User, UserAttributes } from "@/models/user.model";
import { Account, AccountAttributes } from "@/models/account.model";
import { Session } from "@/models/session.model";
import { VerificationToken } from "@/models/verificationtoken.model";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import generateRandomHash from "@/lib/utils/numbers/HashPassword";

export function MySQLAdapter(): Adapter {
  return {
    async createUser(user: UserAttributes) {
      console.log("Creating new user", user);

      const modifiedUser = {
        name: user.name || null,
        email: user.email || null,
        image: user.image || null,
        hashedPassword: user.hashedPassword || (await generateRandomHash()),
        role: user.role || "USER",
      } as UserAttributes;

      return await User.create(modifiedUser);
    },

    async getUser(id) {
      return await User.findById(id);
    },

    async getUserByEmail(email) {
      return await User.findByEmail(email);
    },

    async getUserByAccount({ provider, providerAccountId }) {
      return await User.getUserByAccount({ provider, providerAccountId });
    },

    async updateUser(user) {
      return await User.updateUser(user as UserAttributes);
    },

    async deleteUser(userId) {
      await User.delete(userId);
    },

    async linkAccount(account: AccountAttributes) {
      console.log("Account to be linked " + account);

      const modifiedAccount = {
        userId: account.userId,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type,
        accessToken: account.accessToken ?? null,
        refreshToken: account.refreshToken ?? null,
        expiresAt: account.expiresAt ?? null,
        tokenType: account.tokenType ?? null,
        scope: account.scope ?? null,
        idToken: account.idToken ?? null,
        sessionState: account.sessionState ?? null,
      } as AccountAttributes;

      return await Account.create(modifiedAccount);
    },

    async unlinkAccount({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) {
      return await Account.unlink({ provider, providerAccountId });
    },

    async createSession(session): Promise<AdapterSession> {
      const result = await Session.create(session);
      if (result === null) {
        throw new Error("Failed to create session");
      }

      return result as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      const result = await Session.getSessionAndUser(sessionToken);
      return result;
    },

    async updateSession(session) {
      return await Session.update(session);
    },

    async deleteSession(sessionToken) {
      await Session.deleteSession(sessionToken);
    },

    async createVerificationToken(token) {
      return await VerificationToken.create(token);
    },

    async useVerificationToken({ identifier, token }) {
      return await VerificationToken.useVerificationToken({
        identifier,
        token,
      });
    },
  };
}

export const authOptions: AuthOptions = {
  adapter: MySQLAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // This allows the Google account to link to the existing email/password account
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await User.findByEmail(credentials.email);
        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
