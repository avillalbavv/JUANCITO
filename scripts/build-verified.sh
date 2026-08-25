#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

command -v timeout || {
  echo "build-verified.sh requires GNU timeout." >&2
  exit 69
}

vinext="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

echo "Running bounded vinext build..."
rm -rf "${SITES_PROJECT_ROOT}/dist"
timeout \
  --signal=TERM \
  --kill-after="${SITES_BUILD_KILL_AFTER:-10s}" \
  "${SITES_BUILD_TIMEOUT:-3m}" \
  "${vinext}" build

# Cloudflare Pages publishes the configured output directory as-is. Vinext
# emits static assets under dist/client and its Worker under dist/server, so
# expose both at the layout expected by Pages advanced mode:
#   dist/*                 -> public assets
#   dist/_worker.js/*      -> Pages wrapper plus Worker modules
pages_output="${SITES_PROJECT_ROOT}/dist"
mkdir -p "${pages_output}/_worker.js/server"
cp -R "${pages_output}/client/." "${pages_output}/"
cp -R "${pages_output}/server/." "${pages_output}/_worker.js/server/"
cp "${SITES_PROJECT_ROOT}/scripts/cloudflare-pages-worker.js" \
  "${pages_output}/_worker.js/index.js"
cp "${SITES_PROJECT_ROOT}/scripts/cloudflare-pages.assetsignore" \
  "${pages_output}/.assetsignore"

test -f "${pages_output}/_worker.js/index.js"
find "${pages_output}/assets" -maxdepth 1 -name '*.css' -print -quit | grep -q .

echo "Cloudflare Pages output ready in dist/."
