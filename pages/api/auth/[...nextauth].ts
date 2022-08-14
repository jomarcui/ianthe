import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Sign in with Alcmene',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        mobileNumber: {
          label: 'Mobile Number',
          type: 'text',
          placeholder: '0XXX-XXX-XXXX',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const payload = {
          mobileNumber: credentials.mobileNumber,
          password: credentials.password,
        };

        const res = await fetch('https://alcmene.herokuapp.com/auth', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            // tenant: credentials.tenantKey,
            'Accept-Language': 'en-US',
          },
        });

        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.exception);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/signin',
  // },
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //     if (account && user) {
  //       return {
  //         ...token,
  //         accessToken: user.data.token,
  //         refreshToken: user.data.refreshToken,
  //       };
  //     }

  //     return token;
  //   },

  //   async session({ session, token }) {
  //     session.user.accessToken = token.accessToken;
  //     session.user.refreshToken = token.refreshToken;
  //     session.user.accessTokenExpires = token.accessTokenExpires;

  //     return session;
  //   },
  // },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
});
