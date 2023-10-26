module.exports = function () {
  return {
    name: "custom-webpack-plugin",
    configureWebpack(config, isServer, utils) {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = config.resolve.alias ?? {};
      config.resolve.alias.scripts = "./build/scripts";
    },
  };
};
