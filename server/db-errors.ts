export interface DescribedError {
  status: number;
  code: string;
  message: string;
  logMessage: string;
}

interface MaybeDbError {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  message?: string;
}

/**
 * Turns driver/connection failures into an actionable message for the client so
 * the UI shows the real cause instead of a generic "Registration failed".
 */
export function describeDbError(err: unknown, action: string): DescribedError {
  const error = (err ?? {}) as MaybeDbError;
  const raw = error.sqlMessage || error.message || `Unknown error while performing ${action}`;
  const code = error.code || "INTERNAL_ERROR";

  const hint = hintFor(code);
  const message = hint ? `${hint} (${code})` : raw;

  return {
    status: hint ? 503 : 500,
    code,
    message,
    logMessage: `${action} failed [${code}]: ${raw}`,
  };
}

function hintFor(code: string): string | null {
  switch (code) {
    case "DATABASE_NOT_CONFIGURED":
      return "The server has no DATABASE_URL configured. Set it in the deployment environment variables.";
    case "ER_NO_SUCH_TABLE":
      return "The database is missing required tables. Run `npm run db:init` against the configured database.";
    case "ER_ACCESS_DENIED_ERROR":
    case "ER_DBACCESS_DENIED_ERROR":
      return "The database rejected the configured credentials. Check the user and password in DATABASE_URL.";
    case "ER_BAD_DB_ERROR":
      return "The database named in DATABASE_URL does not exist on the server.";
    case "ECONNREFUSED":
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "The database host is unreachable. Check the host and port (TiDB Cloud uses port 4000) in DATABASE_URL.";
    case "ETIMEDOUT":
    case "PROTOCOL_CONNECTION_LOST":
      return "The database connection timed out. Check TiDB Cloud network access rules for this deployment.";
    case "HANDSHAKE_SSL_ERROR":
    case "ERR_TLS_CERT_ALTNAME_INVALID":
    case "SELF_SIGNED_CERT_IN_CHAIN":
    case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
      return "TLS negotiation with the database failed. TiDB Cloud requires a TLS 1.2+ connection on port 4000.";
    case "SESSION_SECRET_MISSING":
      return "SESSION_SECRET is not configured on the server, so the login cookie cannot be signed.";
    default:
      return null;
  }
}
