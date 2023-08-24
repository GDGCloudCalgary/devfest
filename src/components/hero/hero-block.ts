// import { PropertyValues } from '@lit/reactive-element';
import '@power-elements/lazy-image';
import { css, html, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { setHeroSettings } from '../../store/ui/actions';
import { ThemedElement } from '../themed-element';

@customElement('hero-block')
export class HeroBlock extends ThemedElement {
  @property({ type: String, attribute: 'background-image' })
  backgroundImage = '';
  @property({ type: String, attribute: 'background-color' })
  backgroundColor = '#fff';
  @property({ type: String, attribute: 'font-color' })
  fontColor = '#000';
  @property({ type: Boolean, attribute: 'hide-logo' })
  hideLogo = false;

  static override get styles() {
    return [
      ...super.styles,
      css`
        :host {
          margin-top: -56px;
          display: block;
          font-family: montserrat;
        }

        .hero-block {
          height: 100%;
          position: relative;
          color: inherit;
          background-color: var(--primary-background-color);
          margin-top: -107px;
        }

        .hero-overlay {
          background-color: var(--primary-background-color);
          opacity: 0;
          transition: opacity 0.3s;
          position: absolute;
          --tw-gradient-to: rgba(32, 33, 36, 0.1);
          --tw-gradient-from: #202124;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(32, 33, 36, 0));
          background-image: linear-gradient(to top, var(--tw-gradient-stops));
        }

        .hero-overlay[show] {
          opacity: 1;
        }

        .hero-image {
          position: absolute;
          background-color: #1318a2;
          height: 100%;
          width: 100%;
          --tw-gradient-to: rgba(32, 33, 36, 0.1);
          --tw-gradient-from: #202124;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(32, 33, 36, 0));
          background-image: linear-gradient(to top, var(--tw-gradient-stops));
        }

        .hero-block-canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: var(--primary-background-color);
          filter: blur(100px);
        }

        .container {
          padding: 0;
          width: 100%;
          height: unset;
          z-index: 0;
          position: unset;
          margin-top: 50px;
        }

        .hero-content {
          padding: 80px 32px 32px;
          position: unset;
        }

        div ::slotted(.hero-title) {
          margin: 30px 0;
          font-size: 40px;
        }

        div ::slotted(.hero-description) {
          margin-bottom: 30px;
          max-width: 600px;
        }

        @media (min-width: 812px) {
          :host {
            margin-top: -64px;
          }

          .hero-content {
            padding-top: 120px;
            padding-bottom: 60px;
          }
        }
      `,
    ];
  }

  override render() {
    return html`
      <div
        class="hero-block"
        style="${styleMap({ color: this.fontColor })}"
        layout
        start
        vertical
        center-justified
      >
        <!--${this.backgroundImage && this.image}-->
        <canvas id="heroBlockCanvas" class="hero-block-canvas"></canvas>
        <!--<div class="hero-image"></div>-->
        <!--<div class="hero-overlay" ?show="${!!this.backgroundImage}" fit></div>-->
        <div class="container">
          <div class="hero-content">
            <slot></slot>
          </div>
        </div>
      </div>
      <slot name="bottom"></slot>
    `;
  }

  private get image() {
    return html`
      <lazy-image
        class="hero-image"
        src="${this.backgroundImage}"
        style="${styleMap({ backgroundColor: this.backgroundColor })}"
        fit
      ></lazy-image>
    `;
  }

  @query('#heroBlockCanvas')
  canvas!: HTMLCanvasElement;

  circles: Circle[] = [];

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    setHeroSettings({
      backgroundImage: this.backgroundImage,
      backgroundColor: this.backgroundColor,
      fontColor: this.fontColor,
      hideLogo: this.hideLogo,
    });

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (ctx) {
      // create gradient for canvas
      const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#131954');
      gradient.addColorStop(0.9, '#1318a2');
      gradient.addColorStop(1, '#202124');
      // fill canvas with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Create animation loop
      const animate = () => {
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add new circle every 10 frames
        if (Math.random() < 0.02) {
          this.addCircle();
        }

        // Update and draw circles
        this.circles.forEach((circle) => {
          circle.update();
          circle.draw(ctx);
        });

        // Remove faded circles
        this.circles.filter((circle) => !circle.isFaded);

        // Request next animation frame
        requestAnimationFrame(animate);
      };

      // Start animation loop
      animate();
    }
  }

  getRandom(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Create function to add new circle
  addCircle = () => {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;

    const colors = [
      [246, 100, 28],
      [151, 20, 112],
      [21, 188, 218],
      [19, 24, 162],
      [255, 20, 115],
    ];
    const circle = new Circle(x, y, colors[this.getRandom(0, 3)] as number[], this.canvas);
    this.circles.push(circle);
  };
}

// Create Circle class
class Circle {
  x: number;
  y: number;
  color: number[];
  radius: number;
  maxRadius: number;
  alpha: number;
  constructor(x: number, y: number, color: number[], canvas: HTMLCanvasElement) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 0;
    this.maxRadius = Math.max(canvas.width, canvas.height);
    this.alpha = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.join(',')}, ${this.alpha})`;
    ctx.fill();
  }

  update() {
    this.radius += 0.1;
    this.alpha -= 0.001;
  }

  get isFaded() {
    return this.alpha <= 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hero-block': HeroBlock;
  }
}
