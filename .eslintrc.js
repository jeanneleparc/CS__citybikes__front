/* eslint-env node */
module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "typescript",
      "html"
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    "rules": {
      "semi": ["error", "always"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"]
    },
    "env": {
        "browser": true,
        "es2021": true
    },
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "ignorePatterns": ["*.css"]
};
