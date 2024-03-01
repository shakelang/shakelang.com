const fs = require("fs-extra");
const { basename } = require("path");
const download_browser_scripts = require("./download_browser_scripts");

(async () => {
  await fs.mkdirs("scripts");
  const scripts = await download_browser_scripts("scripts/shake/");
  await fs.writeFile(
    "scripts/shake-versions.json",
    JSON.stringify(
      scripts.map((e) => ({
        commit: e.commit,
        file: basename(e.target).replace(/\\/g, "/"),
      })),
      null,
      2
    )
  );
})();
