import { Success } from '@abraham/remotedata';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import { computed, customElement, observe, property } from '@polymer/decorators';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-menu-button';
import '@polymer/paper-tabs';
import { html, PolymerElement } from '@polymer/polymer';
import { Hero } from '../models/hero';
import { selectRouteName } from '../router';
import { RootState, store } from '../store';
import { signOut as signOutAction } from '../store/auth/actions';
import { closeDialog, openSigninDialog } from '../store/dialogs/actions';
import { selectIsDialogOpen } from '../store/dialogs/selectors';
import { DIALOG } from '../store/dialogs/types';
import { ReduxMixin } from '../store/mixin';
import { initialTicketsState, TicketsState } from '../store/tickets/state';
import { initialUiState } from '../store/ui/state';
import { initialUserState } from '../store/user/state';
import {
  buyTicket,
  navigation,
  signIn,
  signOut as signOutText,
  subscribeBlock,
  title,
  location,
  dates
} from '../utils/data';
import './notification-toggle';
import './shared-styles';
import { DialogData } from '../models/dialog-form';
import { subscribe } from '../store/subscribe/actions';
import { initialContentStateState } from '../store/content-state/state';

export const HEADER_HEIGHT = 76;

@customElement('header-toolbar')
export class HeaderToolbar extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          --iron-icon-fill-color: currentColor;
          display: block;
          z-index: 1;
          color: var(--primary-text-color);
          padding-top: 40px;
          padding-bottom: 20px;
          transition: padding-top 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: var(--primary-background-color);
        }

        :host([transparent]) {
          --iron-icon-fill-color: var(--hero-font-color, '#fff');
          background-color: transparent;
          border-bottom-color: transparent;
        }

        app-toolbar {
          margin: 0 auto;
          padding: 0 16px;
          height: auto;
          max-width: var(--max-container-width);
        }

        .toolbar-logo {
          display: block;
          width: 210px;
          height: 32px;
          background-color: var(--text-primary-color);
          transition: background-color var(--animation);
          -webkit-mask: url('/images/new/logo.png') no-repeat;
          -webkit-mask-size: 100%;
          -webkit-mask-position: center;
        }

        .nav-items {
          --paper-tabs-selection-bar-color: var(--default-primary-color);
          --paper-tabs: {
            height: 48px;
          }
        }

        .nav-item a,
        .signin-tab {
          color: inherit;
          padding: 12px 24px;
        }

        .profile-image {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-position: center;
          background-size: cover;
        }

        .dropdown-panel {
          padding: 24px;
          max-width: 300px;
          font-size: 16px;
          color: var(--text-primary-color);
        }

        .dropdown-panel p {
          margin-top: 0;
        }

        .dropdown-panel .panel-actions {
          margin: 0 -16px -16px 0;
        }

        .profile-details .profile-image {
          margin-right: 16px;
          width: 48px;
          height: 48px;
        }

        .profile-name,
        .profile-email {
          font-size: 14px;
          display: block;
          white-space: nowrap;
        }

        .profile-action {
          margin-top: 10px;
          text-transform: uppercase;
          color: var(--default-primary-color);
          font-size: 14px;
          cursor: pointer;
        }

        paper-button iron-icon {
          margin-right: 8px;
          --iron-icon-fill-color: var(--hero-font-color);
        }

        .buy-button {
          height: 100%;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
        }

        .nav-link-button {
          padding: 12px 24px;
          font-family: var(--paper-font-common-base_-_font-family);
          cursor: pointer;
          color: #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .location {
          font-size: 13px;
          min-width: 200px;
          max-width: 230px;
          font-family: 'montserrat';
          color: #fff;
        }

        .location-item {
          width: 100%;
        }

        .action-buttons {
          display: flex;
          flex-grow: 1;
          flex-direction: row;
          justify-content: flex-end;
        }

        @media (min-width: 640px) {
          app-toolbar {
            padding: 0 36px;
            height: initial;
          }
        }
      </style>

      <app-toolbar class="header">
        <div>
          <paper-icon-button
            icon="hoverboard:menu"
            hidden$="[[viewport.isLaptopPlus]]"
            aria-label="menu"
            on-click="openDrawer"
          ></paper-icon-button>
        </div>
        <div layout horizontal>
          <a
            class="toolbar-logo"
            href="/"
            hidden$="[[!viewport.isLaptopPlus]]"
            layout
            horizontal
            title="[[logoTitle]]"
          ></a>
        </div>
        <div layout vertical center flex class="location">
          <span class="location-item">[[locationName]]</span>
          <span class="location-item">[[locationShort]]</span>
          <span class="location-item">[[dates]]</span>
        </div>

        <paper-tabs
          class="nav-items"
          selected="[[routeName]]"
          attr-for-selected="name"
          hidden$="[[!viewport.isLaptopPlus]]"
          role="navigation"
          noink
        >
          <template is="dom-repeat" items="[[navigation]]" as="nav">
            <paper-tab name="[[nav.route]]" class="nav-item" link>
              <a href="[[nav.permalink]]" layout vertical center-center>[[nav.label]]</a>
            </paper-tab>
          </template>

          <!-- <div class="nav-item nav-link-button" on-click="register">
            Get notified!
          </div> -->

          <paper-tab class="signin-tab" on-click="signIn" link hidden$="[[signedIn]]">
            [[signInText]]
          </paper-tab>

          <!-- <a on-click="signIn" rel="noopener noreferrer"
            hidden$="[[isAccountIconHidden(signedIn, viewport.isPhone)]]">
            <paper-button class="buy-button" primary>[[signInText]]</paper-button>
          </a> -->

          <a on-click="register" rel="noopener noreferrer">
            <paper-button class="buy-button" primary>[[buyTicket]]</paper-button>
          </a>
        </paper-tabs>

        <div class="action-buttons">
          <notification-toggle></notification-toggle>
          <paper-menu-button
            class="auth-menu"
            hidden$="[[!signedIn]]"
            vertical-align="top"
            horizontal-align="right"
            no-animations
            layout
            horizontal
            center-center
          >
            <div
              class="profile-image"
              slot="dropdown-trigger"
              style$="background-image: url('[[user.data.photoURL]]')"
            ></div>
            <div class="dropdown-panel profile-details" slot="dropdown-content" layout horizontal>
              <div
                class="profile-image"
                slot="dropdown-trigger"
                self-center
                style$="background-image: url('[[user.data.photoURL]]')"
              ></div>
              <div layout vertical center-justified>
                <span class="profile-name">[[user.data.displayName]]</span>
                <span class="profile-email">[[user.data.email]]</span>
                <span class="profile-action" role="button" on-click="signOut">[[signOutText]]</span>
              </div>
            </div>
          </paper-menu-button>
        </div>

        <paper-icon-button
          icon="hoverboard:account"
          on-click="signIn"
          hidden$="[[isAccountIconHidden(signedIn, viewport.isLaptopPlus)]]"
        ></paper-icon-button>
      </app-toolbar>
    `;
  }

  private logoTitle = title;
  private signInText = signIn;
  private navigation = navigation;
  private signOutText = signOutText;
  private buyTicket = buyTicket;
  private subscribeBlock = subscribeBlock;
  private locationName = location.name;
  private locationShort = location.short;
  private dates = dates;

  @property({ type: Boolean, notify: true })
  drawerOpened: boolean = false;
  @property({ type: Object })
  tickets: TicketsState = initialTicketsState;

  @property({ type: Object })
  private viewport = initialUiState.viewport;
  @property({ type: Object })
  private heroSettings = initialUiState.heroSettings;
  @property({ type: Boolean })
  private signedIn = false;
  @property({ type: Object })
  private user = initialUserState;
  @property({ type: Boolean, reflectToAttribute: true })
  private transparent = false;
  @property({ type: String })
  private routeName = '';
  @property({ type: Boolean })
  private isDialogOpen = false;

  @property({ type: Object })
  contentState = initialContentStateState;

  override stateChanged(state: RootState) {
    this.user = state.user;
    this.signedIn = state.user instanceof Success;
    this.tickets = state.tickets;
    this.heroSettings = state.ui.heroSettings;
    this.viewport = state.ui.viewport;
    this.routeName = selectRouteName(window.location.pathname);
    this.isDialogOpen = selectIsDialogOpen(state, DIALOG.SIGNIN);
    this.contentState = state.contentState;
    if (this.contentState instanceof Success) {
      const contentStateLocation = this.contentState.data['location'] ?? {};
      this.locationName = contentStateLocation.name ?? location.name;
      this.locationShort = contentStateLocation.short ?? location.short;
      this.dates = this.contentState.data['dates'] ?? dates;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll);
    this.onScroll();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.onScroll);
  }

  private openDrawer() {
    this.drawerOpened = true;
  }

  private signIn() {
    openSigninDialog();
  }

  private signOut() {
    signOutAction();
  }

  private onScroll() {
    this.transparent = document.documentElement.scrollTop === 0;
    if (document.documentElement.scrollTop === 0) {
      this.updateStyles({
        'padding-top': '40px',
      });
    } else {
      this.updateStyles({
        'padding-top': '20px',
      });
    }
  }

  @observe('signedIn')
  private onSignedIn() {
    if (this.isDialogOpen) {
      closeDialog();
    }
  }

  private navLinkButtonAction() {
    window.open('https://go.devfestyyc.com/innovationweek', '_blank');
  }

  private register() {
    // let userData = {
    //   firstFieldValue: '',
    //   secondFieldValue: '',
    // };

    // if (this.user instanceof Success) {
    //   const name = this.user.data.displayName?.split(' ') || ['', ''];
    //   userData = {
    //     firstFieldValue: name[0] || '',
    //     secondFieldValue: name[1] || '',
    //   };

    //   if (this.user.data.email) {
    //     this.subscribeAction({ ...userData, email: this.user.data.email });
    //   }
    // }

    // if (this.user instanceof Success && this.user.data.email) {
    //   this.subscribeAction({ ...userData, email: this.user.data.email });
    // } else {
    //   openSubscribeDialog({
    //     title: this.subscribeBlock.formTitle,
    //     submitLabel: this.subscribeBlock.subscribe,
    //     firstFieldLabel: this.subscribeBlock.firstName,
    //     secondFieldLabel: this.subscribeBlock.lastName,
    //     firstFieldValue: userData.firstFieldValue,
    //     secondFieldValue: userData.secondFieldValue,
    //     submit: (data) => this.subscribeAction(data),
    //   });
    // }

    // scroll to tickets section
    const hoverboardApp = document.getElementsByTagName('hoverboard-app')[0];
    if (hoverboardApp?.shadowRoot?.children[1]?.children[1]?.children[1]?.children[0]?.shadowRoot?.children[6]
      && window?.location?.pathname === '/') {
      hoverboardApp.shadowRoot.children[1].children[1].children[1].children[0].shadowRoot.children[6]
        .scrollIntoView({ block: "center", inline: "center", behavior: "smooth" })
    } else {
      window.open('https://go.devfestyyc.com/FESTIVALPASS', '_blank');
    }
  }

  private isAccountIconHidden(signedIn: boolean, isTabletPlus: boolean) {
    return signedIn || isTabletPlus;
  }

  @computed('tickets')
  private get ticketUrl() {
    if (this.tickets instanceof Success && this.tickets.data.length > 0) {
      const availableTicket = this.tickets.data.find((ticket) => ticket.available);
      return (availableTicket || this.tickets.data[0])?.url || '';
    } else {
      return '';
    }
  }

  @observe('heroSettings')
  private onHeroSettings(settings: Hero) {
    if (!settings) return;
    this.updateStyles({
      '--hero-font-color': settings.fontColor || '',
      '--hero-logo-opacity': settings.hideLogo ? '0' : '1',
      '--hero-logo-color': settings.backgroundImage ? '#fff' : 'var(--default-primary-color)',
    });
  }

  private subscribeAction(data: DialogData) {
    store.dispatch(subscribe(data));
  }
}
