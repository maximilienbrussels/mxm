/**
 * Gedeelde sessie- én rechtencontrole voor `/api/...`-routes (server-only).
 *
 * Belangrijk: alleen een echte rechtenweigering geeft 403. Andere fouten
 * (databaseverbinding, ontbrekende tabel, onverwachte fout) geven 500 mét de
 * echte foutmelding, zodat de oorzaak zichtbaar is in plaats van verstopt
 * achter een misleidende "Forbidden".
 */

export type RouteGuardAuth = {
  userId: string;
  email: string | null;
  token: string;
  claims: { sub?: string; email?: string };
};

export async function guardApiRoute(
  request: Request,
  permission: string,
): Promise<{ auth: RouteGuardAuth } | { response: Response }> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return { response: Response.json({ error: "Niet aangemeld." }, { status: 401 }) };
  }
  const token = header.slice(7).trim();

  let claims: { sub?: string; email?: string };
  try {
    const { verifyAuthToken } = await import("@/lib/neon-data.server");
    claims = (await verifyAuthToken(token)) as never;
  } catch {
    return { response: Response.json({ error: "Je sessie is verlopen." }, { status: 401 }) };
  }

  const userId = String(claims.sub ?? "");
  const { assertPermission, isPermissionDenied } = await import("@/lib/permission-core.server");
  try {
    await assertPermission({ userId, claims }, permission);
  } catch (error) {
    if (isPermissionDenied(error)) {
      return {
        response: Response.json(
          { error: "Je hebt geen rechten voor deze actie.", code: "permission_denied" },
          { status: 403 },
        ),
      };
    }
    const message = error instanceof Error ? error.message : "Onbekende fout";
    console.error("[api] rechtencontrole mislukt:", message);
    return {
      response: Response.json(
        { error: `Rechtencontrole mislukt: ${message}`, code: "permission_check_failed" },
        { status: 500 },
      ),
    };
  }

  return { auth: { userId, email: claims.email ?? null, token, claims } };
}
