import { ZodError } from "zod";

export function getValidationDetails(error: ZodError): string[] {
    return error.issues.map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "body";
        return `${path}: ${issue.message}`;
    });
}
