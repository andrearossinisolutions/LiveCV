import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "dev-only-session-secret";
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(":");
  const actualHash = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  return (
    actualHash.length === expectedBuffer.length &&
    timingSafeEqual(actualHash, expectedBuffer)
  );
}

export function signSession(userId: number) {
  const payload = `${userId}:${Date.now()}`;
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function readSession(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [userId, issuedAt, signature] = decoded.split(":");
    const payload = `${userId}:${issuedAt}`;
    const expectedSignature = createHmac("sha256", getSessionSecret())
      .update(payload)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    return Number(userId);
  } catch {
    return null;
  }
}
