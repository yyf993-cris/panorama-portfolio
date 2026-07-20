import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

const MAX_ATTEMPTS_PER_DAY = 5;
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJSON(filePath: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, s, 100000, 64, "sha512").toString("hex");
  return { hash, salt: s };
}

function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

interface AdminData {
  username: string;
  passwordHash: string;
  salt: string;
  loginAttempts: { date: string; count: number };
}

const DEFAULT_PASSWORD = "admin123";

function getAdminData(): AdminData {
  const data = readJSON<AdminData | null>(ADMIN_FILE, null);
  if (data) return data;
  const { hash, salt } = hashPassword(DEFAULT_PASSWORD);
  const admin: AdminData = {
    username: "admin",
    passwordHash: hash,
    salt,
    loginAttempts: { date: "", count: 0 },
  };
  writeJSON(ADMIN_FILE, admin);
  return admin;
}

function saveAdminData(data: AdminData) {
  writeJSON(ADMIN_FILE, data);
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isLockedOut(): boolean {
  const admin = getAdminData();
  const today = getTodayStr();
  if (admin.loginAttempts.date !== today) return false;
  return admin.loginAttempts.count >= MAX_ATTEMPTS_PER_DAY;
}

function recordFailedAttempt() {
  const admin = getAdminData();
  const today = getTodayStr();
  if (admin.loginAttempts.date !== today) {
    admin.loginAttempts = { date: today, count: 1 };
  } else {
    admin.loginAttempts.count += 1;
  }
  saveAdminData(admin);
}

function resetAttempts() {
  const admin = getAdminData();
  admin.loginAttempts = { date: "", count: 0 };
  saveAdminData(admin);
}

export function authenticate(username: string, password: string): { success: boolean; error?: string } {
  if (isLockedOut()) {
    return { success: false, error: "今日密码错误次数已达上限，请明日再试" };
  }

  const admin = getAdminData();
  if (username !== admin.username || !verifyPassword(password, admin.passwordHash, admin.salt)) {
    recordFailedAttempt();
    const remaining = MAX_ATTEMPTS_PER_DAY - getAdminData().loginAttempts.count;
    return {
      success: false,
      error: remaining > 0
        ? `用户名或密码错误，今日剩余尝试次数：${remaining}`
        : "今日密码错误次数已达上限，请明日再试",
    };
  }

  resetAttempts();
  return { success: true };
}

export function forceResetPassword(newPassword: string) {
  const admin = getAdminData();
  const { hash, salt } = hashPassword(newPassword);
  admin.passwordHash = hash;
  admin.salt = salt;
  admin.loginAttempts = { date: "", count: 0 };
  saveAdminData(admin);
  // Security: invalidate all existing sessions after password change
  writeJSON(SESSIONS_FILE, {});
}

interface Sessions {
  [token: string]: { createdAt: number };
}

function getSessions(): Sessions {
  return readJSON<Sessions>(SESSIONS_FILE, {});
}

function saveSessions(sessions: Sessions) {
  writeJSON(SESSIONS_FILE, sessions);
}

export function createSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const sessions = getSessions();
  sessions[token] = { createdAt: Date.now() };
  saveSessions(sessions);
  return token;
}

export function validateSession(token: string | undefined): boolean {
  if (!token) return false;
  const sessions = getSessions();
  const session = sessions[token];
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_MAX_AGE) {
    delete sessions[token];
    saveSessions(sessions);
    return false;
  }
  return true;
}

export function destroySession(token: string) {
  const sessions = getSessions();
  delete sessions[token];
  saveSessions(sessions);
}
