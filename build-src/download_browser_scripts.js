// jshint esversion: 8

const { Octokit } = require("@octokit/core");
const fs = require("fs-extra");
const { join } = require("path");
const resolve_commits = require("./resolve_commits");

function base64Decode(b64string) {
  if (typeof Buffer.from === "function")
    return Buffer.from(b64string, "base64");
  else return new Buffer(b64string, "base64");
}

module.exports = async function downloadBrowserScriptsTo(dir) {
  if (!process.env.GITHUB_TOKEN)
    throw new Error("Expecting GITHUB_TOKEN as environment variable");

  const builds_branch_url = "/repos/shake-lang/shake/branches/builds";
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  function rest(url) {
    return octokit.request(url).then((response) => response.data);
  }

  const builds_branch = await rest(builds_branch_url);
  const tree = await rest(builds_branch.commit.commit.tree.url);
  const commits_folder = await rest(
    tree.tree.find((e) => e.path === "commits").url
  );

  fs.mkdirs(dir);

  console.log("Resolving commits on master...");
  const { nodes } = await resolve_commits("master");
  console.log(`Found ${nodes.length} commits on branch master!`);
  const idx = (build) => nodes.findIndex((e) => e.oid.startsWith(build.commit));

  console.log("Downloading builds...");

  return (
    await Promise.all(
      commits_folder.tree.map(({ path, url }) =>
        (async () => {
          const commit = await rest(url);
          const browser_script = await rest(
            commit.tree.find((e) => e.path === "browser.js")
          );
          const file_contents = base64Decode(browser_script.content).toString();
          const target = join(dir, `commit_${path}.js`);
          await fs.writeFile(target, file_contents);
          console.log(`Got browser-script for commit ${path} into ${target}`);
          return { commit: path, target: target };
        })()
      )
    )
  ).sort((a, b) => idx(a) - idx(b));
};
