class MoneymadeWidget {
  hostV1 = 'https://widgets.moneymade.io'

  hostV2 = 'https://one-widget.vercel.app'

  node

  iframeId

  constructor(node) {
    this.node = node
    this.iframeId = `__mm_${Math.floor(Math.random() * Math.floor(999999))}`
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
        callback(this.iframeId, true)
      }
    } else {
      this.hideNode()
      // Send error status
      if (callback) {
        callback(this.iframeId, false)
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
    return this.node.getAttribute(name) || defaultValue
  }

  /**
   * Generates an iframe elemet based on the node element
   * @returns {HTMLIFrameElement|null} Created iframe id
   */
  createIframe() {
    // Get iframe params based on data attributes
    const embedType = this.getNodeAttribute('data-embed-widget')
    const platformId = this.getNodeAttribute('data-platform-id')
    const industry = this.getNodeAttribute('data-industry')
    let width = this.getNodeAttribute('data-width')
    let height = this.getNodeAttribute('data-height')
    // Base iframe URL params
    const paramsWidget = this.getNodeAttribute('data-params')
    const paramsObj = {
      frameId: this.iframeId,
      utm_campaign: this.getNodeAttribute('data-utm-campaign'),
      utm_medium: this.getNodeAttribute('data-utm-medium'),
      utm_source: this.getNodeAttribute('data-utm-source')
    }

    // Create URL
    let url = null

    switch (embedType) {
      case 'investing':
        url = new URL(`embed-entry/${platformId}`, this.hostV1)
        break

      case 'calculator':
        url = new URL('embed-calculator', this.hostV1)
        break

      case 'quizFull':
        url = new URL('embed-quiz-expand', this.hostV1)
        break

      case 'full':
        url = new URL('full-experience', this.hostV1)
        break

      case 'trading':
        url = new URL(`embed-trading/${platformId}`, this.hostV1)
        break

      case 'expandableFull':
        url = new URL('expandable-discovery', this.hostV1)
        break

      case 'newQuiz':
        url = new URL('expandable-quiz', this.hostV1)
        break

      case 'typeWidget':
        url = new URL('type-widget', this.hostV1)
        paramsObj.type = industry
        break

      case 'customWidget':
        url = new URL('custom-widget', this.hostV1)
        paramsObj.type = industry
        break

      case 'stockWidget':
        url = new URL('stock-widget', this.hostV1)
        break

      case 'horizontalDiscovery':
        url = new URL('horizontal-discovery', this.hostV1)
        break

      case 'worldwideWidget':
        url = new URL('worldwide-widget', this.hostV1)
        break

      case 'promosSlider':
        url = new URL('promos-slider', this.hostV1)
        break

      case 'discoverByInterest':
        url = new URL('discover-by-interest', this.hostV1)
        break

      case 'tickerSimple':
        url = new URL('ticker-simple', this.hostV2)
        height = height || 230
        break

      case 'tickerGraph':
        url = new URL('ticker-graph', this.hostV2)
        height = height || 440
        break

      case 'articleSnapshot':
        url = new URL('article-snapshot', this.hostV2)
        height = height || 360
        break

      case 'inlineData':
        url = new URL('inline-data', this.hostV2)
        width = width || 84
        height = height || 24
        break

      case 'monetized':
        url = new URL('monetized', this.hostV2)
        height = height || 488
        break

      case 'categoryRoundup':
        url = new URL('category-roundup', this.hostV2)
        height = height || 448
        break

      case 'tickerTable':
        url = new URL('ticker-table', this.hostV2)
        height = height || 385
        break

      default:
        break
    }

    if (url) {
      // Add params to the iframe URL
      const params = new URLSearchParams(paramsObj).toString()
      url.search = [paramsWidget, params].join('&')

      // Create and configure iframe element
      const iframeElement = document.createElement('iframe')
      iframeElement.id = this.iframeId
      iframeElement.src = url.toString()
      iframeElement.style.border = 'none'
      iframeElement.width = width || '100%'
      iframeElement.height = height || 'auto'
      // Kwno that deprecated but still need for Inline Data widget
      iframeElement.align = 'center'
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
    if (this.node.firstChild) {
      this.node.replaceChild(iframeElement, this.node.firstChild)
    } else {
      this.node.appendChild(iframeElement)
    }
  }

  /**
   * Process through different messages that come from an iframe
   * @param {MessageEvent} event
   */
  trackIframeMessages(event) {
    if (event.origin === this.hostV1 || event.origin === this.hostV2) {
      const { action } = event.data

      switch (action) {
        case 'setWidth': {
          const { width } = event.data
          const iframeElement = document.querySelector(`#${this.iframeId}`)

          if (iframeElement) {
            iframeElement.setAttribute('width', width)
          }

          break
        }

        case 'setHeight': {
          const { height } = event.data
          const iframeElement = document.querySelector(`#${this.iframeId}`)

          if (iframeElement) {
            iframeElement.setAttribute('height', height)
          }

          break
        }

        case 'setSize': {
          const { width, height } = event.data
          const iframeElement = document.querySelector(`#${this.iframeId}`)

          if (iframeElement) {
            iframeElement.setAttribute('width', width)
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
    this.node[0].style.display = 'none'
    this.node.setAttribute('id', this.iframeId)
    this.node.setAttribute('data-status', 'Failed to load')
  }
}

/**
 * Inits widgets in provided elements
 * @param {Element | Element[]} moneymadeEl Array of Moneymade elements
 * @returns {Object | null} Object where key is an iframe id and value is a iframe status
 */
window.mminit = moneymadeEl => {
  // If array of elements
  if (Array.isArray(moneymadeEl)) {
    const statuses = moneymadeEl.reduce((acc, node) => {
      // Create widget
      const widget = new MoneymadeWidget(node)
      widget.initOnLoad((id, status) => {
        if (status) {
          node.classList.add('money-made-loaded')
        }

        acc[id] = status
      })

      return acc
    }, {})

    console.table(statuses)
    return statuses
  }

  // If single element
  if (moneymadeEl) {
    // Create widget
    const widget = new MoneymadeWidget(moneymadeEl)
    widget.initOnLoad((id, status) => {
      if (status) {
        moneymadeEl.classList.add('money-made-loaded')
      }

      const data = { [id]: status }

      console.table(data)
      return data
    })
  }

  return null
}

// Call init when the DOM is ready
window.addEventListener('load', () => {
  // Get all elements with specific moneymade class
  const moneymadeElements = document.querySelectorAll('.money-made-embed:not(.money-made-loaded)')
  // Init widgets inside the elements
  window.mminit([...moneymadeElements])

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(mutationsList => {
    // Checkign for each mutation
    mutationsList.forEach(({ type, target, attributeName, addedNodes }) => {
      // Get class list of current element
      const classList = target?.classList ? [...target.classList] : []
      // Detect if it's moneymade element
      const isMoneymadeEl = classList.includes('money-made-embed')
      const isMoneymadeElLoaded = classList.includes('money-made-loaded')

      if (isMoneymadeEl) {
        // If attribute has changed (except 'class') in loaded element
        if (type === 'attributes' && attributeName !== 'class' && isMoneymadeElLoaded) {
          target.classList.remove('money-made-loaded')
          window.mminit(target)
        }
      } else if (addedNodes.length) {
        // Checking each added element
        addedNodes.forEach(element => {
          const elementClassList = element?.classList ? [...element.classList] : []
          // If this not loaded moneymade element
          if (elementClassList.includes('money-made-embed') && !elementClassList.includes('money-made-loaded')) {
            window.mminit(element)
          }
        })
      }
    })
  })

  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: false
  }

  // Start observing the document for configured mutations
  observer.observe(document, config)
})
