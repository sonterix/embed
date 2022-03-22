class MoneymadeWidget {
  #hostV1 = 'https://widgets.moneymade.io'

  #hostV2 = 'https://one-widget.vercel.app'

  #node

  #iframeId

  constructor(node) {
    this.#node = node
    this.#iframeId = `__mm_${Math.floor(Math.random() * Math.floor(999999))}`
  }

  /**
   * Init function. The entry point for the widget functionality
   * @param {initCallback} [callback] The callback function that fires after all init method is done
   */
  init(callback) {
    // Create iframe
    const iframeElement = this.createIframe()

    if (iframeElement) {
      this.mountIframe(iframeElement)
      // Send success status
      if (callback) {
        callback(this.#iframeId, true)
      }
    } else {
      this.hideNode()
      // Send error status
      if (callback) {
        callback(this.#iframeId, false)
      }
    }

    // Init listening for the messages from the iframe
    window.addEventListener('message', this.trackIframeMessages)
  }
  /**
   * The callback function that fires after all init method is done
   * @callback initCallback
   * @param {string} id Iframe id
   * @param {boolean} status Represents the status of the successful inited widget
   * @returns {void}
   */

  /**
   * Init function. The entry point for the widget functionality
   * @param {initOnLoadCallback} [callback] The callback function that fires after all init method is done
   */
  initOnLoad(callback) {
    const iframeData = {
      id: '',
      status: false
    }

    // Function to init the iframe creation when the DOM is completely loaded
    const initOnComplete = () => {
      if (document.readyState === 'complete') {
        this.init((id, status) => {
          iframeData.id = id
          iframeData.status = status
        })
      }
    }

    if (document.readyState === 'complete') {
      this.init((id, status) => {
        iframeData.id = id
        iframeData.status = status
      })
    } else if (!iframeData.status) {
      document.addEventListener('readystatechange', initOnComplete)
    } else {
      document.removeEventListener('readystatechange', initOnComplete)
    }

    if (callback) {
      callback(iframeData.id, iframeData.status)
    }
  }
  /**
   * The callback function that fires after all init method is done
   * @callback initOnLoadCallback
   * @param {string} id Iframe id
   * @param {boolean} status Represents the status of the successful inited widget
   * @returns {void}
   */

  /**
   * Returns an attribute value of the DOM element based on name param
   * @param {string} name Attribute name
   * @param {*=} [defaultValue = null] Any defaul value
   * @returns {*} Attribute value or default value
   */
  getNodeAttribute(name, defaultValue = null) {
    return this.#node.getAttribute(name) || defaultValue
  }

  /**
   * Generates an iframe elemet based on the node element
   * @returns {HTMLIFrameElement|null} Created iframe id
   */
  createIframe() {
    // Get iframe params based on data attributes
    const embedType = this.getNodeAttribute('data-embed-widget', 'investing')
    const platformId = this.getNodeAttribute('data-platform-id')
    const industry = this.getNodeAttribute('data-industry')
    const width = this.getNodeAttribute('data-width')
    let height = this.getNodeAttribute('data-height')
    // Base iframe URL params
    const paramsObj = {
      frameId: this.#iframeId,
      utm_campaign: this.getNodeAttribute('data-utm-campaign'),
      utm_medium: this.getNodeAttribute('data-utm-medium'),
      utm_source: this.getNodeAttribute('data-utm-source')
    }

    // Create URL
    let url = null

    switch (embedType) {
      case 'investing':
        url = new URL(`embed-entry/${platformId}`, this.#hostV1)
        break

      case 'calculator':
        url = new URL('embed-calculator', this.#hostV1)
        break

      case 'quizFull':
        url = new URL('embed-quiz-expand', this.#hostV1)
        break

      case 'full':
        url = new URL('full-experience', this.#hostV1)
        break

      case 'trading':
        url = new URL(`embed-trading/${platformId}`, this.#hostV1)
        break

      case 'expandableFull':
        url = new URL('expandable-discovery', this.#hostV1)
        break

      case 'newQuiz':
        url = new URL('expandable-quiz', this.#hostV1)
        break

      case 'typeWidget':
        url = new URL('type-widget', this.#hostV1)
        paramsObj.type = industry
        break

      case 'customWidget':
        url = new URL('custom-widget', this.#hostV1)
        paramsObj.type = industry
        break

      case 'stockWidget':
        url = new URL('stock-widget', this.#hostV1)
        break

      case 'horizontalDiscovery':
        url = new URL('horizontal-discovery', this.#hostV1)
        break

      case 'worldwideWidget':
        url = new URL('worldwide-widget', this.#hostV1)
        break

      case 'promosSlider':
        url = new URL('promos-slider', this.#hostV1)
        break

      case 'discoverByInterest':
        url = new URL('discover-by-interest', this.#hostV1)
        break

      case 'tickerGraph':
        url = new URL('ticker-graph', this.#hostV2)
        height = height || 440
        break

      case 'tickerTable':
        url = new URL('ticker-table', this.#hostV2)
        height = height || 385
        break

      default:
        break
    }

    if (url) {
      // Add params to the iframe URL
      const params = new URLSearchParams(paramsObj).toString()
      url.search = params

      // Create and configure iframe element
      const iframeElement = document.createElement('iframe')
      iframeElement.id = this.#iframeId
      iframeElement.src = url.toString()
      iframeElement.style.border = 'none'
      iframeElement.width = width || '100%'
      iframeElement.height = height || 'auto'
      // Experimental param. It's not working in all browsers
      iframeElement.loading = 'lazy'

      return iframeElement
    }

    return url
  }

  /**
   * Mounts the iframe element to inside node element
   * @param {HTMLIFrameElement} iframeElement Iframe element which will be mounted
   */
  mountIframe(iframeElement) {
    // Replacing first element or just adding the iframe to node if node is empty
    if (this.#node.firstChild) {
      this.#node.replaceChild(iframeElement, this.#node.firstChild)
    } else {
      this.#node.appendChild(iframeElement)
    }
  }

  /**
   * Process through different messages that come from an iframe
   * @param {MessageEvent} event
   */
  trackIframeMessages(event) {
    if (event.origin === this.#hostV1 || event.origin === this.#hostV2) {
      const { action } = event.data

      switch (action) {
        // Get height param from iframe and set to the iframe
        case 'setHeight': {
          const { frameId, height } = event.data
          const iframeElement = document.querySelector(`#${frameId}`)

          if (iframeElement) {
            iframeElement.setAttribute('height', height)
          }

          break
        }

        default: {
          break
        }
      }
    }
  }

  /**
   * Hides node element from the DOM
   */
  hideNode() {
    this.#node[0].style.display = 'none'
    this.#node.setAttribute('id', this.#iframeId)
    this.#node.setAttribute('data-status', 'Failed to load')
  }
}

/**
 * Inits widgets on the page
 * @returns {Object} Object where key is an iframe id and value is a iframe status
 */
window.mminit = () => {
  // Get all elements with specific moneymade class
  const moneymadeElements = document.querySelectorAll('.money-made-embed:not(.money-made-loaded)')

  if (moneymadeElements.length) {
    // Convert elements to the iframes and get the statuses by each iframe
    const statuses = [...moneymadeElements].reduce((acc, node) => {
      let data = acc
      // Create widget
      const widget = new MoneymadeWidget(node)
      // Init widget
      widget.initOnLoad((id, status) => {
        // Store iframe status
        data = { ...acc, [id]: status }

        if (status) {
          node.classList.add('.money-made-loaded')
        }
      })

      return data
    }, {})

    console.table(statuses, ['Iframe Id', 'Status'])

    return statuses
  }

  return {}
}

// Call init when the DOM is ready
window.addEventListener('load', () => {
  window.mminit()
})

// Create an observer instance linked to the callback function
const observer = new MutationObserver(() => {
  window.mminit()
})

// Start observing the target node for configured mutations
observer.observe(document.body, { attributes: true, childList: true, subtree: true })
