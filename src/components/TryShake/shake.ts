const interpreters: any = {};

export interface LogEntry {
  type: "log" | "error" | "warn" | "info" | "debug";
  message: string;
}

export class Logger {
  constructor(readonly maxEntries: number = 1024) {}

  private logEntries: LogEntry[] = [];

  add(type: LogEntry["type"], message: string) {
    this.logEntries.push({ type, message });
    while (this.logEntries.length > this.maxEntries) this.logEntries.shift();
  }

  log(...message: string[]) {
    this.add("log", message.join(" "));
  }

  error(...message: string[]) {
    this.add("error", message.join(" "));
  }

  warn(...message: string[]) {
    this.add("warn", message.join(" "));
  }

  info(...message: string[]) {
    this.add("info", message.join(" "));
  }

  debug(...message: string[]) {
    this.add("debug", message.join(" "));
  }

  getLogEntries() {
    return this.logEntries;
  }

  clearLogEntries() {
    this.logEntries = [];
  }
}

const shakeLogger = new Logger();
global.shakeLogger = shakeLogger;

// @ts-ignore
export const shake_versions =
  require("../../../build/scripts/shake-versions.json") as {
    commit: string;
    file: string;
  }[];

export async function getShakeInterpreter(
  file: string
): Promise<{ execute(source: String, input: String): LogEntry[] }> {
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
        "/core/system.shake"
      );
    }
  }

  return {
    execute(source: String, input: String) {
      shakeLogger.clearLogEntries();

      if (!interpreters[file].addInterpreterFileFromUrl)
        shakeLogger.warn(
          `This shake version seems not to allow API imports, so the core API can't be imported [used verion: ${file}]`
        );

      interpreters[file].execute(source, input);

      return shakeLogger.getLogEntries();
    },
  };
}
