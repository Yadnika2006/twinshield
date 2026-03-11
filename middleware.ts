import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Token is already verified by withAuth — just allow through
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token }) {
                // Return true only if a valid JWT token exists
                return !!token;
            },
        },
        pages: {
            signIn: "/",
        },
    }
);

// Protect only these route patterns
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/lab/:path*",
        "/report/:path*",
        "/agent-config",
    ],
};
