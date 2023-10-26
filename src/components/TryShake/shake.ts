const interpreters: any = {};

// @ts-ignore
export const shake_versions =
  require("../../../build/scripts/shake-versions.json") as {
    commit: string;
    file: string;
  }[];

export async function getShakeInterpreter(
  file: string
): Promise<{ execute(source: String, input: String): void }> {
  if (!interpreters[file]) {
    // @ts-ignore
    interpreters[file] = await import(
      /* webpackInclude: /\.js$/ */
      /* webpackChunkName: 'commit-entry-' */
      /* webpackMode: 'lazy' */
      /* webpackPrefetch: true */
      /* webpackPreload: true */
      `../../../build/scripts/shake/${file}`
    );

    if (interpreters[file].addInterpreterFileFromUrl) {
      await interpreters[file].addInterpreterFileFromUrl(
        "core/system.shake",
        "./assets/shake/core/system.shake"
      );
    }
  }

  return {
    execute(source: String, input: String) {
      if (!interpreters[file].addInterpreterFileFromUrl)
        console.warn(
          `This shake version seems not to allow API imports, so the core API can't be imported [used verion: ${file}]`
        );
      interpreters[file].execute(source, input);
    },
  };
}
