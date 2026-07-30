const RATE_LIMITS = {
  like: { limit: 30, window: 60 },
  comment: { limit: 20, window: 60 },
  question: { limit: 10, window: 300 },
  upload: { limit: 10, window: 300 },
  message: { limit: 5, window: 300 },
  alert: { limit: 5, window: 60 }, // ✅ 5 alerts per minute
};