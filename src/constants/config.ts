/**
 * Set EXPO_PUBLIC_API_URL to your Wasp server, e.g. http://localhost:3001
 * Mobile API path: /api/mobile/*
 * Auth header: Authorization: Bearer <userId>
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export const USE_REMOTE_API = Boolean(API_BASE_URL);

export const APP_NAME = "PaySuite";
