import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email or username')
                    }
                    if (!user.password) {
                        throw new Error('Please login with your Google or GitHub account')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error('Incorrect Password')
                    }
                } catch (err: any) {
                    throw new Error(err.message || 'Authentication Error')
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();
            if (account?.provider === 'google' || account?.provider === 'github') {
                if (!user.email) {
                    return false;
                }
                try {
                    const existingUser = await UserModel.findOne({ email: user.email });
                    if (!existingUser) {
                        // User does not exist, create a new user with a temporary username
                        const tempUsername = 'user_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
                        await UserModel.create({
                            email: user.email,
                            username: tempUsername,
                            isVerified: true,
                            isAcceptingMessages: true,
                            messages: []
                        });
                    }
                } catch (error) {
                    console.error('Error during OAuth sign-in:', error);
                    return false;
                }
                return true;
            }
            return true; // allow credentials provider
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session
        },
        async jwt({ token, user, account, trigger, session }) {
            if (trigger === 'update' && session?.username) {
                token.username = session.username;
            }
            if (account) {
                await dbConnect();
                // Find user in DB
                const dbUser = user?.email ? await UserModel.findOne({ email: user.email }) : null;
                if (dbUser) {
                    token._id = dbUser._id.toString();
                    token.isVerified = dbUser.isVerified;
                    token.isAcceptingMessages = dbUser.isAcceptingMessages;
                    token.username = dbUser.username;
                }
            }
            return token
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}