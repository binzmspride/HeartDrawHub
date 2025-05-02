import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Tạo DATABASE_URL từ các biến PGUSER, PGPASSWORD, ...
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
  
  if (PGUSER && PGPASSWORD && PGHOST && PGPORT && PGDATABASE) {
    connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
  } else {
    throw new Error(
      "Không thể kết nối database: Thiếu DATABASE_URL hoặc các biến PG*. Bạn đã cấu hình database chưa?"
    );
  }
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });

// Kiểm tra kết nối
console.log("Kết nối database thành công!");