import path from "node:path"
import { joinSegments, pathToRoot } from "@quartz-community/utils"
import { visit } from "unist-util-visit"

function basename(value) {
  return value.slice(value.lastIndexOf("/") + 1).toLowerCase()
}

export function buildSvgIndex(slugs) {
  const candidates = new Map()
  for (const slug of slugs) {
    if (!String(slug).toLowerCase().endsWith(".svg")) continue
    const key = basename(String(slug))
    const matches = candidates.get(key) ?? []
    matches.push(String(slug))
    candidates.set(key, matches)
  }

  const unique = new Map()
  for (const [key, matches] of candidates) {
    if (matches.length === 1) unique.set(key, matches[0])
  }
  return unique
}

export function resolveSvgObjects(html, slug, svgIndex) {
  const base = pathToRoot(slug)
  return html.replace(
    /(<object\b[^>]*\bdata=["'])([^"']+\.svg)(["'])/gi,
    (match, open, value, close) => {
      if (/^(?:[a-z]+:|\/|\.\.\/|\.\/)/i.test(value) || value.includes("/")) return match
      const target = svgIndex.get(basename(value))
      if (!target) return match
      return `${open}${joinSegments(base, target)}${close}`
    },
  )
}

export function themeFlorilegiumBanner(html, slug, svgIndex) {
  const attachment = svgIndex.get("florilegium-banner.svg")
  if (slug !== "index" || !attachment) return html
  const target = joinSegments(pathToRoot(slug), attachment)
  return html.replace(/<object\b[^>]*>\s*<\/object>/gi, (object) => {
    const source = object.match(/\bdata=["']([^"']+)["']/i)?.[1]
    if (source !== target) return object
    const url = encodeURI(target).replace(
      /[!'()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    )
    // A CSS mask lets this monochrome artwork inherit the site's theme without
    // inlining its large path or changing the canonical attachment. The image
    // retains the accessible name and no-mask fallback. Integer dimensions use
    // the SVG's 2964.6 × 460.09 viewBox scaled by 100: this reserves its exact
    // ratio before Quartz's lazy image loads, including on a fresh mobile visit.
    return `<span class="florilegium-banner" style="--florilegium-image:url(&quot;${url}&quot;)"><img src="${url}" alt="Sailing boats — Florilegium banner" width="296460" height="46009"></span>`
  })
}

export default function EwanSvgEmbeds() {
  return {
    name: "EwanSvgEmbeds",
    markdownPlugins(ctx) {
      const svgIndex = buildSvgIndex(ctx.allSlugs)
      return [
        () => (tree, file) => {
          const slug = String(file.data.slug ?? path.basename(file.path, path.extname(file.path)))
          visit(tree, "html", (node) => {
            node.value = themeFlorilegiumBanner(
              resolveSvgObjects(node.value, slug, svgIndex),
              slug,
              svgIndex,
            )
          })
        },
      ]
    },
  }
}
