import { html, css, LitElement } from 'lit'

export class LitDesk extends LitElement {
  static styles = css`
     :host {
      display: block;
      height: 100vh;
      width: 100vw;
      color: var(--lit-desk-text-color, #000);
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }

    .inner-container {
      display: flex;
      width: 60%;
      height: 60%;
    }

    .left-click-area {
      width: 30%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: red;
      cursor: pointer;
      left: 0;
    }

    .right-click-area {
      width: 30%;
      min-width: 30px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: red;
      flex-shrink: 0;
      cursor: pointer;
      right: 0;
      z-index: 0
    }

    .left-click-area svg,
    .right-click-area svg {
      transition: transform 0.3s ease, opacity 0.3s ease
    }

    .right-click-area:hover svg,
    .left-click-area:hover svg {
      transform: scale(2)
    }

    .left-click-area:active svg,
    .right-click-area:active svg {
      animation: click-animation 0.2s ease-out;
    }

    @keyframes click-animation {
      0% {
        transform: scale(2.2)
      }
      100% {
        transform: scale(2)
      }
    }
    .card-container {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 0;
      background-color: blue;

    }

    .card {
      margin-top: 4%;
      transition: z-index 0.3s ease, transform 0.3s ease;
      transform: translate(var(--horizontalOffset), var(--verticalOffset));
    }

    .card:nth-child(1) {
      --verticalOffset: 2%;
      --horizontalOffset: 0%;
    }

    .card:nth-child(2) {
      --verticalOffset: -98%;
      --horizontalOffset: 4%;
    }

    .card:nth-child(3) {
      --verticalOffset: -198%;
      --horizontalOffset: 8%;
    }

    .card-1 {
      z-index: 3;
    }

    .card-2 {
      z-index: 2;
    }

    .card-3 {
      z-index: 1;
    }
  `

  static properties = {
    dataSource: { attribute: false }
  }

  constructor () {
    super()
    this.cardOrder = ['card-3', 'card-2', 'card-1']
    this.pile = null
    // try a set based approach
    this.currentSet = 0
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener('on-tilt-finished', this.handleCardTiltFinished)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.removeEventListener('on-tilt-finished', this.handleCardTiltFinished)
  }

  firstUpdated () {
    const templateCard = this.querySelector('[slot="template-card"]')
    this.pile = this.renderRoot.querySelector('.card-container')
    if (templateCard) {
      this.pile.querySelectorAll('.card').forEach((el) => el.remove())
      this.cardOrder.forEach((slotName, index) => {
        const clone = templateCard.cloneNode(true)
        clone.classList.add('card', slotName)
        clone.dataSource = this.dataSource[this.cardOrder.length - index]
        this.pile.appendChild(clone)
      })
      templateCard.remove()
    }
  }

  handleCardTiltFinished (event) {
    const direction = event.detail.direction
    if (direction === 'left') {
      const movedCard = this.cardOrder.shift()
      this.cardOrder.push(movedCard)
    } else if (direction === 'right') {
      const movedCard = this.cardOrder.pop()
      this.cardOrder.unshift(movedCard)
    }
    this.updateZIndices()
    console.log('Current Set of Content: ', this.currentSet)
  }

  updateZIndices () {
    const cards = Array.from(this.pile.querySelectorAll('.card'))
    if (cards.length !== this.cardOrder.length) {
      console.warn('Mismatch between cards and cardOrder lengths.')
      return
    }
    cards.forEach((card, index) => {
      card.className = card.className.replace(/card-\d+/g, '').trim()
      card.classList.add(this.cardOrder[index])
    })
  }

  tiltTopCard () {
    const cards = Array.from(this.pile.querySelectorAll('.card'))
    this.currentSet = this.currentSet + 1
    const tilt = () => {
      const topCard = cards.reduce((highest, card) => {
        const zIndex = parseInt(window.getComputedStyle(card).zIndex || '0', 10)
        return zIndex > highest.zIndex ? { card, zIndex } : highest
      }, { card: null, zIndex: -Infinity }).card
      if (topCard && typeof topCard.tilt === 'function') {
        topCard.tilt('left')
      } else {
        console.warn('Top card does not have a tilt function or was not found')
      }
    }
    return this.setChange ? setTimeout(tilt, 250) : tilt()
  }

  tiltBottomCard () {
    // check
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    const cards = Array.from(this.pile.querySelectorAll('.card'))
    this.currentSet = this.currentSet > 0 ? this.currentSet - 1 : 0
    const tilt = () => {
      const bottomCard = cards.reduce((lowest, card) => {
        const zIndex = parseInt(window.getComputedStyle(card).zIndex || '0', 10)
        return zIndex < lowest.zIndex ? { card, zIndex } : lowest
      }, { card: null, zIndex: Infinity }).card
      if (bottomCard && typeof bottomCard.tilt === 'function') {
        bottomCard.tilt('right')
      } else {
        console.warn('Bottom card does not have a tilt function or was not found')
      }
    }
    return tilt()
  }

  renderLeftIcon () {
    return html`
      <svg
        fill="#000000"
        height="64px" 
        width="64px" 
        version="1.1" 
        id="Icons" 
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 32 32" xml:space="preserve"
        >
        <path 
          d="M25,27.8c-0.5,0-0.9-0.3-1-0.8l0-0.2c-1-4.4-4.6-7.5-9-8v3.5c0,0.8-0.5,1.5-1.2,1.8c-0.8,0.3-1.6,0.1-2.2-0.4l-8.3-8.3
          c-0.4-0.4-0.4-1,0-1.4l8.3-8.3C12.2,5.2,13,5,13.8,5.4c0.8,0.3,1.2,1,1.2,1.8v3.6c6.2,0.5,11,5.7,11,12v4c0,0.5-0.4,0.9-0.9,1
          C25.1,27.8,25,27.8,25,27.8z"
        />
    </svg>
    
    `
  }

  renderRightIcon () {
    return html`
      <svg 
        fill="#000000"
        height="64px" 
        width="64px"
        version="1.1"
        id="Icons"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 32 32"
        xml:space="preserve"
      >
      <path 
        d="M18.8,28.8c-0.3,0-0.5-0.1-0.8-0.2c-0.8-0.3-1.2-1-1.2-1.8v-3.6c-6.2-0.5-11-5.7-11-12v-4c0-0.5,0.4-0.9,0.9-1
        c0.5-0.1,1,0.3,1.1,0.8l0,0.2c1,4.4,4.6,7.5,9,8v-3.5c0-0.8,0.5-1.5,1.2-1.8c0.8-0.3,1.6-0.1,2.2,0.4l8.3,8.3c0.4,0.4,0.4,1,0,1.4
        l-8.3,8.3C19.8,28.6,19.3,28.8,18.8,28.8z"
      />
    </svg>
    `
  }

  render () {
    return html`
     <div class="container">
        <div class="inner-container">
          <div
            class="left-click-area"
            @click=${this.tiltTopCard}
          >
          ${this.renderLeftIcon()}
          </div>
          <div class="card-container"></div>
          <div
            class="right-click-area"
            @click=${this.tiltBottomCard}
          >
          ${this.renderRightIcon()}
          </div>
        </div>
      </div>
    `
  }
}
