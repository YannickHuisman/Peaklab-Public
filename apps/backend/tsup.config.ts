import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
  bundle: true,
  external: ['@supabase/supabase-js', '@supabase/auth-js', 'express', 'cors', 'dotenv'],
});
