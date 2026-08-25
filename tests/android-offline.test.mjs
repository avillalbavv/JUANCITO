import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const webPadronDirectory = new URL("../data/padron/", import.meta.url);
const androidPadronDirectory = new URL(
  "../android-studio/app/src/main/assets/padron/",
  import.meta.url,
);

async function digest(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

test("the Android app contains the complete local electoral roll", async () => {
  const webFiles = (await readdir(webPadronDirectory)).filter((name) => name.endsWith(".json")).sort();
  const androidFiles = (await readdir(androidPadronDirectory)).filter((name) => name.endsWith(".json")).sort();

  assert.deepEqual(androidFiles, webFiles);

  let records = 0;
  for (const fileName of webFiles) {
    const webFile = new URL(fileName, webPadronDirectory);
    const androidFile = new URL(fileName, androidPadronDirectory);
    assert.equal(await digest(androidFile), await digest(webFile), `${fileName} differs`);
    records += JSON.parse(await readFile(androidFile, "utf8")).length;
  }

  assert.equal(records, 24_152);
});

test("the Android experience is packaged locally and requests no Internet permission", async () => {
  const manifest = await readFile(
    new URL("../android-studio/app/src/main/AndroidManifest.xml", import.meta.url),
    "utf8",
  );
  const activity = await readFile(
    new URL(
      "../android-studio/app/src/main/java/py/juancito/consultaelectoral/MainActivity.kt",
      import.meta.url,
    ),
    "utf8",
  );
  const html = await readFile(
    new URL("../android-studio/app/src/main/assets/index.html", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(manifest, /android\.permission\.INTERNET/);
  assert.match(activity, /file:\/\/\/android_asset\/index\.html/);
  assert.match(activity, /assets\.list\("padron"\)/);
  assert.match(html, /src="app\.js"/);
  assert.match(html, /href="styles\.css"/);
  assert.doesNotMatch(html, /(?:src|href)="https?:\/\//);
});
