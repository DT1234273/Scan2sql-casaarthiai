import React, { Suspense, lazy, useCallback, useState } from 'react';
import { isBlogRoutePath } from './blogData';
import BlogRouteApp from './components/BlogRouteApp';

const FullWorkspaceApp = lazy(() => import('./App'));

interface AppLaunchOptions {
  openSignIn?: boolean;
  mountWorkspace?: boolean;
}

const LayoutStableShellFallback: React.FC = () => (
  <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col">
    <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]" />
          <div className="h-5 w-32 rounded bg-[var(--bg-subtle)]" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-[var(--bg-subtle)]" />
      </div>
    </header>
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1">
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 min-h-[420px] space-y-4">
        <div className="h-4 w-40 rounded bg-[var(--bg-subtle)]" />
        <div className="h-9 w-2/3 max-w-xl rounded bg-[var(--bg-subtle)]" />
        <div className="h-4 w-full max-w-2xl rounded bg-[var(--bg-subtle)]" />
        <div className="h-4 w-5/6 max-w-xl rounded bg-[var(--bg-subtle)]" />
      </div>
    </main>
  </div>
);

export const RootRouter: React.FC = () => {
  const initialPathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const [useBlogShell, setUseBlogShell] = useState<boolean>(() => isBlogRoutePath(initialPathname));
  const [launchOptions, setLaunchOptions] = useState<AppLaunchOptions>({});

  const handleEnterFullApp = useCallback((targetPath: string, options?: AppLaunchOptions) => {
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setLaunchOptions(options || {});
    setUseBlogShell(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (useBlogShell) {
    return <BlogRouteApp initialPath={initialPathname} onEnterFullApp={handleEnterFullApp} />;
  }

  return (
    <Suspense fallback={<LayoutStableShellFallback />}>
      <FullWorkspaceApp
        initialOpenSignIn={launchOptions.openSignIn}
        initialMountWorkspace={launchOptions.mountWorkspace}
      />
    </Suspense>
  );
};

export default RootRouter;
