const PASSWORD_RULE =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const PASSWORD_RULE_MESSAGE =
  'Password should have at least 1 uppercase, lowercase, along with a number and a special character';

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGE = {
  PASSWORD_RULE_MESSAGE,
};