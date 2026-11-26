import React, { useEffect, useState } from 'react';
import {
  BRAND_NAME,
  DEFAULT_CA_AUTHOR,
  RESOURCE_ARTICLES,
  SITE_DOMAIN,
  findBlogArticleByPath,
  getCanonicalBlogPath,
  isBlogRoutePath,
  syncBlogDocumentSeoTags,
} from '../blogData';

interface BlogRouteAppProps {
  initialPath: string;
  onEnterFullApp: (targetPath: string, options?: { openSignIn?: boolean; mountWorkspace?: boolean }) => void;
}

const ACCENT_OPTIONS = [
  { id: 'teal', label: 'Teal', swatch: '#0F766E' },
  { id: 'cobalt', label: 'Cobalt', swatch: '#2563EB' },
  { id: 'copper', label: 'Copper', swatch: '#B45309' },
] as const;

export const BlogRouteApp: React.FC<BlogRouteAppProps> = ({ initialPath, onEnterFullApp }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => getCanonicalBlogPath(initialPath));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ledgersutra-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  const [accentTheme, setAccentTheme] = useState<'teal' | 'cobalt' | 'copper'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ledgersutra-accent');
      if (saved === 'teal' || saved === 'cobalt' || saved === 'copper') return saved;
    }
    return 'teal';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ledgersutra-theme', theme);
    } catch {
      // Ignore storage failures in private browsing
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentTheme);
    try {
      localStorage.setItem('ledgersutra-accent', accentTheme);
    } catch {
      // Ignore storage failures
    }
  }, [accentTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canonical = getCanonicalBlogPath(currentPath);
      if (window.location.pathname !== canonical) {
        window.history.replaceState({}, '', canonical);
      }
    }
    syncBlogDocumentSeoTags(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const onPopState = () => {
      const next = window.location.pathname || '/';
      if (isBlogRoutePath(next)) {
        setCurrentPath(getCanonicalBlogPath(next));
        setIsMobileMenuOpen(false);
      } else {
        onEnterFullApp(next);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [onEnterFullApp]);

  const navigate = (targetPath: string) => {
    setIsMobileMenuOpen(false);
    if (isBlogRoutePath(targetPath)) {
      const canonical = getCanonicalBlogPath(targetPath);
      if (typeof window !== 'undefined' && window.location.pathname !== canonical) {
        window.history.pushState({}, '', canonical);
      }
      setCurrentPath(canonical);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onEnterFullApp(targetPath);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      navigate(targetPath);
    }
  };

  const article = findBlogArticleByPath(currentPath);

  const renderBreadcrumb = (currentLabel: string, parent?: { name: string; path: string }) => (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2"
    >
      <a
        href="/"
        onClick={(e) => handleLinkClick(e, '/')}
        className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
      >
        Home
      </a>
      <span aria-hidden="true">/</span>
      {parent && (
        <>
          <a
            href={parent.path}
            onClick={(e) => handleLinkClick(e, parent.path)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
          >
            {parent.name}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span className="text-[var(--text-main)] font-medium" aria-current="page">
        {currentLabel}
      </span>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex flex-col">
      {/* Header matching full workspace header geometry to prevent CLS */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-header)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            aria-label="CA Saarthi AI Home"
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xl"
          >
            <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-sky-400/50 via-amber-400/50 to-indigo-500/50 shadow-sm group-hover:shadow-md transition-all duration-200 shrink-0">
              <img
                src="/ca-saarthi-icon.svg"
                alt="CA Saarthi AI logo"
                width={40}
                height={40}
                decoding="async"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] object-contain block"
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-display font-extrabold text-base sm:text-[21px] tracking-tight whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5">
                <span className="inline-flex items-baseline">
                  <span className="text-[var(--text-main)]">C</span>
                  <span className="bg-gradient-to-b from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    A
                  </span>
                </span>
                <span className="text-[var(--text-main)]">Saarthi</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] sm:text-xs font-black tracking-wider bg-cyan-500/15 border border-cyan-600/35">
                  <span className="text-teal-800 dark:text-cyan-300">AI</span>
                </span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mt-0.5">
                Bill Scanning &amp; Data Automation
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6 min-w-0">
            <nav aria-label="Primary site navigation" className="flex items-center gap-5 text-xs font-medium">
              {[
                { path: '/', label: 'Home', active: false },
                { path: '/app', label: 'Workspace', active: false },
                { path: '/pricing', label: 'Pricing', active: false },
                { path: '/blog', label: 'Blog', active: true },
                { path: '/api-docs', label: 'API', active: false },
              ].map((navItem) => (
                <a
                  key={navItem.path}
                  href={navItem.path}
                  onClick={(e) => handleLinkClick(e, navItem.path)}
                  className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    navItem.active
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {navItem.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onEnterFullApp(currentPath, { openSignIn: true })}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
              <span>Sign in</span>
            </button>

            <div
              role="group"
              aria-label="Select UI Accent Color"
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] shrink-0"
            >
              {ACCENT_OPTIONS.map((acc) => {
                const isSelected = accentTheme === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setAccentTheme(acc.id)}
                    title={`Switch UI Accent to ${acc.label}`}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/40"
                      style={{ backgroundColor: acc.swatch }}
                    />
                    <span className="hidden lg:inline">{acc.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label="Toggle Light/Dark Theme"
              className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-main)] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {theme === 'light' ? (
                <>
                  <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Mobile Navigation Menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)] cursor-pointer shrink-0"
            >
              {isMobileMenuOpen ? (
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-4 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Pages &amp; Resources
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/app', label: 'Workspace' },
                  { path: '/pricing', label: 'Pricing' },
                  { path: '/blog', label: 'CA Blog' },
                  { path: '/api-docs', label: 'REST API' },
                  { path: '/contact', label: 'Book Demo' },
                ].map((navItem) => {
                  const isActive = navItem.path === '/blog';
                  return (
                    <a
                      key={navItem.path}
                      href={navItem.path}
                      onClick={(e) => handleLinkClick(e, navItem.path)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--border-color)]'
                      }`}
                    >
                      {navItem.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
              <span className="text-xs font-semibold text-[var(--text-muted)]">UI Accent Theme</span>
              <div className="flex items-center gap-1.5">
                {ACCENT_OPTIONS.map((acc) => {
                  const isSelected = accentTheme === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setAccentTheme(acc.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--border-color)]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: acc.swatch }}
                      />
                      <span>{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 space-y-8 sm:space-y-10">
        {article ? (
          <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-8">
            {renderBreadcrumb(article.title, { name: 'Blog', path: '/blog' })}
            <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Published {article.publishedDate} · Updated {article.modifiedDate || article.publishedDate}
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold text-[var(--text-main)]">{article.title}</h1>
              <p className="text-sm text-[var(--text-muted)] max-w-3xl">{article.summary}</p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-[var(--text-main)]">
                    By{' '}
                    <a
                      href="/about"
                      onClick={(e) => handleLinkClick(e, '/about')}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {DEFAULT_CA_AUTHOR.name}
                    </a>{' '}
                    <span className="font-normal text-[var(--text-muted)]">({DEFAULT_CA_AUTHOR.credentials})</span>
                  </div>
                  <div className="text-[var(--text-muted)]">{DEFAULT_CA_AUTHOR.bio}</div>
                </div>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  About {BRAND_NAME} →
                </a>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Key Takeaways for CA Firms
              </div>
              <ul className="space-y-1.5 text-xs text-[var(--text-main)]">
                {article.keyTakeaways.map((kt, i) => (
                  <li key={i}>• {kt}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 max-w-3xl">
              {article.sections.map((sec, i) => (
                <section key={i} className="space-y-3">
                  <h2 className="font-display text-xl font-bold text-[var(--text-main)]">{sec.heading}</h2>
                  {sec.paragraphs.map((p, j) => (
                    <p key={j} className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {sec.checklist && (
                    <ul className="space-y-1.5 pl-4 text-sm text-[var(--text-main)]">
                      {sec.checklist.map((c, k) => (
                        <li key={k}>✓ {c}</li>
                      ))}
                    </ul>
                  )}
                  {sec.externalSources && sec.externalSources.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] leading-relaxed space-y-1">
                      <div className="font-semibold text-[var(--text-main)]">Official External Source</div>
                      {sec.externalSources.map((src, idx) => (
                        <p key={idx} className="break-words">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-700"
                          >
                            {src.label} ↗
                          </a>
                          {src.sourceName ? (
                            <span className="text-[var(--text-muted)]"> — {src.sourceName}</span>
                          ) : null}
                        </p>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] leading-relaxed">
                <strong className="text-[var(--text-main)]">Related {BRAND_NAME} Workflows:</strong> Automate{' '}
                <a
                  href="/gst-invoice-to-tally"
                  onClick={(e) => handleLinkClick(e, '/gst-invoice-to-tally')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  GST Invoice to TallyPrime XML Import
                </a>
                , run 6-status{' '}
                <a
                  href="/gstr-2b-reconciliation-excel"
                  onClick={(e) => handleLinkClick(e, '/gstr-2b-reconciliation-excel')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  GSTR-2B Reconciliation in Excel
                </a>
                , or compare{' '}
                <a
                  href="/pricing"
                  onClick={(e) => handleLinkClick(e, '/pricing')}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  CA Firm Pricing Plans
                </a>
                .
              </div>
            </div>

            {article.faqs.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                <h2 className="font-display text-xl font-bold text-[var(--text-main)]">
                  Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5"
                    >
                      <h3 className="text-sm font-bold text-[var(--text-main)]">{faq.question}</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
              <a
                href="/blog"
                onClick={(e) => handleLinkClick(e, '/blog')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                ← Back to All Blog Articles
              </a>
              <a
                href="/app"
                onClick={(e) => handleLinkClick(e, '/app')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Try the live workspace
              </a>
            </div>
          </article>
        ) : (
          <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 space-y-6">
            {renderBreadcrumb('Blog')}
            <div>
              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                CA Practice Blog &amp; Guides
              </div>
              <h1 className="font-display text-3xl font-bold text-[var(--text-main)] mt-1">
                GST &amp; TallyPrime Guides for CA Firms
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {RESOURCE_ARTICLES.map((art) => (
                <a
                  key={art.slug}
                  href={art.path}
                  onClick={(e) => handleLinkClick(e, art.path)}
                  className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] hover:border-indigo-500/50 transition-colors flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="text-xs text-[var(--text-muted)]">
                      {art.category} · {art.readTime} · {art.publishedDate}
                    </div>
                    <h2 className="text-base font-bold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {art.title}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{art.summary}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline text-left">
                    Read Full Article →
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Lightweight CTA card matching App.tsx deferred workspace CTA */}
        <section
          id="live-ocr-workspace"
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 scroll-mt-20"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Interactive CA Invoice OCR &amp; TallyPrime Sandbox
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-main)]">
              Ready to test GSTIN validation, Tally XML export, or GSTR-2B matching?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Upload a purchase PDF or image bill in our live workspace to verify 15-digit GSTIN Mod-36 checksums and export TallyPrime XML vouchers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onEnterFullApp(currentPath, { mountWorkspace: true })}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Try the live workspace
            </button>
            <a
              href="/app"
              onClick={(e) => handleLinkClick(e, '/app')}
              className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] cursor-pointer"
            >
              Open Full Workspace (/app) →
            </a>
          </div>
        </section>
      </main>

      {/* Footer matching LedgerSutraFooter */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="relative p-0.5 rounded-2xl bg-gradient-to-br from-sky-400/50 via-amber-400/50 to-indigo-500/50 shadow-sm shrink-0">
                  <img
                    src="/ca-saarthi-icon.svg"
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] object-contain block"
                  />
                </div>
                <div>
                  <a
                    href="/"
                    onClick={(e) => handleLinkClick(e, '/')}
                    className="font-display font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-1.5"
                  >
                    <span className="inline-flex items-baseline">
                      <span className="text-[var(--text-main)]">C</span>
                      <span className="bg-gradient-to-b from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                        A
                      </span>
                    </span>
                    <span className="text-[var(--text-main)]">Saarthi</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-black tracking-wider bg-cyan-500/15 border border-cyan-600/35">
                      <span className="text-teal-800 dark:text-cyan-300">AI</span>
                    </span>
                  </a>
                  <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] mt-0.5">
                    Bill Scanning &amp; Data Automation
                  </div>
                  <a
                    href="/"
                    onClick={(e) => handleLinkClick(e, '/')}
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline block mt-0.5"
                  >
                    {SITE_DOMAIN}
                  </a>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Built for Indian Chartered Accountants — automated GST invoice extraction, English &amp; Hindi bill OCR, TallyPrime XML export, and GSTR-2B reconciliation.
              </p>
              <div className="text-xs text-[var(--text-main)] font-medium">
                Support:{' '}
                <a
                  href="mailto:support@casaarthiai.in"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  support@casaarthiai.in
                </a>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="/app"
                  onClick={(e) => handleLinkClick(e, '/app')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Start Free Trial
                </a>
                <a
                  href="/api-docs"
                  onClick={(e) => handleLinkClick(e, '/api-docs')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold cursor-pointer"
                >
                  REST API Docs
                </a>
                <a
                  href="/hi"
                  onClick={(e) => handleLinkClick(e, '/hi')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                >
                  हिंदी (/hi)
                </a>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[var(--text-main)]">Platform &amp; Legal Trust</h3>
              <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                <li>
                  <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')} className="font-semibold text-[var(--text-main)] hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')} className="font-semibold text-[var(--text-main)] hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/data-deletion" onClick={(e) => handleLinkClick(e, '/data-deletion')} className="font-semibold text-[var(--text-main)] hover:underline">
                    Data Deletion Policy
                  </a>
                </li>
                <li>
                  <a href="/security" onClick={(e) => handleLinkClick(e, '/security')} className="hover:underline">
                    Security &amp; Data Isolation
                  </a>
                </li>
                <li>
                  <a href="/pricing" onClick={(e) => handleLinkClick(e, '/pricing')} className="hover:underline">
                    Pricing &amp; CA Firm Pilots
                  </a>
                </li>
                <li>
                  <a href="/faq" onClick={(e) => handleLinkClick(e, '/faq')} className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:underline">
                    Contact &amp; Book a Demo
                  </a>
                </li>
                <li>
                  <a href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="hover:underline">
                    About CA Saarthi AI
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[var(--text-main)]">CA &amp; GST Workflows</h3>
              <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                <li>
                  <a href="/gst-invoice-to-tally" onClick={(e) => handleLinkClick(e, '/gst-invoice-to-tally')} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    GST Invoice to TallyPrime XML
                  </a>
                </li>
                <li>
                  <a href="/gstr-2b-reconciliation-excel" onClick={(e) => handleLinkClick(e, '/gstr-2b-reconciliation-excel')} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    GSTR-2B Reconciliation in Excel
                  </a>
                </li>
                <li>
                  <a href="/bulk-invoice-processing-for-ca" onClick={(e) => handleLinkClick(e, '/bulk-invoice-processing-for-ca')} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    Bulk Invoice Processing for CA
                  </a>
                </li>
                <li>
                  <a href="/invoice-ocr-for-ca" onClick={(e) => handleLinkClick(e, '/invoice-ocr-for-ca')} className="hover:underline">
                    Invoice OCR for CA Firms
                  </a>
                </li>
                <li>
                  <a href="/gst-invoice-data-extraction" onClick={(e) => handleLinkClick(e, '/gst-invoice-data-extraction')} className="hover:underline">
                    GST Invoice Data Extraction
                  </a>
                </li>
                <li>
                  <a href="/pdf-invoice-to-excel" onClick={(e) => handleLinkClick(e, '/pdf-invoice-to-excel')} className="hover:underline">
                    PDF Invoice to Excel (.XLSX)
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[var(--text-main)]">CA Blog &amp; Guides</h3>
              <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                <li>
                  <a href="/blog" onClick={(e) => handleLinkClick(e, '/blog')} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    All Blog Articles &amp; Tutorials →
                  </a>
                </li>
                {RESOURCE_ARTICLES.map((art) => (
                  <li key={art.slug}>
                    <a
                      href={art.path}
                      onClick={(e) => handleLinkClick(e, art.path)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline line-clamp-1 block"
                    >
                      {art.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border-color)] space-y-3 text-xs text-[var(--text-muted)]">
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] leading-relaxed">
              <strong className="text-[var(--text-main)]">Professional Compliance Disclaimer:</strong> {BRAND_NAME} is a
              document-processing and accounting workflow support tool. Chartered Accountants and users should review and
              verify extracted data before importing into TallyPrime or filing official GST returns.
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <span>
                © {new Date().getFullYear()} {BRAND_NAME} (
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:underline">
                  casaarthiai.in
                </a>
                ). Contact: support@casaarthiai.in
              </span>
              <span>
                Hybrid Cloud &amp; Local OCR · Client-Scoped Isolation · TallyPrime XML · GSTR-2B · SQL &amp; XLSX
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogRouteApp;
