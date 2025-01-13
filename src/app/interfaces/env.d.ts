declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    PASSWORD_SALT_ROUNDS: number;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    WOLFSTUDIOS_EMAIL: string;
    EMAIL_APP_PASS: string;
    SUPABASE_BUCKET_KEY: string;
    SUPABASE_BUCKET_URL: string;
    SUPABASE_BUCKET_GENERAL: string;
  }
}
