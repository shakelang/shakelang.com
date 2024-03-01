// This file is used to define the language mode for the codemirror editor
// The language is based on the Kotlin language mode, with some modifications
// The original Kotlin language mode can be found here:
// https://github.com/codemirror/legacy-modes/blob/main/mode/clike.js

import { clike } from "@codemirror/legacy-modes/mode/clike";

function words(str) {
  var obj = {},
    words = str.split(" ");
  for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
  return obj;
}

function tokenShakeString(tripleString) {
  return function (stream, state) {
    var escaped = false,
      next,
      end = false;
    while (!stream.eol()) {
      if (!tripleString && !escaped && stream.match('"')) {
        end = true;
        break;
      }
      if (tripleString && stream.match('"""')) {
        end = true;
        break;
      }
      next = stream.next();
      if (!escaped && next == "$" && stream.match("{")) stream.skipTo("}");
      escaped = !escaped && next == "\\" && !tripleString;
    }
    if (end || !tripleString) state.tokenize = null;
    return "string";
  };
}

function tokenNestedComment(depth) {
  return function (stream, state) {
    var ch;
    while ((ch = stream.next())) {
      if (ch == "*" && stream.eat("/")) {
        if (depth == 1) {
          state.tokenize = null;
          break;
        } else {
          state.tokenize = tokenNestedComment(depth - 1);
          return state.tokenize(stream, state);
        }
      } else if (ch == "/" && stream.eat("*")) {
        state.tokenize = tokenNestedComment(depth + 1);
        return state.tokenize(stream, state);
      }
    }
    return "comment";
  };
}

export const shake = clike({
  name: "shake",
  keywords: words(
    /*keywords*/
    "package as typealias class interface this super val operator " +
      "var fun for is in This throw return annotation " +
      "break continue object if else while do try when !in !is as? " +
      /*soft keywords*/
      "file import where by get set abstract enum open inner override private public internal " +
      "protected catch finally out final static vararg reified dynamic companion constructor init " +
      "sealed field property receiver param sparam lateinit data inline noinline tailrec " +
      "external annotation crossinline const operator infix suspend actual expect setparam"
  ),
  types: words(
    /* package java.lang */
    "byte short int long ubyte ushort uint ulong char boolean String"
  ),
  // @ts-ignore
  intendSwitch: false,
  indentStatements: false,
  multiLineStrings: true,
  number:
    /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
  blockKeywords: words(
    "catch class do else finally for if where try while enum"
  ),
  defKeywords: words("class val var object interface fun"),
  atoms: words("true false null this"),
  hooks: {
    "@": function (stream) {
      stream.eatWhile(/[\w\$_]/);
      return "meta";
    },
    "*": function (_stream, state) {
      return state.prevToken == "." ? "variable" : "operator";
    },
    '"': function (stream, state) {
      state.tokenize = tokenShakeString(stream.match('""'));
      return state.tokenize(stream, state);
    },
    "/": function (stream, state) {
      if (!stream.eat("*")) return false;
      state.tokenize = tokenNestedComment(1);
      return state.tokenize(stream, state);
    },
    indent: function (state, ctx, textAfter, indentUnit) {
      var firstChar = textAfter && textAfter.charAt(0);
      if ((state.prevToken == "}" || state.prevToken == ")") && textAfter == "")
        return state.indented;
      if (
        (state.prevToken == "operator" &&
          textAfter != "}" &&
          state.context.type != "}") ||
        (state.prevToken == "variable" && firstChar == ".") ||
        ((state.prevToken == "}" || state.prevToken == ")") && firstChar == ".")
      )
        return indentUnit * 2 + ctx.indented;
      if (ctx.align && ctx.type == "}")
        return (
          ctx.indented +
          (state.context.type == (textAfter || "").charAt(0) ? 0 : indentUnit)
        );
    },
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] },
  },
});
