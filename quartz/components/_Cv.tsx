// @ts-ignore
// loosely based off of the darkmode component
import styles from "./styles/_cv.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

const Cv: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "cv")}>
      <a href="https://cv.gassandrid.xyz" class="toggle" tabIndex={-1}>
        <label for="darkmode-toggle" tabIndex={-1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="nightIcon"
            x="0px"
            y="0px"
            viewBox="0 0 40 40"
            style="enable-background:new 0 0 40 40"
            xmlSpace="preserve"
          >
            <title>{i18n(cfg.locale).components.themeToggle.lightMode}</title>
            <path
              d="M30,4.8C30,2.7,28.3,1,26.2,1H7.8C5.7,1,4,2.7,4,4.8v24.4C4,31.3,5.7,33,7.8,33h18.4c2.1,0,3.8-1.7,3.8-3.8V4.8z M28,29.2 
        c0,1-0.8,1.8-1.8,1.8H7.8c-1,0-1.8-0.8-1.8-1.8V4.8C6,3.8,6.8,3,7.8,3h18.4c1,0,1.8,0.8,1.8,1.8V29.2z"
            />
            <path
              d="M10.9 19h11.8c.3 0 .6-.1.8-.4.2-.2.3-.5.2-.8-.4-2.4-1.9-4.3-3.9-5.2.6-.7 1-1.6 1-2.7 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1 
        .4 1.9 1 2.7-2 1-3.6 2.9-3.9 5.2 0 .3 0 .6.2.8.2.3.5.4.8.4zM14.8 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2S14.8 11.1 14.8 10zM16.8 
        14c2 0 3.8 1.2 4.6 3h-9.2C13 15.2 14.8 14 16.8 14zM25 22H9c-.6 0-1 .4-1 1s.4 1 1 1h16c.6 0 1-.4 1-1S25.6 22 25 22zM25 26H9c-.6 
        0-1 .4-1 1s.4 1 1 1h16c.6 0 1-.4 1-1S25.6 26 25 26z"
            />
          </svg>
        </label>
      </a>
    </div>
  )
}

Cv.css = styles

export default (() => Cv) satisfies QuartzComponentConstructor
