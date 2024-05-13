import { Initialized, Pending, Success } from '@abraham/remotedata';
import { computed, customElement, observe, property } from '@polymer/decorators';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import { RouterLocation } from '@vaadin/router';
import '../components/hero/hero-block';
import '../elements/content-loader';
import '../elements/filter-menu';
import '../elements/header-bottom-toolbar';
import '../elements/shared-styles';
import '../elements/sticky-element';
import { Filter } from '../models/filter';
import { FilterGroup } from '../models/filter-group';
import { RootState, store } from '../store';
import { selectFilters } from '../store/filters/selectors';
import { ReduxMixin } from '../store/mixin';
import { fetchSchedule } from '../store/schedule/actions';
import { initialScheduleState } from '../store/schedule/state';
import { fetchSessions } from '../store/sessions/actions';
import { selectFilterGroups } from '../store/sessions/selectors';
import { initialSessionsState, SessionsState } from '../store/sessions/state';
import { fetchSpeakers } from '../store/speakers/actions';
import { initialSpeakersState, SpeakersState } from '../store/speakers/state';
import { contentLoaders, heroSettings } from '../utils/data';
import { updateMetadata } from '../utils/metadata';

@customElement('schedule-page')
export class SchedulePage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
          height: 100%;
          font-family: montserrat;
        }

        .container {
          min-height: 80%;
        }

        .subject {
          margin: 0 auto;
          padding: 16px 32px;
          max-width: var(--max-container-width);
          align-items: center;
          display: flex;
          justify-content: center;
          font-size: 20px;
        }

        .button-container {
          max-width: var(--max-container-width);
          margin: 0 auto;
          margin-top: -20px;
          position: absolute;
          margin-left: -30px;
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

        paper-progress {
          width: 100%;
          --paper-progress-active-color: var(--default-primary-color);
          --paper-progress-secondary-color: var(--default-primary-color);
        }

        @media (max-width: 640px) {
          .container {
            padding: 0 0 32px;
          }
        }

        @media (min-width: 640px) {
        }
      </style>

      <hero-block
        background-image="[[heroSettings.background.image]]"
        background-color="[[heroSettings.background.color]]"
        font-color="[[heroSettings.fontColor]]"
      >
        <div class="hero-title">[[heroSettings.title]]</div>
        <p class="hero-description">[[heroSettings.description]]</p>
        <div class="button-container">
          <paper-button on-click="openCFP"> Share your photos </paper-button>
        </div>
        <sticky-element slot="bottom">
          <header-bottom-toolbar location="[[location]]"></header-bottom-toolbar>
        </sticky-element>
      </hero-block>

      <paper-progress indeterminate hidden$="[[!pending]]"></paper-progress>

      <filter-menu
        filter-groups="[[filterGroups]]"
        selected-filters="[[selectedFilters]]"
      ></filter-menu>

      <template is="dom-if" if="[[latestYear]]">
        <div class="subject">
          <p>Subject to change</p>
        </div>
      </template>

      <div class="container">
        <content-loader
          card-padding="15px"
          card-margin="16px 0"
          card-height="140px"
          avatar-size="0"
          avatar-circle="0"
          title-top-position="20px"
          title-height="42px"
          title-width="70%"
          load-from="-20%"
          load-to="80%"
          blur-width="300px"
          items-count="[[contentLoaders.itemsCount]]"
          hidden$="[[!pending]]"
          layout
        >
        </content-loader>

        <slot></slot>
      </div>

      <footer-block></footer-block>
    `;
  }

  private heroSettings = heroSettings.schedule;
  private contentLoaders = contentLoaders.schedule;

  @property({ type: Object })
  schedule = initialScheduleState;
  @property({ type: Object })
  sessions = initialSessionsState;
  @property({ type: Object })
  speakers = initialSpeakersState;

  @property({ type: Array })
  private filterGroups: FilterGroup[] = [];
  @property({ type: Array })
  private selectedFilters: Filter[] = [];
  @property({ type: Object })
  location: RouterLocation | undefined;

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(this.heroSettings.title, this.heroSettings.metaDescription);

    if (this.sessions instanceof Initialized) {
      store.dispatch(fetchSessions);
    }

    if (this.speakers instanceof Initialized) {
      store.dispatch(fetchSpeakers);
    }
  }

  override stateChanged(state: RootState) {
    super.stateChanged(state);
    this.schedule = state.schedule;
    this.speakers = state.speakers;
    this.sessions = state.sessions;
    this.filterGroups = selectFilterGroups(state);
    this.selectedFilters = selectFilters(state);
  }

  @computed('location', 'schedule')
  private get latestYear() {
    if (this.location && this.schedule instanceof Success) {
      const {
        params: { id },
        pathname,
      } = this.location;
      if (pathname.endsWith('schedule/')) {
        return true;
      } else {
        return id ? id.includes('2023') : false;
      }
    } else {
      return undefined;
    }
  }

  onAfterEnter(location: RouterLocation) {
    this.location = location;
  }

  @observe('sessions', 'speakers')
  private onSessionsAndSpeakersChanged(sessions: SessionsState, speakers: SpeakersState) {
    if (
      this.schedule instanceof Initialized &&
      sessions instanceof Success &&
      speakers instanceof Success
    ) {
      store.dispatch(fetchSchedule);
    }
  }

  @computed('schedule')
  get pending() {
    return this.schedule instanceof Pending;
  }

  private openCFP() {
    window.open('https://go.devfestyyc.com/photos', '_blank');
  }
}
