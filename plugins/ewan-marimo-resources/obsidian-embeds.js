export function watchObsidianEmbeds(page) {
  const controller = new AbortController()
  const pending = new WeakMap()
  const cache = new Map()
  let serial = 0
  async function hydrate(embed) {
    const href = embed.dataset.obsidianEmbed
    const previous = pending.get(embed)
    if (previous?.href === href && (previous.loading || previous.result?.parentElement === embed))
      return
    const job = { href, loading: true }
    pending.set(embed, job)
    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return
    const ancestors = []
    for (let p = embed.parentElement; p; p = p.parentElement) {
      if (p.dataset.obsidianEmbed)
        ancestors.push(new URL(p.dataset.obsidianEmbed, location.href).href)
    }
    if (ancestors.length >= 4 || ancestors.includes(url.href)) return
    try {
      const resource = new URL(url)
      resource.hash = ""
      if (!cache.has(resource.href)) {
        cache.set(
          resource.href,
          fetch(resource, { signal: controller.signal }).then(async (response) => {
            if (!response.ok) throw new Error(`Embed HTTP ${response.status}`)
            return { text: await response.text(), url: response.url }
          }),
        )
      }
      const response = await cache.get(resource.href)
      if (!embed.isConnected || controller.signal.aborted || pending.get(embed) !== job) return
      const doc = new DOMParser().parseFromString(response.text, "text/html")
      const article = doc.querySelector("article")
      // Notebook embeds stay navigable links: mounting another kernel in this
      // document would violate the islands runtime's one-notebook boundary.
      if (!article || article.querySelector("marimo-island")) return
      const result = document.createElement("span")
      result.className = "transclude-inner"
      if (url.hash) {
        const target = doc.getElementById(decodeURIComponent(url.hash.slice(1)))
        if (!target || !article.contains(target)) return
        result.append(target.cloneNode(true))
        if (/^H[1-6]$/.test(target.tagName)) {
          for (let next = target.nextElementSibling; next; next = next.nextElementSibling) {
            if (/^H[1-6]$/.test(next.tagName) && next.tagName <= target.tagName) break
            result.append(next.cloneNode(true))
          }
        }
      } else {
        result.append(...Array.from(article.childNodes, (node) => node.cloneNode(true)))
      }
      result.querySelectorAll("script, marimo-island").forEach((node) => node.remove())
      for (const el of result.querySelectorAll("[href], [src], [poster], [data-obsidian-embed]")) {
        for (const attr of ["href", "src", "poster", "data-obsidian-embed"]) {
          if (el.hasAttribute(attr))
            el.setAttribute(attr, new URL(el.getAttribute(attr), response.url).href)
        }
      }
      const prefix = `marimo-embed-${++serial}-`
      for (const el of result.querySelectorAll("[id]")) el.id = prefix + el.id
      job.result = result
      embed.replaceChildren(result)
      embed.dataset.embedState = "ready"
      scan()
    } catch (error) {
      if (error.name !== "AbortError" && embed.isConnected) embed.dataset.embedState = "unavailable"
      // Preserve the original navigable link if fetching fails.
    } finally {
      job.loading = false
      // An unresolved embed stays a link until its destination changes.
      job.result ??= embed.firstElementChild
    }
  }
  function scan() {
    page.querySelectorAll("[data-obsidian-embed]").forEach(hydrate)
  }
  const observer = new MutationObserver(scan)
  observer.observe(page, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-obsidian-embed"],
  })
  scan()
  return () => {
    controller.abort()
    observer.disconnect()
    cache.clear()
  }
}
