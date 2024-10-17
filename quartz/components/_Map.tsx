// @ts-ignore
// loosely based off of the darkmode component
import styles from "./styles/_map.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

const Map: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "map")}>
      <a href="./map" class="toggle" tabIndex={-1}>
        <label for="darkmode-toggle" tabIndex={-1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="nightIcon"
            x="0px"
            y="0px"
            viewBox="0 0 24 24"
            style="enable-background:new 0 0 100 100"
            xmlSpace="preserve"
          >
            <title>{i18n(cfg.locale).components.themeToggle.lightMode}</title>
            <path
              d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4"
              stroke="var(--darkgray)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </label>
      </a>
    </div>
  )
}

Map.css = styles

export default (() => Map) satisfies QuartzComponentConstructor
