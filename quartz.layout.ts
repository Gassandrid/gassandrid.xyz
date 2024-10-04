import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

const giscusConfig = {
  provider: "giscus",
  options: {
    // from data-repo
    repo: "gassandrid/gassandrid.xyz",
    // from data-repo-id
    repoId: "R_kgDOM6tvbQ",
    // from data-category
    category: "Announcements",
    // from data-category-id
    categoryId: "DIC_kwDOM6tvbc4CjBtr",
    mapping: "mathname",
    strict: false,
    reactionsEnabled: true,
    inputPosition: "top",
    term: "Guestbook",
  },
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        // from data-repo
        repo: "fanteastick/quartz-test",
        // from data-repo-id
        repoId: "R_kgDOMVIwGw",
        // from data-category
        category: "Announcements",
        // from data-category-id
        categoryId: "DIC_kwDOMVIwG84Cguqi",
        mapping: "specific",
        strict: false,
        reactionsEnabled: false,
        inputPosition: "top",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/gassandrid",
      Instagram: "https://instagram.com/ewan_pedersen",
      MonkeyType: "https://monkeytype.com/profile/Gassandrid",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.MobileOnly(Component.TagList()),
  ],
  left: [
    Component.PageTitle(),

    Component.Row([Component.Cv(), Component.Map(), Component.Darkmode(), Component.Search()]),
    // Component.Search(),
    // Component.Darkmode(),

    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Most recent",
        limit: 5,
      }),
    ),
    Component.DesktopOnly(
      Component.Explorer({
        title: "Explore",
        useSavedState: true,
        sortFn: (a, b) => {
          if ((!a.file && !b.file) || (a.file && b.file)) {
            // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
            // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
            return a.displayName.localeCompare(b.displayName, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          }
          if (a.file && !b.file) {
            return 1
          } else {
            return -1
          }
        },
      }),
    ),
  ],
  right: [
    Component.DesktopOnly(Component.TagList()),
    Component.Graph({
      localGraph: {
        linkDistance: 50,
      },
      globalGraph: {
        linkDistance: 50,
      },
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.MobileOnly(
      Component.RecentNotes({
        title: "Most recent",
        limit: 5,
      }),
    ),
    Component.MobileOnly(
      Component.Explorer({
        title: "Explore",
        useSavedState: true,
        sortFn: (a, b) => {
          if ((!a.file && !b.file) || (a.file && b.file)) {
            // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
            // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
            return a.displayName.localeCompare(b.displayName, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          }
          if (a.file && !b.file) {
            return 1
          } else {
            return -1
          }
        },
      }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Row([Component.Cv(), Component.Map(), Component.Darkmode(), Component.Search()]),
  ],
  right: [],
}
