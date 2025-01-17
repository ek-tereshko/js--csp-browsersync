#!/usr/bin/env node
"use strict";

const bs = require("browser-sync").create();
const CspParse = require("csp-parse");

const target = process.argv[process.argv.length - 1];
if (!target.startsWith("http")) {
  process.exit(console.log("Pass url as last argument"));
}

const port = process.env.BROWSER_SYNC_PORT || 10000;
const uiPort = process.env.BROWSER_SYNC_UI_PORT || 10001;

bs.init({
  proxy: {
    target,
    proxyRes: [
      (proxyRes, req, res) => {
        const cspHeader = proxyRes.headers["content-security-policy"];
        if (!cspHeader) return;

        const newCsp = new CspParse(cspHeader);

        newCsp.add("script-src", "'unsafe-inline'");
        newCsp.add("script-src", "'sha256-ThhI8UaSFEbbl6cISiZpnJ4Z44uNSq2tPKgyRTD3LyU='");
        const newCspString = newCsp.toString();

        proxyRes.headers["content-security-policy"] = newCspString;
      }
    ]
  },
  port,
  ui: {
    port: uiPort,
  }
});
