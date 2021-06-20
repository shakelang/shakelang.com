import CodeMirror = require("codemirror");
import 'codemirror/addon/mode/simple';

CodeMirror.defineSimpleMode("shake", {
    start: [
        { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
        { regex: /(function)(\s+)([a-z$][\w$]*)/, token: ["keyword", null, "variable-2"] },
        { regex: /(?:function|var|return|if|for|while|else|do|this)\b/, token: "keyword" },
        { regex: /true|false|null|undefined/, token: "atom" },
        { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number" },
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
        { regex: /.*/, token: "comment" }
    ],
    meta: {
        dontIndentStates: ["comment"],
        lineComment: "//"
    }
});
