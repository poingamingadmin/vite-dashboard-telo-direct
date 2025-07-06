import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

  build: {
    sourcemap: process.env.NODE_ENV !== "production",
    emptyOutDir: true,
    target: "esnext",
    chunkSizeWarningLimit: 3000,
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("axios")) return "vendor-axios";
            return "vendor";
          }

          if (id.includes("/pages/")) {
            const parts = id.split("/");
            const pageIndex = parts.indexOf("pages");
            const pageName = parts[pageIndex + 1];
            return `page-${pageName}`;
          }
        },
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
});
