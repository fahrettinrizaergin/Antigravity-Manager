import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import ApiProxy from './pages/ApiProxy';
import Monitor from './pages/Monitor';
import ThemeManager from './components/common/ThemeManager';
import { useEffect } from 'react';
import { useConfigStore } from './stores/useConfigStore';
import { useAccountStore } from './stores/useAccountStore';
import { useTranslation } from 'react-i18next';

// Check if running in Tauri environment
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'accounts',
        element: <Accounts />,
      },
      {
        path: 'api-proxy',
        element: <ApiProxy />,
      },
      {
        path: 'monitor',
        element: <Monitor />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  const { config, loadConfig } = useConfigStore();
  const { fetchCurrentAccount, fetchAccounts } = useAccountStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Sync language from config
  useEffect(() => {
    if (config?.language) {
      i18n.changeLanguage(config.language);
    }
  }, [config?.language, i18n]);

  // Listen for tray events (only in Tauri environment)
  useEffect(() => {
    if (!isTauri) return;

    const unlistenPromises: Promise<() => void>[] = [];

    const setupListeners = async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        
        // 监听托盘切换账号事件
        unlistenPromises.push(
          listen('tray://account-switched', () => {
            console.log('[App] Tray account switched, refreshing...');
            fetchCurrentAccount();
            fetchAccounts();
          })
        );

        // 监听托盘刷新事件
        unlistenPromises.push(
          listen('tray://refresh-current', () => {
            console.log('[App] Tray refresh triggered, refreshing...');
            fetchCurrentAccount();
            fetchAccounts();
          })
        );
      } catch (e) {
        console.error('Failed to setup event listeners:', e);
      }
    };

    setupListeners();

    // Cleanup
    return () => {
      Promise.all(unlistenPromises).then(unlisteners => {
        unlisteners.forEach(unlisten => unlisten());
      });
    };
  }, [fetchCurrentAccount, fetchAccounts]);

  return (
    <>
      <ThemeManager />
      <RouterProvider router={router} />
    </>
  );
}

export default App;