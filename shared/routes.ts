import { z } from "zod";
import {
  insertContactSchema,
  insertEventSchema,
  insertGameScoreSchema,
  insertPuzzleSchema,
  insertContentSchema,
  insertPublicationSchema,
  users,
  contactSubmissions,
  events,
  gameScores,
  puzzles,
  content,
  publications,
} from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    me: {
      method: "GET" as const,
      path: "/api/me" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>().nullable(),
      },
    },
    users: {
      method: "GET" as const,
      path: "/api/admin/users" as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/auth/login" as const,
      input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: "POST" as const,
      path: "/api/auth/register" as const,
      input: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        adminCode: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout" as const,
      responses: {
        204: z.void(),
      },
    },
  },
  contacts: {
    create: {
      method: 'POST' as const,
      path: '/api/contacts' as const,
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contactSubmissions.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    list: {
      method: 'GET' as const,
      path: '/api/contacts' as const,
      responses: { 200: z.array(z.custom<typeof contactSubmissions.$inferSelect>()) }
    }
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events' as const,
      responses: { 200: z.array(z.custom<typeof events.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/events' as const,
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  gameScores: {
    create: {
      method: 'POST' as const,
      path: '/api/game-scores' as const,
      input: insertGameScoreSchema,
      responses: {
        201: z.custom<typeof gameScores.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    list: {
      method: 'GET' as const,
      path: '/api/game-scores' as const,
      responses: { 200: z.array(z.custom<typeof gameScores.$inferSelect>()) }
    }
  },
  puzzles: {
    list: {
      method: "GET" as const,
      path: "/api/puzzles" as const,
      responses: {
        200: z.array(z.custom<typeof puzzles.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/puzzles" as const,
      input: insertPuzzleSchema,
      responses: {
        201: z.custom<typeof puzzles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    daily: {
      method: "GET" as const,
      path: "/api/puzzles/daily/:type" as const,
      responses: {
        200: z.custom<typeof puzzles.$inferSelect>().nullable(),
      },
    },
  },
  content: {
    list: {
      method: "GET" as const,
      path: "/api/content" as const,
      responses: {
        200: z.array(z.custom<typeof content.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/content" as const,
      input: insertContentSchema,
      responses: {
        201: z.custom<typeof content.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/content/:id" as const,
      input: insertContentSchema.partial(),
      responses: {
        200: z.custom<typeof content.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/content/:id" as const,
      responses: {
        204: z.undefined(),
        404: errorSchemas.notFound,
      },
    },
  },
  publications: {
    list: {
      method: "GET" as const,
      path: "/api/publications" as const,
      responses: {
        200: z.array(z.custom<typeof publications.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/publications" as const,
      input: insertPublicationSchema,
      responses: {
        201: z.custom<typeof publications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/publications/:id" as const,
      responses: {
        200: z.custom<typeof publications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/publications/:id" as const,
      input: insertPublicationSchema.partial(),
      responses: {
        200: z.custom<typeof publications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/publications/:id" as const,
      responses: {
        204: z.undefined(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
