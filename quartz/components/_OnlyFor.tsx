import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface OnlyForOptions {
  /**
   * The titles to look for
   */
  titles: string[]
}

export default ((opts?: Partial<OnlyForOptions>, component?: QuartzComponent) => {
  if (component) {
    const Component = component
    function OnlyFor(props: QuartzComponentProps) {
      return opts?.titles?.some((title) => props.fileData.frontmatter?.title === title) ? (
        <Component {...props} />
      ) : (
        <></>
      )
    }

    OnlyFor.displayName = component.displayName
    OnlyFor.afterDOMLoaded = component.afterDOMLoaded
    OnlyFor.beforeDOMLoaded = component.beforeDOMLoaded
    OnlyFor.css = component.css
    return OnlyFor
  } else {
    return () => <></>
  }
}) satisfies QuartzComponentConstructor
