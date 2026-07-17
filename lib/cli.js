import {
  access,
  cp,
  mkdir,
  readFile,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const registryPath = path.join(packageRoot, "registry.json");
const packageJsonPath = path.join(packageRoot, "package.json");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function write(stream, message = "") {
  stream.write(`${message}\n`);
}

function helpText() {
  return `Install open-source Eve agents.

Usage:
  eveagents install <slug> [--dir <directory>] [--force]
  eveagents list
  eveagents --version
  eveagents --help

Commands:
  install <slug>  Copy an agent into <directory>/<slug>.
  list            Show every available agent slug.

Options:
  -d, --dir       Parent directory for the installed agent (default: current directory).
  -f, --force     Replace an existing destination directory.
  -h, --help      Show this help message.
  -v, --version   Show the installed CLI version.

Example:
  npx @bergside/eveagents install incident-response-commander`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function loadRegistry() {
  const registry = await readJson(registryPath);

  if (
    registry?.schemaVersion !== 1 ||
    !Array.isArray(registry.agents)
  ) {
    throw new Error("The bundled agent registry is invalid.");
  }

  return registry;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseInstallArguments(args) {
  let slug = null;
  let directory = ".";
  let force = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--help" || argument === "-h") {
      return { help: true };
    }

    if (argument === "--force" || argument === "-f") {
      force = true;
      continue;
    }

    if (argument === "--dir" || argument === "-d") {
      const value = args[index + 1];

      if (!value || value.startsWith("-")) {
        throw new Error(`${argument} requires a directory.`);
      }

      directory = value;
      index += 1;
      continue;
    }

    if (argument.startsWith("-")) {
      throw new Error(`Unknown option: ${argument}`);
    }

    if (slug) {
      throw new Error("Install accepts exactly one agent slug.");
    }

    slug = argument;
  }

  if (!slug) {
    throw new Error("Provide an agent slug. Run eveagents list to see available agents.");
  }

  if (!slugPattern.test(slug)) {
    throw new Error(`Invalid agent slug: ${slug}`);
  }

  return { directory, force, help: false, slug };
}

function sourceDirectoryFor(agent) {
  if (
    typeof agent.path !== "string" ||
    !agent.path.startsWith("agents/")
  ) {
    throw new Error(`The registry path for ${agent.slug} is invalid.`);
  }

  const sourceDirectory = path.resolve(packageRoot, agent.path);
  const agentsRoot = `${path.resolve(packageRoot, "agents")}${path.sep}`;

  if (!sourceDirectory.startsWith(agentsRoot)) {
    throw new Error(`The registry path for ${agent.slug} escapes the package.`);
  }

  return sourceDirectory;
}

async function installAgent(args, context) {
  const options = parseInstallArguments(args);

  if (options.help) {
    write(context.stdout, helpText());
    return 0;
  }

  const registry = await loadRegistry();
  const agent = registry.agents.find((entry) => entry.slug === options.slug);

  if (!agent) {
    throw new Error(
      `Unknown agent "${options.slug}". Run eveagents list to see available agents.`,
    );
  }

  const sourceDirectory = sourceDirectoryFor(agent);
  const parentDirectory = path.resolve(context.cwd, options.directory);
  const destination = path.join(parentDirectory, agent.slug);

  if (await exists(destination)) {
    if (!options.force) {
      throw new Error(
        `${destination} already exists. Choose another directory or pass --force to replace it.`,
      );
    }

    await rm(destination, { force: true, recursive: true });
  }

  await mkdir(parentDirectory, { recursive: true });

  try {
    await cp(sourceDirectory, destination, {
      errorOnExist: true,
      force: false,
      recursive: true,
    });
  } catch (error) {
    await rm(destination, { force: true, recursive: true });
    throw error;
  }

  const displayPath = path.relative(context.cwd, destination) || ".";
  write(context.stdout, `Installed ${agent.name} to ${displayPath}`);
  write(context.stdout);
  write(context.stdout, "Next:");
  write(context.stdout, `  cd ${displayPath}`);
  write(context.stdout, "  npx eve@latest");
  return 0;
}

async function listAgents(context) {
  const registry = await loadRegistry();
  let currentCategory = null;

  for (const agent of registry.agents) {
    if (agent.category.name !== currentCategory) {
      if (currentCategory) {
        write(context.stdout);
      }

      currentCategory = agent.category.name;
      write(context.stdout, currentCategory);
    }

    write(context.stdout, `  ${agent.slug} - ${agent.summary}`);
  }

  return 0;
}

export async function run(
  args,
  {
    cwd = process.cwd(),
    stderr = process.stderr,
    stdout = process.stdout,
  } = {},
) {
  try {
    const [command, ...rest] = args;

    if (!command || command === "--help" || command === "-h") {
      write(stdout, helpText());
      return 0;
    }

    if (command === "--version" || command === "-v") {
      const packageJson = await readJson(packageJsonPath);
      write(stdout, packageJson.version);
      return 0;
    }

    if (command === "list") {
      if (rest.length) {
        throw new Error("The list command does not accept additional arguments.");
      }

      return await listAgents({ cwd, stderr, stdout });
    }

    if (command === "install") {
      return await installAgent(rest, { cwd, stderr, stdout });
    }

    throw new Error(`Unknown command: ${command}`);
  } catch (error) {
    write(stderr, `Error: ${error instanceof Error ? error.message : String(error)}`);
    write(stderr, "Run eveagents --help for usage.");
    return 1;
  }
}
