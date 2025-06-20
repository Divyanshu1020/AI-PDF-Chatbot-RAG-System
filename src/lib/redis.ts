import { Redis } from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit";
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})


export const rateLimitForUserPreviousChat = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
})

export const rateLimitForCreateNewChat = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, "1 d"),
})

export const rateLimitForPreviousChatMessages = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
})

export const rateLimitForChatMessages = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 d"),
})
