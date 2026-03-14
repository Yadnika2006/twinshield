import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";
import { InvalidJsonBodyError, parseJsonBodyWithLimit, RequestBodyTooLargeError } from "@/lib/request-body";
import { registerRequestSchema } from "@/lib/validation/schemas";
import { ZodError } from "zod";

const REGISTER_BODY_MAX_BYTES = 8 * 1024;

function getValidationDetails(error: ZodError): string[] {
    return error.issues.map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "body";
        return `${path}: ${issue.message}`;
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await parseJsonBodyWithLimit(req, REGISTER_BODY_MAX_BYTES);
        const { email, password, name, role } = registerRequestSchema.parse(body);

        // 1. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insert into Supabase users table
        const { error: signUpError } = await supabaseAdmin.from("users").insert([
            {
                email: email.toLowerCase(),
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
        if (error instanceof RequestBodyTooLargeError) {
            return NextResponse.json(
                { error: `Payload too large (max ${REGISTER_BODY_MAX_BYTES} bytes)` },
                { status: 413 }
            );
        }

        if (error instanceof InvalidJsonBodyError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid request payload",
                    details: getValidationDetails(error),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
