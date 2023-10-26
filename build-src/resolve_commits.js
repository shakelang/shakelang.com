// jshint esversion: 8

const client = require("github-graphql-client");

const owner = "shake-lang";
const repo = "shake";
if (!process.env.GITHUB_TOKEN)
  throw new Error("Expecting GITHUB_TOKEN as environment variable");
const accessToken = process.env.GITHUB_TOKEN;

function doRequest(query, variables) {
  return new Promise(function (resolve, reject) {
    client(
      {
        token: accessToken,
        query: query,
        variables: variables,
      },
      function (err, res) {
        if (!err) {
          resolve(res);
        } else {
          console.log(JSON.stringify(err, null, 2));
          reject(err);
        }
      }
    );
  });
}

function request(after, branch = "master") {
  return doRequest(
    `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        ${branch}: ref(qualifiedName: "${branch}") {
          target {
            ... on Commit {
              history(first: 100, after: ${after}) {
                ...CommitFragment
              }
            }
          }
        }
      }
    }
    fragment CommitFragment on CommitHistoryConnection {
      totalCount
      nodes {
        oid
        message
        committedDate
        author {
          name
          email
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    `,
    { owner: owner, name: repo }
  );
}

async function resolveCommitsOnBranch(branch = "master") {
  const { data } = await request(null, branch);
  const history = data.repository.master.target.history;
  const { totalCount, nodes } = history;
  var hasNext = totalCount > nodes.length;
  var after = '"' + nodes[99].oid + " " + (nodes.length - 1) + '"';
  while (hasNext) {
    const aw = await request(after, branch);
    nodes.push(...aw.data.repository.master.target.history.nodes);
    hasNext = totalCount > nodes.length;
    after = '"' + nodes[0].oid + " " + (nodes.length - 1) + '"';
  }
  return history;
}

module.exports = resolveCommitsOnBranch;
