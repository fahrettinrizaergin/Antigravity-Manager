import React from "react";
import ReactDOM from "react-dom/client";

import App from './App';
import './i18n'; // Import i18n config
import "./App.css";

// 启动时显式调用 Rust 命令显示窗口
// 配合 visible:false 使用，解决启动黑屏问题
// Only call this if running in Tauri environment
if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
  import("@tauri-apps/api/core").then(({ invoke }) => {
    invoke("show_main_window").catch(console.error);
  }).catch(() => {
    // Silently fail if Tauri is not available
    console.log("Running in web mode - Tauri features disabled");
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
);
