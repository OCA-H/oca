export const partnerOrganizationHelper = {
  validateUser: (user: string): boolean => {
    return user.trim().length > 0;
  },
  validatePassword: (password: string): boolean => {
    return password.length > 0;
  },
};
