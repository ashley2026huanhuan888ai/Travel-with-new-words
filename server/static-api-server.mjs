import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAiExplainResponse } from "./ai-explain-service.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const maxJsonBytes = 1_000_000;

export function createRequestListener(options = {}) {
  const root = path.resolve(options.root || projectRoot);
  const runtimeConfig = {
    mode: options.mode || process.env.AI_EXPLAIN_MODE || "mock",
    deepSeekApiKey: options.deepSeekApiKey || "",
  };
  return async function requestListener(request, response) {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    try {
      if (url.pathname === "/api/health") {
        respondJson(response, 200, {
          ok: true,
          ...getAiConfig(runtimeConfig),
        });
        return;
      }

      if (url.pathname === "/api/ai/config") {
        respondJson(response, 200, getAiConfig(runtimeConfig));
        return;
      }

      if (url.pathname === "/api/ai/runtime-key") {
        await handleRuntimeKey(request, response, runtimeConfig);
        return;
      }

      if (url.pathname === "/api/ai/explain") {
        await handleAiExplain(request, response, runtimeConfig);
        return;
      }

      await serveStaticFile(request, response, root, url.pathname);
    } catch (error) {
      respondJson(response, error.statusCode || 500, {
        code: error.code || "server-error",
        error: error.message || "Internal server error.",
      });
    }
  };
}

export function startDevServer(options = {}) {
  const port = Number(options.port || process.env.PORT || 4174);
  const host = options.host || process.env.HOST || "127.0.0.1";
  const server = createServer(createRequestListener(options));
  server.listen(port, host, () => {
    console.log(`Travel with New Words dev server: http://${host}:${port}/index.html?v=9`);
    console.log(`AI explain mode: ${process.env.AI_EXPLAIN_MODE || "mock"} / provider: deepseek`);
  });
  return server;
}

async function handleAiExplain(request, response, runtimeConfig) {
  if (request.method === "OPTIONS") {
    respondJson(response, 204, {});
    return;
  }
  if (request.method !== "POST") {
    const error = new Error("POST required.");
    error.statusCode = 405;
    throw error;
  }
  const payload = await readJsonBody(request);
  const result = await createAiExplainResponse(payload, {
    mode: runtimeConfig.mode,
    apiKey: runtimeConfig.deepSeekApiKey || process.env.DEEPSEEK_API_KEY,
  });
  respondJson(response, 200, result);
}

async function handleRuntimeKey(request, response, runtimeConfig) {
  if (request.method === "OPTIONS") {
    respondJson(response, 204, {});
    return;
  }
  if (request.method !== "POST") {
    const error = new Error("POST required.");
    error.statusCode = 405;
    throw error;
  }
  const body = await readJsonBody(request);
  const apiKey = String(body.apiKey || "").trim();
  if (apiKey.length < 16) {
    const error = new Error("DeepSeek API Key is too short.");
    error.statusCode = 400;
    error.code = "invalid-api-key";
    throw error;
  }
  runtimeConfig.deepSeekApiKey = apiKey;
  runtimeConfig.mode = "deepseek";
  respondJson(response, 200, getAiConfig(runtimeConfig));
}

function getAiConfig(runtimeConfig) {
  const envKeyConfigured = Boolean(process.env.DEEPSEEK_API_KEY);
  const runtimeKeyConfigured = Boolean(runtimeConfig.deepSeekApiKey);
  const keyConfigured = envKeyConfigured || runtimeKeyConfigured;
  return {
    aiExplainMode: runtimeConfig.mode,
    provider: "deepseek",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
    keyConfigured,
    keySource: envKeyConfigured ? "env" : runtimeKeyConfigured ? "runtime-memory" : "none",
    requiresApiKey: runtimeConfig.mode === "deepseek" && !keyConfigured,
    acceptsRuntimeKey: true,
  };
}

async function serveStaticFile(request, response, root, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    const error = new Error("GET required.");
    error.statusCode = 405;
    throw error;
  }

  const decodedPath = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  const filePath = path.resolve(root, `.${decodedPath}`);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    const error = new Error("Forbidden path.");
    error.statusCode = 403;
    throw error;
  }
  if (filePath.split(path.sep).some((part) => part === ".git" || part.startsWith("._"))) {
    const error = new Error("Not found.");
    error.statusCode = 404;
    throw error;
  }

  const fileStat = await stat(filePath).catch(() => null);
  if (!fileStat || !fileStat.isFile()) {
    const error = new Error("Not found.");
    error.statusCode = 404;
    throw error;
  }

  const body = request.method === "HEAD" ? null : await readFile(filePath);
  response.writeHead(200, {
    "content-type": contentType(filePath),
    "cache-control": "no-store",
  });
  response.end(body);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxJsonBytes) {
      const error = new Error("JSON body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("Invalid JSON body.");
    error.statusCode = 400;
    throw error;
  }
}

function respondJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(status === 204 ? "" : JSON.stringify(payload));
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".webmanifest": "application/manifest+json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    }[ext] || "application/octet-stream"
  );
}
