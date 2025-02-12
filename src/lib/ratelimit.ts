import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

export const ratelimit = new Ratelimit({
   redis: redis,
   limiter: Ratelimit.slidingWindow(100, "10 s"),
   enableProtection: true,
   analytics: true,
 });
