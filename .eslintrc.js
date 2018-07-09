module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "no-console": 0,
    "indent": [2, "tab"],
    "no-tabs": 0,
    "quotes": [2, "double", { "avoidEscape": true }],
		"prefer-destructuring": ["error", {"object": false, "array": false}],
		"no-unused-vars": 0
  }
};