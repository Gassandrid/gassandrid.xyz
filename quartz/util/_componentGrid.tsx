import { QuartzComponent, QuartzComponentProps } from "../components/types"

export function getFlexContainer(children: QuartzComponent[], className: string) {
  function FlexContainer(props: QuartzComponentProps) {
    return (
      <div class={`${className} ${props.displayClass ?? ""}`}>
        {children.map((Component) => (
          <Component {...props} />
        ))}
      </div>
    )
  }
  FlexContainer.css = ""
  FlexContainer.afterDOMLoaded = ""
  FlexContainer.beforeDOMLoaded = ""
  children.forEach((child) => {
    FlexContainer.css =
      FlexContainer.css +
      `
  
  ` +
      child.css
    FlexContainer.afterDOMLoaded =
      FlexContainer.afterDOMLoaded +
      `
  
  ` +
      child.afterDOMLoaded
    FlexContainer.beforeDOMLoaded =
      FlexContainer.beforeDOMLoaded +
      `
  
  ` +
      child.beforeDOMLoaded
  })
  return FlexContainer
}
