import { simplifySlug, slugifyFilePath } from "@quartz-community/utils/path"

const MARIMO_ISLANDS_VERSION = "0.23.9"
const MARIMO_CDN_ORIGIN = "https://cdn.jsdelivr.net"
const MARIMO_PACKAGE_ROOT = `${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist`
const MARIMO_RUNTIME_URL = `${MARIMO_PACKAGE_ROOT}/main.js`
const MARIMO_STYLE_URL = `${MARIMO_PACKAGE_ROOT}/style.css`
const PYODIDE_VERSION = "0.27.7"

function marimoRoutes(ctx) {
  return (ctx?.allFiles ?? [])
    .filter((fp) => fp.endsWith(".marimo.py"))
    .map((fp) => simplifySlug(slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))))
    .map((slug) => (slug === "/" ? "/" : `/${slug}`))
}

export function createMarimoLoader(routes = []) {
  return `
(function() {
  if (window.__ewanMarimoLoader) {
    window.__ewanMarimoLoader.ensure();
    return;
  }

  var marimoRoutes = new Set(${JSON.stringify(routes)});
  var runtimeUrl = ${JSON.stringify(MARIMO_RUNTIME_URL)};
  var styleUrl = ${JSON.stringify(MARIMO_STYLE_URL)};
  var pyodideRoot = ${JSON.stringify(`${MARIMO_CDN_ORIGIN}/pyodide/v${PYODIDE_VERSION}/full/`)};
  var exportContextSource = "ewan-quartz-marimo";
  var mountedRoute = null;
  var readyObserver = null;
  var readyTimeout = null;
  var hoverTimer = null;
  var mountedPage = null;

  function normalizedPath(value) {
    var pathname;
    try {
      pathname = new URL(value, window.location.href).pathname;
    } catch (_) {
      pathname = String(value || "");
    }
    try { pathname = decodeURIComponent(pathname); } catch (_) {}
    pathname = pathname.replace(/\\.html$/, "").replace(/\\/index$/, "");
    if (pathname.length > 1) pathname = pathname.replace(/\\/$/, "");
    return pathname || "/";
  }

  function isMarimoLink(anchor) {
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return false;
    var url;
    try { url = new URL(anchor.href, window.location.href); } catch (_) { return false; }
    return url.origin === window.location.origin && marimoRoutes.has(normalizedPath(url.pathname));
  }

  function ensureConnection(origin) {
    if (document.querySelector('link[data-ewan-marimo-origin="' + origin + '"]')) return;
    var link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoOrigin = origin;
    link.dataset.persist = "true";
    document.head.appendChild(link);
  }

  function ensureHint(rel, href, as) {
    var existing = document.querySelector('link[data-ewan-marimo-href="' + href + '"]');
    if (existing) return existing;
    var link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (as) link.as = as;
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoHref = href;
    link.dataset.persist = "true";
    document.head.appendChild(link);
    return link;
  }

  function preload(full = false) {
    if (!full && (navigator.connection?.saveData || /(?:slow-)?2g/.test(navigator.connection?.effectiveType || ""))) return;
    ensureConnection(${JSON.stringify(MARIMO_CDN_ORIGIN)});
    ensureConnection("https://wasm.marimo.app");
    ensureHint("modulepreload", runtimeUrl);

    ensureHint("preload", styleUrl, "style");
    if (full && !navigator.connection?.saveData) {
      ensureHint("prefetch", pyodideRoot + "pyodide.asm.wasm", "fetch");
      ensureHint("prefetch", pyodideRoot + "python_stdlib.zip", "fetch");
    }
  }

  function syncExportTrust(hasIslands) {
    var current = window.__MARIMO_EXPORT_CONTEXT__;
    if (hasIslands) {
      if (current?.trusted === true) return;
      Object.defineProperty(window, "__MARIMO_EXPORT_CONTEXT__", {
        value: Object.freeze({ trusted: true, source: exportContextSource }),
        writable: false,
        configurable: true,
      });
      return;
    }
    if (current?.source === exportContextSource) delete window.__MARIMO_EXPORT_CONTEXT__;
  }

  function ensureStyle() {
    var link = document.querySelector('link[data-ewan-marimo-href="' + styleUrl + '"]');
    if (link) {
      link.disabled = false;
      link.rel = "stylesheet";
      link.removeAttribute("as");
      link.dataset.ewanMarimoCss = "true";
      return;
    }
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = styleUrl;
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoCss = "true";
    link.dataset.ewanMarimoHref = styleUrl;
    link.dataset.persist = "true";
    document.head.appendChild(link);
  }

  function setState(page, state, message) {
    if (!page?.isConnected) return;
    page.dataset.marimoState = state;
    var label = page.querySelector(".marimo-loading-text");
    if (label && message) label.textContent = message;
  }

  function clearReadiness() {
    readyObserver?.disconnect();
    readyObserver = null;
    window.clearTimeout(readyTimeout);
    readyTimeout = null;
  }

  function watchReadiness(page) {
    clearReadiness();
    var update = function() {
      var error = page.querySelector('marimo-island[data-status="error"]');
      var cells = Array.from(page.querySelectorAll('marimo-island[data-reactive="true"]'));
      var ready = cells.length > 0 && cells.every(function(cell) { return cell.dataset.status === "idle"; });
      if (error) {
        setState(page, "error", "Python could not start on this page.");
        return true;
      }
      if (ready) {
        setState(page, "ready", "Interactive Python ready.");
        return true;
      }
      return false;
    };
    if (update()) return;
    readyObserver = new MutationObserver(function() {
      if (update()) clearReadiness();
    });
    readyObserver.observe(page, { subtree: true, attributes: true, attributeFilter: ["data-status"] });
    readyTimeout = window.setTimeout(function() {
      if (!update()) setState(page, "slow", "Still starting Python; the first visit is the slowest.");
    }, 60000);
  }

  function ensureScript(page) {
    var existing = document.querySelector("script[data-ewan-marimo-runtime]");
    if (existing) return;
    var script = document.createElement("script");
    script.type = "module";
    script.src = runtimeUrl;
    script.crossOrigin = "anonymous";
    script.dataset.ewanMarimoRuntime = "true";
    script.dataset.persist = "true";
    script.addEventListener("error", function() {
      script.remove();
      setState(document.querySelector(".marimo-notebook-page"), "error", "Python runtime failed to download. Reload to retry.");
    });
    document.head.appendChild(script);
  }

  function hardNavigateCurrentPage() {
    // marimo 0.23.9 owns one global Pyodide session. A second, different
    // notebook needs a fresh browsing context; make that boundary automatic.
    window.location.replace(window.location.href);
  }

  function ensure() {
    var page = document.querySelector(".marimo-notebook-page");
    var hasIslands = Boolean(page && page.querySelector("marimo-island"));
    syncExportTrust(hasIslands);
    if (!hasIslands) {
      clearReadiness();
      var css = document.querySelector("link[data-ewan-marimo-css]");
      if (css) css.disabled = true;
      return;
    }

    var route = normalizedPath(window.location.pathname);
    if (mountedPage && mountedPage !== page && customElements.get("marimo-island")) {
      hardNavigateCurrentPage();
      return;
    }
    mountedRoute = route;
    mountedPage = page;
    preload(true);
    ensureStyle();
    watchReadiness(page);
    ensureScript(page);
  }

  document.addEventListener("pointerover", function(event) {
    var anchor = event.target?.closest?.("a[href]");
    clearTimeout(hoverTimer);
    if (isMarimoLink(anchor)) hoverTimer = setTimeout(function() { preload(); }, 120);
  }, { passive: true, capture: true });
  document.addEventListener("pointerout", function(event) {
    var anchor = event.target?.closest?.("a[href]");
    if (anchor && !anchor.contains(event.relatedTarget)) clearTimeout(hoverTimer);
  }, { passive: true, capture: true });
  document.addEventListener("focusin", function(event) {
    var anchor = event.target?.closest?.("a[href]");
    if (isMarimoLink(anchor)) preload();
  }, true);
  document.addEventListener("click", function(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var anchor = event.target?.closest?.("a[href]");
    if (!mountedRoute || !isMarimoLink(anchor)) return;
    var targetRoute = normalizedPath(anchor.href);
    if (targetRoute === mountedRoute || !customElements.get("marimo-island")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(anchor.href);
  }, true);
  document.addEventListener("nav", function() {
    window.setTimeout(ensure, 0);
  });

  window.__ewanMarimoLoader = { ensure: ensure, preload: preload };
  ensure();
})();
`
}

export default function MarimoResources() {
  return {
    name: "MarimoResources",
    textTransform(_ctx, src) {
      return src
    },
    externalResources(ctx) {
      return {
        js: [
          {
            script: createMarimoLoader(marimoRoutes(ctx)),
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
