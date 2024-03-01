// This file is created to add Shake language support to Prism.js
// It is based on the Kotlin language support file from Prism.js
// The original kotlin language support file can be found at:
// https://github.com/PrismJS/prism/blob/master/components/prism-kotlin.js

(function (Prism) {
  Prism.languages.shake = Prism.languages.extend("clike", {
    keyword: {
      // The lookbehind prevents wrong highlighting of e.g. shake.properties.get
      pattern:
        /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|static|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while|byte|short|int|long|ubyte|ushort|uint|ulong|float|double|char|boolean)\b/,
      lookbehind: true,
    },
    function: [
      {
        pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/,
        greedy: true,
      },
      {
        pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/,
        lookbehind: true,
        greedy: true,
      },
    ],
    number:
      /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
    operator:
      /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/,
  });

  delete Prism.languages.shake["class-name"];

  var interpolationInside = {
    "interpolation-punctuation": {
      pattern: /^\$\{?|\}$/,
      alias: "punctuation",
    },
    expression: {
      pattern: /[\s\S]+/,
      inside: Prism.languages.shake,
    },
  };

  Prism.languages.insertBefore("shake", "string", {
    // https://shakelang.org/spec/expressions.html#string-interpolation-expressions
    "string-literal": [
      {
        pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
        alias: "multiline",
        inside: {
          interpolation: {
            pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
            inside: interpolationInside,
          },
          string: /[\s\S]+/,
        },
      },
      {
        pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
        alias: "singleline",
        inside: {
          interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
            lookbehind: true,
            inside: interpolationInside,
          },
          string: /[\s\S]+/,
        },
      },
    ],
    char: {
      // https://shakelang.org/spec/expressions.html#character-literals
      pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/,
      greedy: true,
    },
  });

  delete Prism.languages.shake["string"];

  Prism.languages.insertBefore("shake", "keyword", {
    annotation: {
      pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
      alias: "builtin",
    },
  });

  Prism.languages.insertBefore("shake", "function", {
    label: {
      pattern: /\b\w+@|@\w+\b/,
      alias: "symbol",
    },
  });

  Prism.languages.shake = Prism.languages.shake;
})(Prism);
