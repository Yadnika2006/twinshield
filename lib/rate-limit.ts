type RateLimitEntry = {
    count: number;
    resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

type RateLimitKeyConfig = {
    namespace: string;
    maxRequests: number;
    windowMs: number;
};

export type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
    retryAfterSeconds: number;
};

declare global {
    // eslint-disable-next-line no-var
    var __twinshieldRateLimitStore: RateLimitStore | undefined;
}

function getStore(): RateLimitStore {
    if (!globalThis.__twinshieldRateLimitStore) {
        globalThis.__twinshieldRateLimitStore = new Map<string, RateLimitEntry>();
    }
    return globalThis.__twinshieldRateLimitStore;
}

function cleanupExpiredEntries(now: number, store: RateLimitStore): void {
    for (const [key, value] of store.entries()) {
        if (value.resetAt <= now) {
            store.delete(key);
        }
    }
}

export function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const [first] = forwardedFor.split(",");
        if (first?.trim()) {
            return first.trim();
        }
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp?.trim()) {
        return realIp.trim();
    }

    return "unknown";
}

export function applyRateLimit(request: Request, config: RateLimitKeyConfig): RateLimitResult {
    const now = Date.now();
    const store = getStore();

    if (store.size > 5000) {
        cleanupExpiredEntries(now, store);
    }

    const ip = getClientIp(request);
    const key = `${config.namespace}:${ip}`;
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
        const resetAt = now + config.windowMs;
        store.set(key, { count: 1, resetAt });

        return {
            success: true,
            limit: config.maxRequests,
            remaining: Math.max(config.maxRequests - 1, 0),
            resetAt,
            retryAfterSeconds: Math.ceil((resetAt - now) / 1000),
        };
    }

    existing.count += 1;
    store.set(key, existing);

    const remaining = Math.max(config.maxRequests - existing.count, 0);
    const success = existing.count <= config.maxRequests;

    return {
        success,
        limit: config.maxRequests,
        remaining,
        resetAt: existing.resetAt,
        retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
}

export function buildRateLimitHeaders(rate: RateLimitResult): Record<string, string> {
    return {
        "X-RateLimit-Limit": String(rate.limit),
        "X-RateLimit-Remaining": String(rate.remaining),
        "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
        "Retry-After": String(Math.max(rate.retryAfterSeconds, 1)),
    };
}
