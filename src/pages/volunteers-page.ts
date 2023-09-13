import { customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-icon-button';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/hero/simple-hero';
import '../components/text-truncate';
import '../elements/content-loader';
import '../elements/shared-styles';
import { RootState } from '../store';
import { ReduxMixin } from '../store/mixin';
import { heroSettings } from '../utils/data';
import '../utils/icons';
import { updateMetadata } from '../utils/metadata';

@customElement('volunteers-page')
export class VolunteersPage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
          height: 100%;
          font-family: montserrat;
        }

        .container {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 16px;
        }

        .section {
          padding-top: 2rem;
          padding-bottom: 2rem;
          display: flex;
          flex-direction: column;
        }

        .button-container {
          max-width: var(--max-container-width);
          margin: 0 auto;
          margin-top: -50px;
        }

        .year-selection {
          width: 60%;
          margin-top: 30px;
          border-radius: 9999px;
          background-color: transparent;
          border: 1px solid #fff;
          color: #fff;
          display: flex;
          align-items: center;
          align-self: center;
          justify-content: space-around;
        }

        .year-button {
          width: 33%;
          text-align: center;
          padding-top: 0.7em;
          padding-bottom: 0.7em;
          transition: background-color var(--animation);
          cursor: pointer;
        }

        .year-button:hover {
          background-color: var(--primary-color-transparent);
        }

        .border-right {
          border-right: 1px solid #fff;
        }

        paper-button {
          margin: 8px;
          padding-left: 2rem;
          padding-right: 2rem;
          border-radius: 9999px;
          background-color: transparent;
          border: 1px solid #fff;
          color: #fff;
          margin-left: 32px;
        }

        .speaker {
          background: var(--primary-background-color);
          text-align: center;
          transition: box-shadow var(--animation);
          padding: 50px 30px;
          border-radius: 20px;
          background-color: #2b2c2f;
        }

        .speaker:hover {
          box-shadow: var(--box-shadow);
        }

        .photo {
          display: inline-block;
          --lazy-image-width: 128px;
          --lazy-image-height: 128px;
          --lazy-image-fit: cover;
          width: var(--lazy-image-width);
          height: var(--lazy-image-height);
          background-color: var(--primary-background-color);
          border-radius: 50%;
          overflow: hidden;
          transform: translateZ(0);
        }

        .badges {
          position: absolute;
          top: 0;
          left: calc(50% + 32px);
        }

        .badge {
          margin-left: -10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #fff;
          transition: transform var(--animation);
        }

        .badge:hover {
          transform: scale(1.1);
        }

        .badge:nth-of-type(2) {
          transform: translate(25%, 75%);
        }

        .badge:nth-of-type(2):hover {
          transform: translate3d(25%, 75%, 20px) scale(1.1);
        }

        .badge:nth-of-type(3) {
          transform: translate(10%, 180%);
        }

        .badge:nth-of-type(3):hover {
          transform: translate3d(10%, 180%, 20px) scale(1.1);
        }

        .badge-icon {
          --iron-icon-width: 12px;
          --iron-icon-height: 12px;
          color: #fff;
        }

        .company-logo {
          --lazy-image-width: 100%;
          --lazy-image-height: 16px;
          --lazy-image-fit: contain;
          width: var(--lazy-image-width);
          height: var(--lazy-image-height);
        }

        .company-logo-container {
          position: absolute;
          bottom: 10%;
          right: 25%;
          border: 1px solid #fff;
          width: 40px;
          height: 40px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-background-color);
        }

        .description {
          color: var(--primary-text-color);
        }

        .name {
          margin-top: 8px;
          line-height: 1;
          font-weight: 600;
        }

        .origin {
          margin-top: 4px;
          font-size: 14px;
          line-height: 1.1;
        }

        .bio {
          margin-top: 16px;
        }

        .contacts {
          margin-top: 16px;
        }

        .social-icon {
          --paper-icon-button: {
            padding: 6px;
            width: 32px;
            height: 32px;
          }
          color: var(--text-primary-color);
        }

        paper-progress {
          width: 100%;
          --paper-progress-active-color: var(--default-primary-color);
          --paper-progress-secondary-color: var(--default-primary-color);
        }

        @media (min-width: 640px) {
          .container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 812px) {
          .container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .container {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      </style>

      <simple-hero page="volunteers"></simple-hero>

      <div class="button-container">
        <paper-button on-click="openCFP"> Volunteer Today! </paper-button>
      </div>

      <footer-block></footer-block>
    `;
  }

  private heroSettings = heroSettings.volunteers;

  @property({ type: Number })
  year = 2020;

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(this.heroSettings.title, this.heroSettings.metaDescription);
  }

  override stateChanged(state: RootState) {
    super.stateChanged(state);
  }

  private openCFP() {
    window.open('https://go.devfestyyc.com/volunteerintake', '_blank');
  }
}
