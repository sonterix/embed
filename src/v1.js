const HOSTNAME = 'https://widgets.moneymade.io'
let inited = false

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function serializeQueryParams(obj) {
  var str = []
  for (var p in obj)
    if (obj.hasownproperty(p)) {
      str.push(encodeuricomponent(p) + '=' + encodeuricomponent(obj[p]))
    }
  return str.join('&')
}

function getNodeAttribute(domNode, name, defaultValue) {
  return (domNode.attributes.getNamedItem(name) && domNode.attributes.getNamedItem(name).value) || defaultValue || null
}

/**
 * Embeds a div into moneymade embed.
 * @param {domNode} domNode
 */
function embedDiv(domNode) {
  let frameId = '__mm_' + getRandomInt(10000).toString()
  let embedType = getNodeAttribute(domNode, 'data-embed-widget', 'investing')

  let paramsObj = {
    utm_campaign: getNodeAttribute(domNode, 'data-utm-campaign', null),
    utm_medium: getNodeAttribute(domNode, 'data-utm-medium', null),
    utm_source: getNodeAttribute(domNode, 'data-utm-source', null),
    frameId: frameId
  }

  let platformId = getNodeAttribute(domNode, 'data-platform-id', null)
  let industry = getNodeAttribute(domNode, 'data-industry', null)
  //let type = getNodeAttribute(domNode, 'data-category', null);
  let width = getNodeAttribute(domNode, 'data-width', null)

  let url

  switch (embedType) {
    case 'investing':
      url = new URL('embed-entry/' + platformId, HOSTNAME)
      break

    case 'calculator':
      url = new URL('embed-calculator', HOSTNAME)
      break

    case 'quizFull':
      url = new URL('embed-quiz-expand', HOSTNAME)
      break

    case 'full':
      url = new URL('full-experience', HOSTNAME)
      break

    case 'trading':
      url = new URL('embed-trading/' + platformId, HOSTNAME)
      break

    case 'expandableFull':
      url = new URL('expandable-discovery', HOSTNAME)
      break

    case 'newQuiz':
      url = new URL('expandable-quiz', HOSTNAME)
      break

    case 'typeWidget':
      url = new URL('type-widget', HOSTNAME)
      paramsObj.type = industry
      break

    case 'customWidget':
      url = new URL('custom-widget', HOSTNAME)
      paramsObj.type = industry
      break

    case 'stockWidget':
      url = new URL('stock-widget', HOSTNAME)
      break

    case 'horizontalDiscovery':
      url = new URL('horizontal-discovery', HOSTNAME)
      break

    case 'worldwideWidget':
      url = new URL('worldwide-widget', HOSTNAME)
      break

    case 'promosSlider':
      url = new URL('promos-slider', HOSTNAME)
      break

    case 'discoverByInterest':
      url = new URL('discover-by-interest', HOSTNAME)
      break
  }

  let params = serializeQueryParams(paramsObj)

  url.search = params

  let iframe = document.createElement('iframe')
  iframe.id = frameId
  iframe.src = url.toString()
  iframe.frameBorder = 0
  iframe.width = width || '100%'
  iframe.loading = 'lazy'

  if (getNodeAttribute(domNode, 'data-height', null)) {
    iframe.height = getNodeAttribute(domNode, 'data-height', null)
  }
  if (!domNode.hasChildNodes()) {
    domNode.appendChild(iframe)
  } else {
    domNode.replaceChild(iframe, domNode.firstChild)
  }
  return frameId
}

function handleMessages(event) {
  if (event.origin !== HOSTNAME) {
    return
  }

  let { action, frameId } = event.data
  if (action === 'setHeight' && event.data.height !== 0) {
    let frame = document.getElementById(frameId)
    if (frame) frame.height = event.data.height
  }
}

function moneyMadeInit() {
  let moneyMadeDivs = document.getElementsByClassName('money-made-embed')
  Array.from(moneyMadeDivs).forEach(node => {
    embedDiv(node)
  })

  window.addEventListener('message', handleMessages, false)
}

function setOnLoadListener() {
  inited = true

  if (document.readyState === 'complete') {
    moneyMadeInit()
  } else {
    document.addEventListener('readystatechange', event => {
      var myTimer
      if (event.target.readyState === 'interactive') {
        myTimer = setTimeout(function () {
          moneyMadeInit()
          document.removeEventListener('readystatechange', function () {}, false)
        }, 3000)
      } else if (event.target.readyState === 'complete') {
        moneyMadeInit()
        clearTimeout(myTimer)
      }
    })
  }
}

function moneyMadeLazyIframe() {
  document.addEventListener('DOMContentLoaded', function () {
    var lazyIframes = [].slice.call(document.querySelectorAll('iframe.lazy'))

    if ('IntersectionObserver' in window) {
      var lazyIframeObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (iframe) {
          if (iframe.isIntersecting) {
            for (var source in iframe.target.children) {
              var iframeSource = iframe.target.children[source]
              if (typeof iframeSource.tagName === 'string' && iframeSource.tagName === 'SOURCE') {
                iframeSource.src = iframeSource.dataset.src
              }
            }

            iframe.target.load()
            iframe.target.classList.remove('lazy')
            lazyIframeObserver.unobserve(iframe.target)
          }
        })
      })

      lazyIframes.forEach(function (lazyVideo) {
        lazyIframeObserver.observe(lazyVideo)
      })
    }
  })
}

;(function () {
  if (!inited) setOnLoadListener()
})()
