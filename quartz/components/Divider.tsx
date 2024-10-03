import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Divider({ displayClass }: QuartzComponentProps) {
  return <hr />
}

export default (() => Divider) satisfies QuartzComponentConstructor
