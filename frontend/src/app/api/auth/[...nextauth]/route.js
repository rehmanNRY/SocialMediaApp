import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async signIn({ account }) {
			// Allow sign in; backend integration handled client-side after auth
			return true;
		},
		async jwt({ token, account, user }) {
			if (account && user) {
				if (account.provider === "google") {
					token.provider = "google";
					if (user.image) token.picture = user.image;
				}
				if (user.id) token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.provider) session.provider = token.provider;
			if (token?.picture) session.user.image = token.picture;
			if (token?.id) session.user.id = token.id;
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export const { GET, POST } = handlers;
