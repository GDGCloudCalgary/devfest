/* eslint-disable */
import { Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-icon-button';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/hero/simple-hero';
import '../components/text-truncate';
import '../elements/content-loader';
import '../elements/filter-menu';
import '../elements/previous-speakers-block';
import '../elements/shared-styles';
import { Filter } from '../models/filter';
import { FilterGroup, FilterGroupKey } from '../models/filter-group';
import { Speaker, SpeakerWithTags } from '../models/speaker';
import { router } from '../router';
import { RootState, store } from '../store';
import { selectFilters } from '../store/filters/selectors';
import { ReduxMixin } from '../store/mixin';
import { selectFilterGroups } from '../store/sessions/selectors';
import { fetchSpeakers } from '../store/speakers/actions';
import { selectFilteredSpeakers } from '../store/speakers/selectors';
import { initialSpeakersState } from '../store/speakers/state';
import { contentLoaders, heroSettings } from '../utils/data';
import '../utils/icons';
import { updateMetadata } from '../utils/metadata';

@customElement('speakers-page')
export class SpeakersPage extends ReduxMixin(PolymerElement) {
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
          max-width: var(--max-container-width);
          margin: 0 auto;
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

        .data-container {
          justify-content: center;
          display: flex;
          flex-direction: column;
          align-items: center;
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

      <simple-hero page="speakers"></simple-hero>

      <paper-progress indeterminate hidden$="[[contentLoaderVisibility]]"></paper-progress>

      <filter-menu
        filter-groups="[[filterGroups]]"
        selected-filters="[[selectedFilters]]"
        results-count="[[filteredSpeakers.length]]"
      ></filter-menu>

      <content-loader
        class="container"
        card-padding="32px"
        card-height="400px"
        avatar-size="128px"
        avatar-circle="64px"
        horizontal-position="50%"
        border-radius="4px"
        box-shadow="var(--box-shadow)"
        items-count="[[contentLoaders.speakers.itemsCount]]"
        hidden$="[[contentLoaderVisibility]]"
      ></content-loader>

      <div class="section">
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
      </div>

      <div class="container">
        <template is="dom-repeat" items="{{filteredSpeakers}}" as="speaker">
          <a class="speaker card" href$="[[speakerUrl(speaker.id)]]">
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
              <h2 class="name">[[speaker.name]]</h2>
              <div class="origin">[[speaker.country]]</div>

              <text-truncate lines="5">
                <div class="bio">[[speaker.bio]]</div>
              </text-truncate>
            </div>

            <div class="contacts">
              <template is="dom-repeat" items="[[speaker.socials]]" as="social">
                <a href$="[[social.link]]" target="_blank" rel="noopener noreferrer">
                  <paper-icon-button
                    class="social-icon"
                    icon="hoverboard:{{social.icon}}"
                  ></paper-icon-button>
                </a>
              </template>
            </div>
          </a>
        </template>
      </div>
      <template is="dom-if" if="[[!filteredSpeakers.length]]">
        <!--<h1 style="text-align: center">Coming Soon!</h1>-->
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 100px">
          <!-- <a href="https://go.devfestyyc.com/cfp" target="blank">
            <paper-button class="action-button">
              <span>Call for Speakers</span>
            </paper-button>
          </a> -->
          <span>2024 Speaker Lineup launching September 15th</span>
        </div>
      </template>

      <footer-block></footer-block>
    `;

    // <previous-speakers-block></previous-speakers-block>
  }

  private heroSettings = heroSettings.speakers;
  private contentLoaders = contentLoaders;

  @property({ type: Object })
  speakers = initialSpeakersState;

  @property({ type: Array })
  private filterGroups: FilterGroup[] = [];
  @property({ type: Array })
  private selectedFilters: Filter[] = [];

  @property({ type: Array })
  filteredSpeakers: Speaker[] = [];

  @property({ type: String })
  year = '2023';

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(this.heroSettings.title, this.heroSettings.metaDescription);

    if (this.speakers instanceof Initialized) {
      store.dispatch(fetchSpeakers);
    }
  }

  override stateChanged(state: RootState) {
    super.stateChanged(state);
    this.speakers = state.speakers;
    this.filterGroups = selectFilterGroups(state, [FilterGroupKey.tags]);
    this.selectedFilters = selectFilters(state);
    this.filteredSpeakers = selectFilteredSpeakers(state).filter(
      (speaker) => speaker.year && speaker.year.includes(this.year)
    );
  }

  @computed('speakers')
  get featuredSpeakers(): Speaker[] {
    this.filterSpeakers();
    return this.filteredSpeakers;
  }

  @computed('speakers')
  get contentLoaderVisibility() {
    return this.speakers instanceof Success;
  }

  filterSpeakers() {
    if (this.speakers instanceof Success) {
      const { data } = this.speakers;
      const filteredSpeakers = data.filter(
        (speaker) => speaker.year && speaker.year.includes(this.year)
      );
      this.filteredSpeakers = filteredSpeakers;
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

  private openCFP() {
    window.open('https://go.devfestyyc.com/cfp', '_blank');
  }

  _isEqualTo(year: string, selectedYear: string) {
    return year === selectedYear;
  }
}
