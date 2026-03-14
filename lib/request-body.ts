export class RequestBodyTooLargeError extends Error {
    constructor(public readonly maxBytes: number) {
        super(`Request body exceeds ${maxBytes} bytes`);
        this.name = "RequestBodyTooLargeError";
    }
}

export class InvalidJsonBodyError extends Error {
    constructor(message = "Invalid JSON request body") {
        super(message);
        this.name = "InvalidJsonBodyError";
    }
}

export async function parseJsonBodyWithLimit(request: Request, maxBytes: number): Promise<unknown> {
    const rawBody = await request.text();
    const bodySize = new TextEncoder().encode(rawBody).length;

    if (bodySize > maxBytes) {
        throw new RequestBodyTooLargeError(maxBytes);
    }

    if (!rawBody.trim()) {
        throw new InvalidJsonBodyError("Request body cannot be empty");
    }

    try {
        return JSON.parse(rawBody);
    } catch {
        throw new InvalidJsonBodyError();
    }
}
