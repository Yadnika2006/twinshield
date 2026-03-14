import { getServerSession as _getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Get the current NextAuth session on the server.
 * Usage: const session = await getServerSession();
 */
export async function getServerSession() {
    return await _getServerSession(authOptions);
}

/**
 * Get the full user record from Supabase using the current session userId.
 * Returns null if not authenticated or user not found.
 */
export async function getCurrentUser() {
    const session = await getServerSession();
    if (!session?.user) return null;

    const userId = (session.user as { id?: string }).id;
    if (!userId) return null;

    const { data, error } = await supabaseAdmin
        .from("users")
        .select("id, name, email, role, created_at")
        .eq("id", userId)
        .single();

    if (error || !data) return null;
    return data;
}
