import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
  }),
  trailingSlash: "never",
  image: {
    domains: ["storage.ayayves.com"],
  },
});
