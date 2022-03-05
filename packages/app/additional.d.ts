import "iron-session";
declare module "iron-session" {
    interface IronSessionData {
      nonce?: string;
      siwe?: {
          domain?: string;
          address?: string;
          statement?: string;
          uri?: string;
          version?: string;
          chainId?: number;
          nonce?: string;
      };
    }
  }