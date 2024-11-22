import { html, css, LitElement } from 'lit'

export class LitLaroid extends LitElement {
  static styles = css`
    :host {
      --polaroid-width: var(--lit-laroid-width, 220px);
      --polaroid-height: calc(var(--polaroid-width) * 1.09);
      --icon-size: calc(var(--polaroid-width) * 0.18);
      display: block;
      width: clamp(220px, var(--polaroid-width), 100%);
      perspective: 1000px;
    }

    .polaroid-wrapper {
      position: relative;
      width: var(--polaroid-width);
      height: var(--polaroid-height);
      transition: transform 0.8s;
      transform-style: preserve-3d;
      cursor: pointer;
      outline: none; 
    }

    .polaroid-wrapper.flipped {
      transform: rotateY(180deg);
    }

    .polaroid,
    .polaroid-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border: 1px solid #ddd;
      background-color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .polaroid {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 1rem;
    }

    .polaroid img {
      width: 100%;
      height: auto;

    }

    .caption {
      padding-top: 10px;
      font-size: 1.1em;
      width: 100%;
      transform: translateX(-1rem) translateY(-1rem) rotate(-7deg);
      color: var(--lit-laroid-caption-color, #333);
      font-family: "Playwrite BE WAL", cursive;
      font-optical-sizing: auto;
      text-align: left;
      font-weight: 900;
      white-space: nowrap;
      text-overflow: ellipsis;
      z-index: 1;
      backface-visibility: hidden
    }

    .polaroid-back {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotateY(180deg);
      padding: 1rem; 
    }

    .icon {
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: var(--icon-size);
      height: var(--icon-size);
      background-color: var(--lit-laroid-icon-bg, #a8a6a6);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1em;
      font-family: "Playwrite BE WAL", cursive;
    }

   @keyframes tilt-move-left {
      0% {
        transform: rotate(0) translateX(0);
      }
      50% {
        transform: rotate(-10deg) translateX(-200px);
      }
      100% {
        transform: rotate(0) translateX(0);
      }
    }

    @keyframes tilt-move-right {
      0% {
        transform: rotate(0) translateX(0);
      }
      50% {
        transform: rotate(10deg) translateX(200px);
      }
      100% {
        transform: rotate(0) translateX(0);
      }
    }


    .tilt-left {
      animation: tilt-move-left 0.5s ease forwards;
    }

    .tilt-right {
      animation: tilt-move-right 0.5s ease forwards;
    }
  `

  static properties = {
    imageUrl: { type: String },
    caption: { type: String },
    label: { type: String },
    flipped: { type: Boolean }
  }

  constructor () {
    super()
    this.imageUrl = 'https://picsum.photos/400'
    this.caption = 'A default caption'
    this.flipped = false
    this.tilted = ''
    this.label = 'label'
  }

  tilt (direction) {
    this.tilted = 'tilt-' + direction
    const wrapper = this.renderRoot.querySelector('.polaroid-wrapper')
    const handleAnimationEnd = () => {
      this.tilted = ''
      this.requestUpdate()
      wrapper.removeEventListener('animationend', handleAnimationEnd)
      const newEvent = new CustomEvent('on-tilt-finished', {
        bubbles: true,
        composed: true,
        detail: { direction }
      })
      this.dispatchEvent(newEvent)
    }
    wrapper.addEventListener('animationend', handleAnimationEnd)
    this.requestUpdate()
  }

  toggleFlip () {
    this.flipped = !this.flipped
  }

  handleKeydown (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.toggleFlip()
    }
  }

  render () {
    return html`
      <div
        class="polaroid-wrapper ${this.flipped ? 'flipped' : ''} ${this.tilted}"
        @click="${this.toggleFlip}"
        @keydown="${this.handleKeydown}"
        tabindex="0"
        role="button"
        aria-pressed="${this.flipped}"
      >
        <div class="polaroid">
          <img src=${this.imageUrl} alt="Polaroid style card" />
          <div class="caption">${this.caption}</div>
          <div
            class="icon"
            tabindex="0"
            aria-label="Change classification option"
          >
            ${this.label}
          </div>
        </div>
        <div class="polaroid-back">
          <slot></slot>
        </div>
      </div>
    `
  }
}
