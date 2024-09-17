/* eslint-disable */
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
          overflow: hidden;
        }

        .year-button {
          width: 33%;
          text-align: center;
          padding-top: 0.7em;
          padding-bottom: 0.7em;
          transition: background-color var(--animation);
          cursor: pointer;
        }

        .year-selected {
          background-color: magenta;
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

        .data-container {
          justify-content: center;
          display: flex;
          flex-direction: column;
          align-items: center;
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
          --lazy-image-width: 90%;
          --lazy-image-height: 90%;
          transform: translate(5%, 5%);
          --lazy-image-fit: contain;
          width: var(--lazy-image-width);
          height: var(--lazy-image-height);
        }

        .company-logo-container {
          border: 1px solid #fff;
          width: 200px;
          height: 40px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--text-primary-color);
          margin-top: 20px;
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
        <p>[[speakersBlock.subtitle]]</p>

        <div class="year-selection">
          <template is="dom-if" if="[[_isEqualTo(year, '2019')]]">
            <span year="2019" on-click="filterList" class="year-button border-right year-selected">2019</span>
          </template>
          <template is="dom-if" if="[[!_isEqualTo(year, '2019')]]">
            <span year="2019" on-click="filterList" class="year-button border-right">2019</span>
          </template>
        
          <template is="dom-if" if="[[_isEqualTo(year, '2020')]]">
            <span year="2020" on-click="filterList" class="year-button border-right year-selected">2020</span>
          </template>
          <template is="dom-if" if="[[!_isEqualTo(year, '2020')]]">
            <span year="2020" on-click="filterList" class="year-button border-right">2020</span>
          </template>

          <template is="dom-if" if="[[_isEqualTo(year, '2023')]]">
            <span year="2023" on-click="filterList" class="year-button year-selected">2023</span>
          </template>
          <template is="dom-if" if="[[!_isEqualTo(year, '2023')]]">
            <span year="2023" on-click="filterList" class="year-button">2023</span>
          </template>

          <template is="dom-if" if="[[_isEqualTo(year, '2024')]]">
            <span year="2024" on-click="filterList" class="year-button year-selected">2024</span>
          </template>
          <template is="dom-if" if="[[!_isEqualTo(year, '2024')]]">
            <span year="2024" on-click="filterList" class="year-button">2024</span>
          </template>
        </div>

        <div class="speakers-wrapper">
          <template is="dom-repeat" items="{{filteredSpeakers}}" as="speaker">
            <a class="speaker" href$="[[speakerUrl(speaker.id)]]">
              <div class="data-container" relative>
                <lazy-image
                  class="photo"
                  src="[[speaker.photoUrl]]"
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
                <template is="dom-if" if="[[speaker.companyLogoUrl]]">
                  <div class="company-logo-container">
                    <lazy-image
                      class="company-logo"
                      src="[[speaker.companyLogoUrl]]"
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
        <template is="dom-if" if="[[!filteredSpeakers.length]]">
          <!--<h1 style="text-align: center">Coming Soon!</h1>-->
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
            <!-- <a href="https://go.devfestyyc.com/cfp" target="blank">
              <paper-button class="action-button">
                <span>Call for Speakers</span>
              </paper-button>
            </a> -->
            <span>2024 Speaker Lineup launching September 30th.</span>
          </div>
        </template>

        <template is="dom-if" if="[[filteredSpeakers.length]]">
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
            <a href="[[speakersBlock.callToAction.link]]">
              <paper-button class="action-button">
                <span>[[speakersBlock.callToAction.label]]</span>
              </paper-button>
            </a>
          </div>
        </template>
      </div>
    `;
  }

  @property({ type: Object })
  speakers = initialSpeakersState;

  @property({ type: Array })
  filteredSpeakers: Speaker[] = [];

  @property({ type: String })
  year = '2023';

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
    this.filterSpeakers();
    return this.filteredSpeakers;
  }

  filterSpeakers() {
    if (this.speakers instanceof Success) {
      const { data } = this.speakers;
      const filteredSpeakers = data.filter(
        (speaker) => speaker.featured && speaker.year && speaker.year.includes(this.year)
      );
      this.filteredSpeakers = randomOrder(filteredSpeakers).slice(0, 6);
    } else {
      this.filteredSpeakers = [];
    }
  }

  filterList(event: any) {
    const year = event.target.getAttribute('year');
    this.year = year;
    this.filterSpeakers();
  }

  speakerUrl(id: string) {
    return router.urlForName('speaker-page', { id });
  }

  _isEqualTo(year: string, selectedYear: string) {
    return year === selectedYear;
  }
}
