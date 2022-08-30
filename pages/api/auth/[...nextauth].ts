import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_HOST}/refresh`;
    const response = await fetch(url);
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresAt * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token || user.accessToken,
          accessTokenExpires:
            Date.now() + (account.expires_at || 24 * 60 * 60 * 1000) * 1000,
          refreshToken: account.refresh_token || user.refreshToken,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.user = token.user;

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      async authorize({ mobileNumber, password }) {
        await dbConnect();

        const user = await User.findOne({ mobileNumber });

        const isPasswordsMatch = await bcrypt.compare(password, user.password);

        if (isPasswordsMatch) {
          // const accessToken = jwt.sign(
          //   {
          //     userInfo: {
          //       mobileNumber: user.mobileNumber,
          //     },
          //   },
          //   process.env.NEXTAUTH_SECRET,
          //   { expiresIn: '59s' }
          // );

          // const refreshToken = jwt.sign(
          //   { mobileNumber: user.mobileNumber },
          //   process.env.REFRESH_TOKEN_SECRET,
          //   { expiresIn: '1d' }
          // );

          // user.refreshToken = refreshToken;

          user.save();

          return {
            // accessToken,
            // refreshToken,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
          };
        } else {
          return null;
        }

        // user.save().then(() => {
        // res.cookie('jwt', refreshToken, {
        //   httpOnly: true,
        //   maxAge: 24 * 60 * 60 * 1000,
        //   sameSite: 'None',
        //   secure: true,
        // });

        // res.status(200).json({
        //   accessToken,
        //   refreshToken,
        //   id: user.id,
        //   name: `${user.firstName} ${user.lastName}`,
        // });
        // })

        // const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/auth`, {
        //   body: JSON.stringify(payload),
        //   headers: {
        //     'Accept-Language': 'en-US',
        //     'Content-Type': 'application/json',
        //   },
        //   method: 'POST',
        // });

        // const user = await res.json();

        // if (!res.ok) {
        //   throw new Error(user.exception);
        // }

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }

        // // Return null if user data could not be retrieved
        // return null;
      },
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
      id: 'alcmene-signin',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Sign in with Alcmene',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
    logo: '/favicon.ico', // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
});
