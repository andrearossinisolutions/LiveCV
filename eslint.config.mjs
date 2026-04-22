import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import nextVitals from "eslint-config-next/core-web-vitals.js";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url))
});

const config = [...compat.config(nextVitals)];

export default config;
