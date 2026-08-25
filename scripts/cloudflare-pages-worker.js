import application from "./server/index.js";

/**
 * Cloudflare Pages advanced-mode entry point.
 *
 * Pages gives this Worker control of every request. Serve a matching static
 * asset first and pass all remaining routes (including /api/consulta) to the
 * Vinext application Worker.
 */
export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET" || request.method === "HEAD") {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) return assetResponse;
    }

    return application.fetch(request, env, ctx);
  },
};
