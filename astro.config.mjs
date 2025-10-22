import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://<username>.github.io",
  base: "/myyoungji_new/",
  trailingSlash: "always",
  integrations: [tailwind()]
});
