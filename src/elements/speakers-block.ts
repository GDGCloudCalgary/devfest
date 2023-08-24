import { Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/text-truncate';
import { Speaker } from '../models/speaker';
import { router } from '../router';
import { RootState, store } from '../store';
import { ReduxMixin } from '../store/mixin';
import { fetchSpeakers } from '../store/speakers/actions';
import { initialSpeakersState } from '../store/speakers/state';
import { randomOrder } from '../utils/arrays';
import { speakersBlock } from '../utils/data';
import '../utils/icons';
import './shared-styles';

@customElement('speakers-block')
export class SpeakersBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
          font-family: montserrat;
        }

        .big-heading {
          font-size: 40px;
          line-height: 50px;
        }

        .section {
          padding-top: 6rem;
          padding-bottom: 6rem;
          display: flex;
          flex-direction: column;
        }

        .speakers-wrapper {
          margin-top: 60px;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          grid-gap: 32px 16px;
          width: 80%;
          align-self: center;
        }

        .action-button {
          margin: 8px;
          padding-left: 2rem;
          padding-right: 2rem;
          border-radius: 9999px;
          background-color: transparent;
          border: 1px solid #fff;
          color: #fff;
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
        }

        .year-button:hover {
          background-color: var(--primary-color-transparent);
        }

        .border-right {
          border-right: 1px solid #fff;
        }

        .speaker {
          text-align: center;
          display: flex;
          flex-direction: column;
          padding: 50px 30px;
          border-radius: 20px;
          background-color: #2b2c2f;
        }

        .photo {
          display: inline-block;
          --lazy-image-width: 72px;
          --lazy-image-height: 72px;
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
          left: calc(50% + 24px);
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
          transform: translate(0, 100%);
        }

        .badge:nth-of-type(2):hover {
          transform: translate3d(0, 100%, 20px) scale(1.1);
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
          line-height: 1.1;
          font-weight: 600;
        }

        .origin {
          margin-top: 4px;
          font-size: 14px;
          line-height: 1.1;
        }

        .cta-button {
          margin-top: 24px;
        }

        @media (min-width: 640px) {
          .photo {
            --lazy-image-width: 128px;
            --lazy-image-height: 128px;
          }

          .name {
            font-size: 20px;
          }
        }

        @media (max-width: 640px) {
          .company-logo-container {
            bottom: 0%;
            right: 20%;
          }
        }

        @media (min-width: 812px) {
          .speakers-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }

          .badges {
            left: calc(50% + 32px);
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
        }

        @media (min-width: 1024px) {
          .speakers-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      </style>

      <div class="container section">
        <h1 class="container-title big-heading">[[speakersBlock.title]]</h1>

        <div class="year-selection">
          <span class="year-button border-right">2019</span>
          <span class="year-button border-right">2020</span>
          <span class="year-button">2023</span>
        </div>

        <div class="speakers-wrapper">
          <template is="dom-repeat" items="[[featuredSpeakers]]" as="speaker">
            <a class="speaker" href$="[[speakerUrl(speaker.id)]]">
              <div relative>
                <lazy-image
                  class="photo"
                  src="[[speaker.photo]]"
                  alt="[[speaker.name]]"
                ></lazy-image>
                <div class="badges" layout horizontal>
                  <template is="dom-repeat" items="[[speaker.badges]]" as="badge">
                    <a
                      class$="badge [[badge.name]]-b"
                      href$="[[badge.link]]"
                      target="_blank"
                      rel="noopener noreferrer"
                      title$="[[badge.description]]"
                      layout
                      horizontal
                      center-center
                    >
                      <iron-icon icon="hoverboard:[[badge.name]]" class="badge-icon"></iron-icon>
                    </a>
                  </template>
                </div>
                <template is="dom-if" if="[[speaker.companyLogo]]">
                  <div class="company-logo-container">
                    <lazy-image
                      class="company-logo"
                      src="[[speaker.companyLogo]]"
                      alt="[[speaker.company]]"
                    ></lazy-image>
                  </div>
                </template>
              </div>

              <div class="description">
                <h3 class="name">[[speaker.name]]</h3>
                <span class="origin" class="name">[[speaker.company]]</span>
              </div>
            </a>
          </template>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
          <a href="[[speakersBlock.callToAction.link]]">
            <paper-button class="action-button">
              <span>[[speakersBlock.callToAction.label]]</span>
            </paper-button>
          </a>
        </div>
      </div>
    `;
  }

  @property({ type: Object })
  speakers = initialSpeakersState;

  private speakersBlock = speakersBlock;

  override connectedCallback() {
    super.connectedCallback();

    if (this.speakers instanceof Initialized) {
      store.dispatch(fetchSpeakers);
    }
  }

  override stateChanged(state: RootState) {
    super.stateChanged(state);
    this.speakers = state.speakers;
  }

  @computed('speakers')
  get featuredSpeakers(): Speaker[] {
    if (this.speakers instanceof Success) {
      const { data } = this.speakers;
      const filteredSpeakers = data.filter((speaker) => speaker.featured);
      const randomSpeakers = randomOrder(filteredSpeakers.length ? filteredSpeakers : data);
      return randomSpeakers.slice(0, 6);
    } else {
      return [];
    }
  }

  speakerUrl(id: string) {
    return router.urlForName('speaker-page', { id });
  }
}
