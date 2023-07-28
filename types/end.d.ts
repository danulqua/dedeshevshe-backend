declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';

      PORT: number;
      DATABASE_URL: string;
      SESSION_SECRET: string;

      CLIENT_BASE_URL: string;
      CLIENT_DOMAIN: string;

      RESEND_API_KEY: string;
      MAIL_DOMAIN: string;

      AWS_S3_REGION: string;
      AWS_S3_BUCKET_NAME: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
    }
  }
}

export {};
