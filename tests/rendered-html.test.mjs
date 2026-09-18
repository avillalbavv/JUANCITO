import assert from "node:assert/strict";
import test from "node:test";

async function loadPagesWorker() {
  const workerUrl = new URL("../dist/_worker.js/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("renders the electoral landing page and official portraits", async () => {
  const worker = await loadPagesWorker();

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Consulta Electoral Piribebuy \| Juancito Zalazar<\/title>/i);
  assert.match(html, /href="\/favicon-32\.png"/i);
  assert.match(html, /href="\/apple-touch-icon\.png"/i);
  assert.match(html, /Utilizar el padrón/i);
  assert.match(html, /href="\/simulador"/i);
  assert.match(html, /Utilizar el simulador de voto/i);
  assert.match(html, /Intendente[\s\S]*Lista 1/i);
  assert.match(html, /\/candidatos\/juancito-zalazar\.png/i);
  assert.match(html, /\/candidatos\/enmanuel-gini\.png/i);
});

test("opens the local voting demonstration at its first instruction step", async () => {
  const worker = await loadPagesWorker();
  const response = await worker.fetch(
    new Request("http://localhost/simulador", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Presentá tu cédula de identidad civil/i);
  assert.match(html, /SIMULADOR DEMOSTRATIVO/i);
  assert.match(html, /simulador\/instrucciones\/boleta-troquel\.png/i);
  assert.doesNotMatch(html, /Seleccionar departamento/i);
});

test("serves electoral lookups through the Pages Worker", async () => {
  const worker = await loadPagesWorker();
  const voterModule = await import("../data/padron/padron-000.json", {
    with: { type: "json" },
  });
  const voter = voterModule.default[0];

  const response = await worker.fetch(
    new Request("http://localhost/api/consulta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ documentNumber: voter.numero_ced }),
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.results.length, 1);
  assert.equal(payload.results[0].fullName, `${voter.nombre} ${voter.apellido}`.replace(/\s+/g, " ").trim());
  assert.notEqual(payload.results[0].maskedDocument, voter.numero_ced);
});

test("serves matching static assets before application routes", async () => {
  const worker = await loadPagesWorker();
  const response = await worker.fetch(
    new Request("http://localhost/assets/app.css"),
    {
      ASSETS: {
        fetch: async () => new Response("body{}", {
          status: 200,
          headers: { "content-type": "text/css" },
        }),
      },
    },
    ctx,
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "body{}");
});
