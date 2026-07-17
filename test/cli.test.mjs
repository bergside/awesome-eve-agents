import assert from "node:assert/strict";
import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const cliPath = path.join(repositoryRoot, "bin", "eveagents.js");
const knownSlug = "incident-response-commander";

function runCli(args, cwd) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
}

async function temporaryDirectory(t) {
  const directory = await mkdtemp(
    path.join(os.tmpdir(), "eveagents-cli-"),
  );
  t.after(() => rm(directory, { force: true, recursive: true }));
  return directory;
}

test("lists bundled agents", async (t) => {
  const cwd = await temporaryDirectory(t);
  const result = runCli(["list"], cwd);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Engineering/);
  assert.match(result.stdout, new RegExp(knownSlug));
  assert.equal(result.stderr, "");
});

test("installs an agent into the current directory", async (t) => {
  const cwd = await temporaryDirectory(t);
  const result = runCli(["install", knownSlug], cwd);
  const instructions = await readFile(
    path.join(cwd, knownSlug, "instructions.md"),
    "utf8",
  );
  const environmentExample = await readFile(
    path.join(cwd, knownSlug, ".env.example"),
    "utf8",
  );

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Installed Incident Response Commander/);
  assert.match(instructions, /# Identity/);
  assert.match(environmentExample, /no integration-specific environment variables/);
  assert.equal(result.stderr, "");
});

test("installs below a custom parent directory", async (t) => {
  const cwd = await temporaryDirectory(t);
  const result = runCli(["install", knownSlug, "--dir", "workspace"], cwd);

  assert.equal(result.status, 0);
  assert.match(
    await readFile(
      path.join(cwd, "workspace", knownSlug, "agent.ts"),
      "utf8",
    ),
    /defineAgent/,
  );
});

test("refuses to overwrite an existing agent by default", async (t) => {
  const cwd = await temporaryDirectory(t);
  const destination = path.join(cwd, knownSlug);
  await writeFile(destination, "keep me", "utf8");

  const result = runCli(["install", knownSlug], cwd);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /already exists/);
  assert.equal(await readFile(destination, "utf8"), "keep me");
});

test("replaces an existing destination only with --force", async (t) => {
  const cwd = await temporaryDirectory(t);
  const destination = path.join(cwd, knownSlug);
  await writeFile(destination, "replace me", "utf8");

  const result = runCli(["install", knownSlug, "--force"], cwd);

  assert.equal(result.status, 0);
  assert.match(
    await readFile(path.join(destination, "agent.ts"), "utf8"),
    /defineAgent/,
  );
});

test("reports unknown slugs without creating files", async (t) => {
  const cwd = await temporaryDirectory(t);
  const result = runCli(["install", "not-an-agent"], cwd);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown agent/);
});
