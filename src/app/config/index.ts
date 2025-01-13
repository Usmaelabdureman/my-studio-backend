import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  salt_rounds: process.env.PASSWORD_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  wolfstudios_email: process.env.WOLFSTUDIOS_EMAIL,
  email_app_pass: process.env.EMAIL_APP_PASS,
  supabase_bucket_key: process.env.SUPABASE_BUCKET_KEY,
  supabase_bucket_url: process.env.SUPABASE_BUCKET_URL,
  supabase_bucket_general: process.env.SUPABASE_BUCKET_GENERAL,
};
