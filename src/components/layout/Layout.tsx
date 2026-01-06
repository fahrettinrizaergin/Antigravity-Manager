import { Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import BackgroundTaskRunner from '../common/BackgroundTaskRunner';
import ToastContainer from '../common/ToastContainer';

// Check if running in Tauri environment
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

function Layout() {
    const handleDragStart = async () => {
        if (isTauri) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                getCurrentWindow().startDragging();
            } catch (e) {
                console.error('Failed to start dragging:', e);
            }
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#FAFBFC] dark:bg-base-300">
            {/* 全局窗口拖拽区域 - 使用 JS 手动触发拖拽，解决 HTML 属性失效问题 */}
            {/* Only show drag region in Tauri environment */}
            {isTauri && (
                <div
                    className="fixed top-0 left-0 right-0 h-9"
                    style={{
                        zIndex: 9999,
                        backgroundColor: 'rgba(0,0,0,0.001)',
                        cursor: 'default',
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                    }}
                    data-tauri-drag-region
                    onMouseDown={handleDragStart}
                />
            )}
            {/* Web mode notification banner */}
            {!isTauri && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 flex items-center justify-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-300">
                        Running in web mode. Management features are limited. Download the desktop app for full functionality.
                    </span>
                </div>
            )}
            <BackgroundTaskRunner />
            <ToastContainer />
            <Navbar />
            <main className="flex-1 overflow-hidden flex flex-col relative">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
