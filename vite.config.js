import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // GitHub Pages 部署配置
  base: process.env.NODE_ENV === "production" ? "/Igs-test-vue/" : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // 生成 source map 以便調試
    sourcemap: false,
    // 優化配置
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "pinia"],
          bootstrap: ["bootstrap"],
          gsap: ["gsap"],
        },
      },
    },
  },
});
