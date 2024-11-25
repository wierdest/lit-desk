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
    }


    .left-click-area,
    .right-click-area {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 30%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .left-click-area {
      left: 0;
    }

    .right-click-area {
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

    .pile-container {
      position: relative;
      width: 50%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pile {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center
    }

    ::slotted([slot="card-1"]) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 3
    }

    ::slotted([slot="card-2"]) {
      position: absolute;
      top: calc(50% - var(--lit-desk-pile-offset));
      left: calc(50% - var(--lit-desk-pile-offset));
      transform: translate(-50%, -50%);
      z-index: 2;
    }

    ::slotted([slot="card-3"]) {
      position: absolute;
      top: calc(50% - (var(--lit-desk-pile-offset) * 2));
      left: calc(50% - (var(--lit-desk-pile-offset) * 2));
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  `
  constructor () {
    super()
    this.slotOrder = ['card-1', 'card-2', 'card-3']
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
    const pile = this.renderRoot.querySelector('.pile-container')
    if (templateCard) {
      pile.querySelectorAll('[slot^="card-"]').forEach((el) => el.remove())
      this.slotOrder.forEach((slotName, index) => {
        const clone = templateCard.cloneNode(true)
        console.log('attribute ', slotName)
        clone.setAttribute('slot', slotName)
        this.appendChild(clone)
      })
    }
  }

  handleCardTiltFinished (event) {
    const direction = event.detail.direction
    console.log('Tilt direction ', direction)

    if (direction === 'left') {
      const movedCard = this.slotOrder.shift()
      this.slotOrder.push(movedCard)
    } else if (direction === 'right') {
      const movedCard = this.slotOrder.pop()
      this.slotOrder.unshift(movedCard)
    }
    this.updateZIndices()
  }

  updateZIndices () {
    this.slotOrder.forEach((slotName, index) => {
      const slot = this.shadowRoot.querySelector(`slot[name="${slotName}"]`)
      const [assignedElement] = slot.assignedElements()
      if (assignedElement) {
        assignedElement.style.zIndex = `${(this.slotOrder.length - 1) - index + 1}`
      }
    })
  }

  sendToBack () {
    const slot = this.shadowRoot.querySelector(`slot[name="${this.slotOrder[0]}"]`)
    if (slot) {
      const [card1] = slot.assignedElements()
      if (card1 && typeof card1.tilt === 'function') {
        card1.tilt('left')
      }
    }
  }

  sendToFront () {
    const lastSlotName = this.slotOrder[this.slotOrder.length - 1]
    const slot = this.shadowRoot.querySelector(`slot[name="${lastSlotName}"]`)
    if (slot) {
      const [lastCard] = slot.assignedElements()
      if (lastCard && typeof lastCard.tilt === 'function') {
        lastCard.tilt('right')
      }
    }
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
        <div class="pile-container">
          <div
            class="left-click-area"
            @click="${() => this.sendToBack()}"
          >
          ${this.renderLeftIcon()}
          </div>
          <slot name="card-1"></slot>
          <slot name="card-2"></slot>
          <slot name="card-3"></slot>
          <div
            class="right-click-area"
            @click="${() => this.sendToFront()}"
          >
          ${this.renderRightIcon()}
          </div>
        </div>
      </div>
    `
  }
}
