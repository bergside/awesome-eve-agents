import {
  access,
  mkdir,
  mkdtemp,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const agentsRoot = path.join(repositoryRoot, "agents");
const registryPath = path.join(repositoryRoot, "registry.json");
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY before syncing agents.",
  );
}

async function fetchTable(table, parameters) {
  const url = new URL(`/rest/v1/${table}`, supabaseUrl);

  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, value);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Supabase ${table} export failed with HTTP ${response.status}.`,
    );
  }

  return response.json();
}

function categoryFor(rawCategory) {
  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;

  if (
    !category ||
    !slugPattern.test(category.slug) ||
    typeof category.name !== "string"
  ) {
    throw new Error("An agent has invalid category metadata.");
  }

  return {
    name: category.name,
    slug: category.slug,
  };
}

function validateRelativeFilePath(filePath) {
  if (
    typeof filePath !== "string" ||
    filePath.includes("\\") ||
    filePath.includes("\0") ||
    path.posix.isAbsolute(filePath) ||
    path.posix.normalize(filePath) !== filePath ||
    filePath.split("/").includes("..")
  ) {
    throw new Error(`Unsafe agent file path: ${String(filePath)}`);
  }
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function replaceDirectory(source, destination) {
  const backup = `${destination}.backup-${process.pid}`;

  if (!(await pathExists(destination))) {
    await rename(source, destination);
    return;
  }

  await rm(backup, { force: true, recursive: true });
  await rename(destination, backup);

  try {
    await rename(source, destination);
    await rm(backup, { force: true, recursive: true });
  } catch (error) {
    await rename(backup, destination).catch(() => {});
    throw error;
  }
}

const rawAgents = await fetchTable("eve_agents", {
  order: "slug.asc",
  select:
    "id,slug,title,summary,version,license,status,category:agent_categories!inner(slug,name)",
  status: "eq.published",
});

if (!Array.isArray(rawAgents) || !rawAgents.length) {
  throw new Error("No published Eve agents were returned.");
}

const agentIds = rawAgents.map((agent) => agent.id);
const rawFiles = await fetchTable("agent_files", {
  agent_id: `in.(${agentIds.join(",")})`,
  integration_id: "is.null",
  order: "agent_id.asc,sort_order.asc,path.asc",
  select:
    "agent_id,path,content,storage_path,mime_type,language,size_bytes,sort_order",
});

if (!Array.isArray(rawFiles)) {
  throw new Error("Supabase returned an invalid agent file response.");
}

const filesByAgent = new Map();

for (const file of rawFiles) {
  validateRelativeFilePath(file.path);

  if (file.storage_path || typeof file.content !== "string") {
    throw new Error(
      `Cannot export ${file.path}: only inline text files are supported.`,
    );
  }

  const files = filesByAgent.get(file.agent_id) ?? [];

  if (files.some((existing) => existing.path === file.path)) {
    throw new Error(`Duplicate agent file path: ${file.path}`);
  }

  files.push(file);
  filesByAgent.set(file.agent_id, files);
}

const temporaryRoot = await mkdtemp(
  path.join(repositoryRoot, ".agents-sync-"),
);
const temporaryRegistry = path.join(
  repositoryRoot,
  `.registry-sync-${process.pid}.json`,
);
const registryAgents = [];

try {
  for (const agent of rawAgents) {
    if (
      !slugPattern.test(agent.slug) ||
      typeof agent.title !== "string" ||
      typeof agent.summary !== "string"
    ) {
      throw new Error("Supabase returned invalid agent metadata.");
    }

    const files = filesByAgent.get(agent.id) ?? [];

    if (!files.length) {
      throw new Error(`${agent.slug} has no standalone files.`);
    }

    const agentDirectory = path.join(temporaryRoot, agent.slug);
    await mkdir(agentDirectory, { recursive: true });

    for (const file of files) {
      const destination = path.join(
        agentDirectory,
        ...file.path.split("/"),
      );
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, file.content, "utf8");
    }

    const category = categoryFor(agent.category);
    registryAgents.push({
      category,
      license: agent.license,
      name: agent.title,
      path: `agents/${agent.slug}`,
      slug: agent.slug,
      summary: agent.summary,
      url: `https://www.eveagents.dev/${category.slug}/${agent.slug}`,
      version: agent.version,
    });
  }

  registryAgents.sort(
    (left, right) =>
      left.category.name.localeCompare(right.category.name) ||
      left.name.localeCompare(right.name),
  );

  const registry = {
    agents: registryAgents,
    schemaVersion: 1,
    source: "https://www.eveagents.dev",
  };

  await writeFile(
    temporaryRegistry,
    `${JSON.stringify(registry, null, 2)}\n`,
    "utf8",
  );
  await replaceDirectory(temporaryRoot, agentsRoot);
  await rename(temporaryRegistry, registryPath);
} catch (error) {
  await rm(temporaryRoot, { force: true, recursive: true });
  await rm(temporaryRegistry, { force: true });
  throw error;
}

process.stdout.write(
  `Synced ${registryAgents.length} agents to ${path.relative(process.cwd(), agentsRoot)}\n`,
);
