#!/usr/bin/env node
/**
 * NMforge CLI entry point.
 */

import { main } from '../dist/index.js';

main(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
