export interface DbConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: {
    minVersion: "TLSv1.2";
    rejectUnauthorized: boolean;
  };
}

const DEFAULT_TIDB_PORT = 4000;
const DEFAULT_LOCAL_PORT = 3306;
const DEFAULT_DATABASE = "sys";

export function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "host.docker.internal"
  );
}

/**
 * Builds a mysql2 connection config from DATABASE_URL.
 *
 * TiDB Cloud defaults are applied when the URL omits them: port 4000, database
 * `sys` and TLS 1.2+ with certificate verification against the system CA store.
 */
export function buildConnectionConfig(rawUrl: string | undefined): DbConnectionConfig {
  const databaseUrl = (rawUrl || "").trim().replace(/^["']|["']$/g, "");

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your .env file locally, or to the Vercel project environment variables. " +
        "Format: mysql://<user>:<password>@<host>:4000/sys",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error(
      "DATABASE_URL is malformed. Expected mysql://<user>:<password>@<host>:4000/<database>. " +
        "Special characters in the password must be percent-encoded (for example @ becomes %40).",
    );
  }

  if (!parsed.protocol.startsWith("mysql")) {
    throw new Error(`DATABASE_URL must use the mysql:// protocol, received "${parsed.protocol}".`);
  }

  const local = isLocalHost(parsed.hostname);
  const sslDisabled = local || parsed.searchParams.get("ssl") === "false";

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || (local ? DEFAULT_LOCAL_PORT : DEFAULT_TIDB_PORT),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\//, "")) || DEFAULT_DATABASE,
    ssl: sslDisabled
      ? undefined
      : {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
  };
}

/** Connection description safe for logs — never includes the password. */
export function describeConnection(config: DbConnectionConfig): string {
  return `${config.host}:${config.port}/${config.database} (user=${config.user}, tls=${config.ssl ? "on" : "off"})`;
}
