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
      font-size: 1.1rem;
      padding-left: 1.2rem;
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

    @keyframes scale {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .scale {
      animation: scale 0.9s ease-in-out infinite;
    }

    @keyframes rotate {
      0% {
      transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .rotate {
      animation: rotate 1.0s ease-in-out infinite;
    }

    @keyframes shake {
       0% {
        transform: translate(0, 0);
      }
      25% {
        transform: translate(0, 5px);
      }
      50% {
        transform: translate(0, -5px);
      }
      75% {
        transform: translate(-0, 5px);
      }
      100% {
        transform: translate(0, 0);
      }
    }

    .shake {
      animation: shake 1.2s ease-in-out infinite;
    }
  `

  static properties = {
    dataSource: { type: Object },
    flipped: { type: Boolean },
    loading: { type: Boolean }
  }

  constructor () {
    super()
    this.flipped = false
    this.tilted = ''
    this.loading = false
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

  setLoading () {
    this.loading = true
    const setFalse = () => {
      this.loading = false
    }
    setTimeout(setFalse, 1000)
  }

  updated (changedProperties) {
    if (changedProperties.has('dataSource')) {
      this.setLoading()
    }
  }

  render () {
    return html`${this.loading ? this.renderLoading() : this.renderCard()} `
  }

  renderLoading () {
    return html`
      <div
        class="polaroid-wrapper scale ${this.flipped ? 'flipped' : ''}"
        @click="${this.toggleFlip}"
        @keydown="${this.handleKeydown}"
        tabindex="0"
        role="button"
        aria-pressed="${this.flipped}"
      >
        <div class="polaroid">
          ${this.renderLoadingImageSvg()}
          <div class="caption shake">Developing!</div>
          <div
            class="icon rotate"
            tabindex="0"
            aria-label="Change classification option"
          >
           ${this.renderLoadingIconSvg()} 
          </div>
        </div>
        <div class="polaroid-back">
         <p>Still not ready?! There might be something wrong with the page! Try Refreshing</p> 
        </div>
      </div>
    `
  }

  renderLoadingImageSvg () {
    return html`
      <svg
        fill="#000000"
        height="400px"
        width="400px"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
        xml:space="preserve"
      >
        <g>
          <g>
            <g>
              <path
                d="M213.333,34.133h85.333c4.71,0,8.533-3.823,8.533-8.533c0-4.71-3.823-8.533-8.533-8.533h-85.333
                c-4.71,0-8.533,3.823-8.533,8.533C204.8,30.31,208.623,34.133,213.333,34.133z"
              />
              <path
                d="M213.333,85.333h85.333c4.71,0,8.533-3.823,8.533-8.533s-3.823-8.533-8.533-8.533h-85.333
                c-4.71,0-8.533,3.823-8.533,8.533S208.623,85.333,213.333,85.333z"
              />
              <path
                d="M85.333,110.933v290.133c0,4.71,3.823,8.533,8.533,8.533h324.267c4.71,0,8.533-3.823,8.533-8.533V110.933
                c0-4.71-3.823-8.533-8.533-8.533H93.867C89.156,102.4,85.333,106.223,85.333,110.933z M102.4,119.467h307.2v273.067H102.4
                V119.467z"
              />
              <path
                d="M136.533,76.8c0,4.71,3.823,8.533,8.533,8.533H179.2c4.71,0,8.533-3.823,8.533-8.533V8.533
                c0-4.71-3.823-8.533-8.533-8.533h-34.133c-4.71,0-8.533,3.823-8.533,8.533v8.533h-128C3.823,17.067,0,20.89,0,25.6
                c0,4.71,3.823,8.533,8.533,8.533h128V76.8z M153.6,17.067h17.067v51.2H153.6V17.067z"
              />
              <path
                d="M503.467,17.067h-128V8.533c0-4.71-3.823-8.533-8.533-8.533H332.8c-4.71,0-8.533,3.823-8.533,8.533V76.8
                c0,4.71,3.823,8.533,8.533,8.533h34.133c4.71,0,8.533-3.823,8.533-8.533V34.133h128c4.71,0,8.533-3.823,8.533-8.533
                C512,20.89,508.177,17.067,503.467,17.067z M358.4,68.267h-17.067v-51.2H358.4V68.267z"
              />
              <path
                d="M418.133,68.267h-17.067c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h17.067
                c14.114,0,25.6,11.486,25.6,25.6v358.4c0,14.114-11.486,25.6-25.6,25.6H93.867c-14.114,0-25.6-11.486-25.6-25.6v-358.4
                c0-14.114,11.486-25.6,25.6-25.6h17.067c4.71,0,8.533-3.823,8.533-8.533s-3.823-8.533-8.533-8.533H93.867
                c-23.526,0-42.667,19.14-42.667,42.667v358.4C51.2,492.86,70.34,512,93.867,512h324.267c23.526,0,42.667-19.14,42.667-42.667
                v-358.4C460.8,87.407,441.66,68.267,418.133,68.267z"
              />
            </g>
          </g>
        </g>
      </svg>
    `
  }

  renderLoadingIconSvg () {
    return html`
      <svg 
        width="64px" 
        height="64px" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M11 2L13 3.99545L12.9408 4.05474M13 18.0001L11 19.9108L11.0297 19.9417M12.9408 
            4.05474L11 6M12.9408 4.05474C12.6323 4.01859 12.3183 4 12 4C7.58172 4 4 7.58172 4 12C4 14.5264 5.17107 
            16.7793 7 18.2454M17 5.75463C18.8289 7.22075 20 9.47362 20 12C20 16.4183 16.4183 20 12 20C11.6716 20 11.3477 
            19.9802 11.0297 19.9417M13 22.0001L11.0297 19.9417" 
            stroke="#000000" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
      </svg>
    `
  }

  renderCard () {
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
          <img src=${this.dataSource?.imageUrl} alt="Polaroid style card" />
          <div class="caption">${this.dataSource?.caption}</div>
          <div
            class="icon"
            tabindex="0"
            aria-label="Change classification option"
          >
            ${this.dataSource?.label}
          </div>
        </div>
        <div class="polaroid-back">
          <slot></slot>
        </div>
      </div>
    `
  }
}
