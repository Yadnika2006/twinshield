import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, role } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // 2. Insert into Supabase users table
        const { error: signUpError } = await supabaseAdmin.from("users").insert([
            {
                email,
                name,
                role: role || "student",
                password_hash: hashedPassword,
            },
        ]);

        if (signUpError) {
            if (signUpError.code === "23505") { // Unique violation
                return NextResponse.json(
                    { error: "User already exists with this email" },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: signUpError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
