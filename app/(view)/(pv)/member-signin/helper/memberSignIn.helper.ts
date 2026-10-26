export const memberSignInHelper = {
  validateUser: (user: string): boolean => {
    return user.trim().length > 0;
  },
  validatePassword: (password: string): boolean => {
    return password.length > 0;
  },
  /** New passwords: the same 8-character minimum the server enforces. */
  isStrongEnough: (password: string): boolean => {
    return password.length >= 8;
  },
  /** Reset links carry a 64-character hex token; anything else can't be valid. */
  isResetToken: (token: string): boolean => {
    return /^[0-9a-f]{64}$/.test(token);
  },
};
