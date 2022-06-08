import { createElementFromHTML } from 'Src/util/browser.js'

import { html } from 'common-tags'

function getBackgroundGrid () {
  return createElementFromHTML(html`
    <div id="backgroundGrid">
    </div>
  `)
}

export {
  getBackgroundGrid
}
