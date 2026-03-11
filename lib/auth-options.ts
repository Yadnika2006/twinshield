import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import type { NextAuthOptions } from "next-auth";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Fetch user from Supabase
                const { data: user, error } = await supabaseAdmin
                    .from("users")
                    .select("id, name, email, role, password_hash")
                    .eq("email", credentials.email)
                    .single();

                if (error || !user) return null;
                if (!user.password_hash) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );
                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role ?? "student",
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    const { error } = await supabaseAdmin
                        .from('users')
                        .upsert({
                            email: user.email,
                            name: user.name,
                            avatar_url: (user as any).image || null,
                            role: 'student'
                        }, { onConflict: 'email' });

                    if (error) {
                        console.error("Supabase upsert error in signIn:", error);
                    }
                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return true;
                }
            }
            return true;
        },

        async redirect({ url, baseUrl }) {
            // Force redirect to dashboard if returning to root
            if (url === baseUrl || url === `${baseUrl}/` || url === '/') {
                return `${baseUrl}/dashboard`;
            }
            if (url.startsWith(baseUrl)) return url;
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            return `${baseUrl}/dashboard`;
        },

        async jwt({ token, user, account }) {
            if (user) {
                try {
                    const { data: dbUser } = await supabaseAdmin
                        .from('users')
                        .select('id, role')
                        .eq('email', user.email)
                        .single();

                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role || "student";
                    } else {
                        token.id = user.id;
                        token.role = "student";
                    }
                } catch (err) {
                    token.id = user.id;
                    token.role = "student";
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                (session.user as { id?: string }).id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
