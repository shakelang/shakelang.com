const Prism = require("prismjs");

console.log("Loading prism-shake.js");

const keywords = [
  "do",
  "while",
  "for",
  "if",
  "else",
  "class",
  "extends",
  "implements",
  "public",
  "protected",
  "private",
  "new",
  "function",
  "return",
  "var",
  "let",
  "const",
  "dynamic",
  "byte",
  "short",
  "int",
  "long",
  "float",
  "double",
  "char",
  "boolean",
  "import",
  "void",
  "constructor",
  "as",
];

Prism.languages.shake = {
  string: /"(?:[^\\]|\\.)*?(?:"|$)/,
  keyword: new RegExp(`\\b(?:${keywords.join("|")})\\b`),
  "variable-2":
    /(function|void|class|interface|enum|var|let[a-z$][\w$]*)(\s+)([a-z$][\w$]*)/,
  atom: /true|false|null/,
  number: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
  comment: [/\/\/.*/, /\/\*[\s\S]*?\*\//],
  operator: /[-+\/*=<>!]+/,
  punctuation: /[\{\[\(]|\}|\]|\)/,
  variable: /[a-z][\w]*/,
};

Prism.languages.shake["keyword"].inside = {
  "variable-2":
    /(function|void|class|interface|enum|var|let[a-z$][\w$]*)(\s+)([a-z$][\w$]*)/,
};

Prism.languages.shake["comment"][1].inside = {
  comment: Prism.languages.shake["comment"][0],
};

Prism.hooks.add("before-tokenize", (env) => {
  if (env.language === "shake") {
    env.tokenStack = [];

    env.backup = (str, match) => {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === match[0]) {
          len = i + 1;
          break;
        }
      }
      env.tokens = env.tokens.slice(0, len);
      env.text = env.input.slice(0, len);
      return match;
    };
  }
});

Prism.hooks.add("before-insert", (env) => {
  if (env.language === "shake") {
    if (env.tokenStack.length > 0) {
      env.tokens = env.tokenStack;
      env.text = env.backup(env.input, env.tokenStack[0]);
      return true;
    }
  }
});

Prism.hooks.add("after-tokenize", (env) => {
  if (env.language === "shake") {
    env.tokenStack = env.tokens.slice();
  }
});
