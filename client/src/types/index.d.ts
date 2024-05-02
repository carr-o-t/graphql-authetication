export namespace API {
  interface AuthCookieResponse {
    auth: authCookie | null;
    error: {
      status: number;
      message?: string;
    } | null;
  }

  interface authCookie {
    message: string;
    success: boolean;
  }

  interface setCookieRequestBody {
    token: string;
    key: string;
    token_expiry: number;
  }
}
