import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";

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

export const shake = simpleMode({
  start: [
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
    {
      regex:
        /(function|void|class|interface|enum|var|let[a-z$][\w$]*)(\s+)([a-z$][\w$]*)/,
      token: ["keyword", "variable-2"],
    },
    { regex: new RegExp(`(?:${keywords.join("|")})\\b`), token: "keyword" },
    { regex: /true|false|null/, token: "atom" },
    {
      regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
      token: "number",
    },
    { regex: /\/\/.*/, token: "comment" },
    { regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3" },
    { regex: /\/\*/, token: "comment", next: "comment" },
    { regex: /[-+\/*=<>!]+/, token: "operator" },
    { regex: /[\{\[\(]/, indent: true },
    { regex: /[\}\]\)]/, dedent: true },
    { regex: /[a-z][\w]*/, token: "variable" },

    { regex: /[\[\]\{\}\(\)]/, token: "bracket" },
  ],
  comment: [
    { regex: /.*?\*\//, token: "comment", next: "start" },
    { regex: /.*/, token: "comment" },
  ],
  /*
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//",
  },*/
});
