Prism.languages.tokens = {
  string: /\<[^\>]*\>/,
  number: /\{[^\}]*\}/,
  comment: /\([^\)]*\)/,
};

Prism.hooks.add("before-tokenize", (env) => {
  if (env.language === "tokens") {
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
  if (env.language === "tokens") {
    if (env.tokenStack.length > 0) {
      env.tokens = env.tokenStack;
      env.text = env.backup(env.input, env.tokenStack[0]);
      return true;
    }
  }
});

Prism.hooks.add("after-tokenize", (env) => {
  if (env.language === "tokens") {
    env.tokenStack = env.tokens.slice();
  }
});
