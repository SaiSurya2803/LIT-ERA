import { Store } from "express-session";
import { supabase } from "./db";

export class SupabaseSessionStore extends Store {
  async get(sid: string, cb: (err: any, session?: any) => void) {
    try {
      const { data, error } = await supabase.from("session").select("sess").eq("sid", sid).single();
      if (data) {
        cb(null, data.sess);
      } else {
        cb(null, null);
      }
    } catch (err) {
      cb(err);
    }
  }

  async set(sid: string, session: any, cb?: (err?: any) => void) {
    try {
      const expire = session.cookie?.expires ? new Date(session.cookie.expires) : new Date(Date.now() + 86400000);
      await supabase.from("session").upsert({ 
        sid, 
        sess: session, 
        expire: expire.toISOString() 
      });
      if (cb) cb();
    } catch (err) {
      if (cb) cb(err);
    }
  }

  async destroy(sid: string, cb?: (err?: any) => void) {
    try {
      await supabase.from("session").delete().eq("sid", sid);
      if (cb) cb();
    } catch (err) {
      if (cb) cb(err);
    }
  }
}
