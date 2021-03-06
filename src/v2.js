class MoneymadeWidget {
  static hostV1 = 'https://widgets.moneymade.io'

  static hostV2 = 'https://markets.moneymade.io'

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
    let isInited = false

    // Function to careate and mount iframe element
    const renderIframe = () => {
      if (document.readyState === 'complete') {
        // Create iframe
        const iframeElement = this.createIframe()

        if (iframeElement) {
          this.mountIframe(iframeElement)
          this.logStatus(true)
          // Send success status
          if (callback) {
            callback(this.iframeId, true)
          }

          // Change local status
          isInited = true
        } else {
          this.hideNode()
          this.logStatus(false)
          // Send error status
          if (callback) {
            callback(this.iframeId, false)
          }
        }
      }
    }

    // Init
    renderIframe()

    // If not inited
    if (!isInited) {
      document.addEventListener('readystatechange', renderIframe)
    }
  }
  /**
   * The callback function that fires after all init method is done
   * @callback initCallback
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
    // Attributes the required for URL
    const embedType = this.getNodeAttribute('data-embed-widget')
    const platformId = this.getNodeAttribute('data-platform-id')
    // Base widget size
    const width = this.getNodeAttribute('data-width')
    let height = this.getNodeAttribute('data-height')
    // ULR based on embedType
    let url = null

    switch (embedType) {
      case 'investing':
        url = new URL(`embed-entry/${platformId}`, MoneymadeWidget.hostV1)
        break

      case 'calculator':
        url = new URL('embed-calculator', MoneymadeWidget.hostV1)
        break

      case 'quizFull':
        url = new URL('embed-quiz-expand', MoneymadeWidget.hostV1)
        break

      case 'full':
        url = new URL('full-experience', MoneymadeWidget.hostV1)
        break

      case 'trading':
        url = new URL(`embed-trading/${platformId}`, MoneymadeWidget.hostV1)
        break

      case 'expandableFull':
        url = new URL('expandable-discovery', MoneymadeWidget.hostV1)
        break

      case 'newQuiz':
        url = new URL('expandable-quiz', MoneymadeWidget.hostV1)
        break

      case 'typeWidget':
        url = new URL('type-widget', MoneymadeWidget.hostV1)
        break

      case 'customWidget':
        url = new URL('custom-widget', MoneymadeWidget.hostV1)
        break

      case 'stockWidget':
        url = new URL('stock-widget', MoneymadeWidget.hostV1)
        break

      case 'horizontalDiscovery':
        url = new URL('horizontal-discovery', MoneymadeWidget.hostV1)
        break

      case 'worldwideWidget':
        url = new URL('worldwide-widget', MoneymadeWidget.hostV1)
        break

      case 'promosSlider':
        url = new URL('promos-slider', MoneymadeWidget.hostV1)
        break

      case 'discoverByInterest':
        url = new URL('discover-by-interest', MoneymadeWidget.hostV1)
        break

      case 'tickerSimple':
        url = new URL('ticker-simple', MoneymadeWidget.hostV2)
        break

      case 'tickerGraph':
        url = new URL('ticker-graph', MoneymadeWidget.hostV2)
        break

      case 'articleSnapshot':
        url = new URL('article-snapshot', MoneymadeWidget.hostV2)
        break

      case 'inlineData':
        url = new URL('inline-data', MoneymadeWidget.hostV2)
        break

      case 'monetized':
        url = new URL('monetized', MoneymadeWidget.hostV2)
        break

      case 'categoryRoundup':
        url = new URL('category-roundup', MoneymadeWidget.hostV2)
        break

      case 'tickerTable':
        url = new URL('ticker-table', MoneymadeWidget.hostV2)
        break

      case 'gainersLosers':
        url = new URL('gainers-losers', MoneymadeWidget.hostV2)
        break

      case 'symbolSearch':
        url = new URL('symbol-search', MoneymadeWidget.hostV2)
        break

      case 'compactPerformance':
        url = new URL('compact-performance', MoneymadeWidget.hostV2)
        break

      case 'editorial':
        url = new URL('editorial', MoneymadeWidget.hostV2)
        break

      case 'best-performing-table':
        url = new URL('best-performing-table', MoneymadeWidget.hostV2)
        break

      case 'compare-price':
        url = new URL('compare-price', MoneymadeWidget.hostV2)
        break

      case 'compare-platforms':
        url = new URL('compare-platforms', MoneymadeWidget.hostV2)
        break

      case 'compare-returns':
        url = new URL('compare-returns', MoneymadeWidget.hostV2)
        break

      case 'full-stock':
        height = 300
        url = new URL('full-stock', MoneymadeWidget.hostV2)
        break

      case 'top-nfts':
        url = new URL('top-nfts', MoneymadeWidget.hostV2)
        break

      default:
        break
    }

    if (url) {
      // URL GET params
      const schema = this.getNodeAttribute('data-schema')
      const industry = this.getNodeAttribute('data-industry')
      const utmCampaign = this.getNodeAttribute('data-utm-campaign')
      const utmMedium = this.getNodeAttribute('data-utm-medium')
      const utmSource = this.getNodeAttribute('data-utm-source')
      //  Custom prarms for URL GET
      const paramsWidget = this.getNodeAttribute('data-params')

      // Combine all props
      const paramsObj = {
        frameId: this.iframeId,
        ...(schema ? { schema } : {}),
        ...(industry ? { type: industry } : {}),
        ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
        ...(utmMedium ? { utm_medium: utmMedium } : {}),
        ...(utmSource ? { utm_source: utmSource } : {})
      }

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

    // Add class-indicator that iframe is mounted
    this.node.classList.add('money-made-loaded')
  }

  /**
   * Console log widget status
   * @param {boolean} [status] Status of the current widget
   */
  logStatus(status) {
    // eslint-disable-next-line no-console
    console.info(
      `%cWidget: { id: %c${this.iframeId}, %cloaded: %c${status} %c}`,
      'color: #fff',
      'color: #6525c2',
      'color: #fff',
      `color: ${status ? '#35a577' : '#e62b32'}`,
      'color: #fff'
    )
  }

  /**
   * Hides node element from the DOM
   */
  hideNode() {
    this.node.style.display = 'none'
    this.node.setAttribute('id', this.iframeId)
    this.node.setAttribute('data-status', 'Failed to load')
  }

  /**
   * Process through different messages that come from an iframe
   */
  static trackIframeMessages() {
    // Init listening for the messages from the iframe
    window.addEventListener('message', event => {
      if (event.origin === MoneymadeWidget.hostV1 || event.origin === MoneymadeWidget.hostV2) {
        const { action } = event.data

        switch (action) {
          case 'setWidth': {
            const { frameId, width } = event.data
            const iframeElement = frameId ? document.querySelector(`#${frameId}`) : null

            if (width && iframeElement) {
              iframeElement.setAttribute('width', width)
            }
            break
          }

          case 'setHeight': {
            const { frameId, height } = event.data
            const iframeElement = frameId ? document.querySelector(`#${frameId}`) : null

            if (height && iframeElement) {
              iframeElement.setAttribute('height', height)
            }
            break
          }

          case 'setSize': {
            const { frameId, width, height } = event.data
            const iframeElement = frameId ? document.querySelector(`#${frameId}`) : null

            if (width && height && iframeElement) {
              iframeElement.setAttribute('width', width)
              iframeElement.setAttribute('height', height)
            }
            break
          }

          case 'changeSymbol': {
            const { controlId, symbol, exchange } = event.data
            const controlledElement = controlId ? document.querySelector(`#${controlId}`) : null

            if (symbol && controlledElement) {
              // Get data-params. Cuz there symbol param is
              const params = controlledElement.getAttribute('data-params') || ''
              const paramsObj = Object.fromEntries(new URLSearchParams(params))
              // Change symbol
              paramsObj.symbol = symbol
              paramsObj.exchange = exchange
              // Add updated params to element
              controlledElement.setAttribute('data-params', new URLSearchParams(paramsObj).toString())
            }
            break
          }

          default: {
            break
          }
        }
      }
    })
  }

  /**
   * Detect DOM changes that relevant to Moneymade widgets
   */
  static trackDOMChanges() {
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
            const widget = new MoneymadeWidget(target)
            widget.init()
          }
        } else if (addedNodes.length) {
          // Checking each added element
          addedNodes.forEach(element => {
            const elementClassList = element?.classList ? [...element.classList] : []
            // If this not loaded moneymade element
            if (elementClassList.includes('money-made-embed') && !elementClassList.includes('money-made-loaded')) {
              const widget = new MoneymadeWidget(element)
              widget.init()
            }
            // Check for moneymade elements inside the mutated element and init
            else if (element instanceof Element) {
              // Get all elements with specific moneymade class
              const moneymadeEl = element?.querySelectorAll('.money-made-embed:not(.money-made-loaded)') || []

              if (moneymadeEl.length) {
                moneymadeEl.forEach(element => {
                  // Create widget
                  const widget = new MoneymadeWidget(element)
                  return widget.init()
                })
              }
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
  }

  /**
   * Get statistic info about the user
   */
  static trackUser() {
    const timezoneVal = (new Date().getTimezoneOffset() / -60).toString()

    // Get base user data
    const date = new Date().toString()
    const timezone = timezoneVal ? `+${timezoneVal}` : timezoneVal
    const os = navigator?.userAgentData?.platform || 'none'
    const ram = navigator?.deviceMemory || 0
    const parent = window.location !== window.parent.location ? document.referrer : 'not in iframe'
    const host = window.location.hostname
    const path = window.location.pathname
    const resolution = `${window.screen.width}x${window.screen.height}`
    const isCookie = navigator.cookieEnabled
    const languages = navigator?.languages || []

    // Detect device
    let isMobile = false

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      isMobile = true
    }
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
    moneymadeEl.forEach(element => {
      // Create widget
      const widget = new MoneymadeWidget(element)
      return widget.init()
    })

    // If single element
  } else if (moneymadeEl) {
    // Create widget
    const widget = new MoneymadeWidget(moneymadeEl)
    return widget.init()
  }

  return null
}

// Call init when the DOM is ready
window.addEventListener('load', () => {
  // Get all elements with specific moneymade class
  const moneymadeElements = document.querySelectorAll('.money-made-embed:not(.money-made-loaded)')
  // Init widgets inside the elements
  window.mminit([...moneymadeElements])
  // Init track messages from iframe
  MoneymadeWidget.trackIframeMessages()
  // Init track DOM changes that relevant to widget
  MoneymadeWidget.trackDOMChanges()
})
