/**
 * Eén centrale rechtencontrole voor het volledige beheerportaal (server-only).
 *
 * Volgorde van beslissen:
 *  1. Vaste eigenaars (e-mailadressen in `superadmin.ts`) → alle rechten.
 *  2. Rollen in `user_roles`: `owner` of `super_admin` → alle rechten.
 *  3. Actieve rij in `portal_admins` met rol `admin` → alle rechten.
 *  4. Anders: de rechtenmatrix (`role_permissions`).
 *
 * Zo krijgt een eigenaar nooit meer een onterechte "Je hebt geen rechten".
 */
import { isSuperAdminEmail } from "@/lib/superadmin";

export type PermissionContext = {
  userId: string;
  claims?: unknown;
};

const FULL_ACCESS_ROLES = ["owner", "super_admin"];

export const PERMISSION_DENIED = "Je hebt geen rechten voor deze actie.";

function claimEmail(claims: unknown): string | null {
  const email = (claims as { email?: string | null } | null)?.email;
  return email ? email.trim().toLowerCase() : null;
}

async function sql() {
  const { db } = await import("@/lib/neon.server");
  return db();
}

/** E-mailadres van de ingelogde gebruiker (token, anders het profiel). */
export async function resolveUserEmail(context: PermissionContext): Promise<string | null> {
  const fromToken = claimEmail(context.claims);
  if (fromToken) return fromToken;
  if (!context.userId) return null;
  try {
    const rows = (await (await sql())`
      select email from profiles where id = ${context.userId}::uuid limit 1
    `) as Array<{ email: string | null }>;
    const email = rows[0]?.email;
    return email ? email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

/** True wanneer de gebruiker eigenaar/super-admin is (alle rechten). */
export async function isFullAccessUser(context: PermissionContext): Promise<boolean> {
  const email = await resolveUserEmail(context);
  if (isSuperAdminEmail(email)) return true;

  try {
    const db = await sql();
    if (context.userId) {
      const roleRows = (await db`
        select role::text as role from user_roles where user_id = ${context.userId}::uuid
      `) as Array<{ role: string }>;
      if (roleRows.some((r) => FULL_ACCESS_ROLES.includes(r.role))) return true;
    }
    if (email) {
      const adminRows = (await db`
        select role, active from portal_admins where lower(email) = ${email} limit 1
      `) as Array<{ role: string; active: boolean }>;
      const row = adminRows[0];
      if (row?.active && row.role === "admin") return true;
    }
  } catch {
    /* val terug op de matrix */
  }
  return false;
}

/** Heeft deze gebruiker het gevraagde recht? */
export async function hasPermission(
  context: PermissionContext,
  permission: string,
): Promise<boolean> {
  if (await isFullAccessUser(context)) return true;
  if (!context.userId) return false;
  try {
    const db = await sql();
    const roleRows = (await db`
      select role::text as role from user_roles where user_id = ${context.userId}::uuid
    `) as Array<{ role: string }>;
    const roles = roleRows.map((r) => r.role);
    if (roles.length === 0) return false;
    const rows = (await db`
      select 1 from role_permissions
      where allowed and permission = ${permission} and role::text = any(${roles})
      limit 1
    `) as unknown[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Werpt een duidelijke fout wanneer het recht ontbreekt. */
export async function assertPermission(context: PermissionContext, permission: string) {
  if (await hasPermission(context, permission)) return;
  throw new Error(PERMISSION_DENIED);
}
