import { customElement } from '@polymer/decorators';
import '@polymer/paper-fab';
import { html, PolymerElement } from '@polymer/polymer';
import '../utils/icons';
import { scrollToTop } from '../utils/scrolling';
import './footer-nav';
import './footer-rel';
import './footer-social';

@customElement('footer-block')
export class FooterBlock extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          margin-top: 40px;
          display: block;
          position: relative;
          font-size: 14px;
          line-height: 1.5;
          font-family: montserrat;
          background: #2b2c2f;
        }

        .container {
          margin: 0 auto;
          padding: 20px 0;
          position: relative;
        }

        .fab paper-fab {
          background: var(--primary-background-color);
          color: inherit;
          pointer-events: all;
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.24);
        }

        .fab {
          position: absolute;
          right: 25px;
          top: -25px;
          pointer-events: none;
          z-index: 1;
        }

        .ocean {
          height: 5%;
          width: 100%;
          position: absolute;
          margin-top: -15px;
          left: 0;
          pointer-events: none;
        }

        .wave {
          background-image: url('/images/new/wave.svg');
          background-repeat: repeat-x;
          background-size: 500px auto;
          background-position: bottom;
          position: absolute;
          bottom: 0%;
          width: 100%;
          height: 200px;
          animation: wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          z-index: 1;
        }

        .wave:nth-of-type(2) {
          opacity: 0.7;
          animation: swell 5s ease -1.25s infinite,
            wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite;
          z-index: 0;
        }

        @keyframes swell {
          0%,
          100% {
            background-position: right bottom 10px;
          }
          50% {
            background-position: right bottom 0;
          }
        }

        @keyframes wave {
          0% {
            background-position-x: 0%;
          }
          100% {
            background-position-x: -500px;
          }
        }

        @media (min-width: 640px) {
          .container {
            padding: 15px 36px;
          }
        }
      </style>

      <div class="ocean">
        <div class="wave"></div>
        <div class="wave wave2"></div>
      </div>

      <div class="container">
        <div class="fab">
          <paper-fab class="back-to-top" icon="hoverboard:up" on-click="backToTop"></paper-fab>
        </div>
        <footer-social layout flex flex-auto horizontal wrap></footer-social>
        <footer-rel></footer-rel>
        <footer-nav layout horizontal wrap justified center></footer-nav>
      </div>
    `;
  }

  backToTop() {
    scrollToTop();
  }
}
