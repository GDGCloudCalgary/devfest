import { Pending, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import { Ticket } from '../models/ticket';
import { RootState, store } from '../store';
import { ReduxMixin } from '../store/mixin';
import { initialTicketsState } from '../store/tickets/state';
import {
  buyTicket,
  contentLoaders,
  // showpass,
  subscribeBlock,
  ticketsBlock
} from '../utils/data';
import '../utils/icons';
import './content-loader';
import './shared-styles';
import { initialUserState } from '../store/user/state';
import { DialogData } from '../models/dialog-form';
import { subscribe } from '../store/subscribe/actions';
import { openSubscribeDialog } from '../store/dialogs/actions';
import { initialContentStateState } from '../store/content-state/state';

@customElement('tickets-block')
export class TicketsBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
          font-family: montserrat;
        }

        .section {
          padding-top: 6rem;
          padding-bottom: 6rem;
          display: flex;
          flex-direction: column;
        }

        .big-heading {
          font-size: 40px;
          line-height: 50px;
        }

        .tickets-wrapper {
          text-align: center;
        }

        .tickets {
          margin: 32px 0 24px;
        }

        .laid-off {
          margin-top: 50px;
        }

        .ticket-item {
          margin: 16px 16px;
          width: 100%;
          text-align: center;
          border-radius: 20px;
          border: 1px solid var(--primary-text-color);
          color: var(--primary-text-color);
          background-color: var(--default-background-color);
          transition: box-shadow var(--animation), border var(--animation);
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

        .ticket-item:hover {
          box-shadow: var(--box-shadow-primary-color);
          border: 1px solid var(--default-primary-color);
        }

        .ticket-item[in-demand] {
          transform: scale(1.05);
          box-shadow: var(--box-shadow-primary-color);
          border-top: 2px solid var(--default-primary-color);
          z-index: 1;
        }

        .ticket-item[in-demand]:hover {
          box-shadow: var(--box-shadow-primary-color-hover);
        }

        .ticket-item[sold-out] {
          opacity: 0.5;
          filter: grayscale(1);
          cursor: not-allowed;
        }

        .ticket-item[sold-out]:hover {
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.15);
        }

        .header {
          padding: 24px 0 0;
          font-size: 30px;
        }

        .ticket-timer {
          margin-bottom: 20px;
          border: 1px solid #fff;
          border-radius: 10px;
          width: 60%;
          align-self: center;
          font-size: 16px;
        }

        .content {
          padding: 0 24px;
        }

        .type-description {
          font-size: 12px;
        }

        .ticket-price-wrapper {
          margin: 24px 0;
          white-space: nowrap;
        }

        .price {
          color: var(--default-primary-color);
          font-size: 40px;
        }

        .price-original {
          text-decoration: line-through;
          color: var(--primary-text-color);
          font-size: 24px;
        }

        .discount {
          font-size: 14px;
          color: var(--accent-color);
        }

        .sold-out {
          display: none;
          font-size: 14px;
          text-transform: uppercase;
          height: 32px;
          color: var(--secondary-text-color);
        }

        .additional-info {
          margin: 16px auto 0;
          max-width: 480px;
          font-size: 14px;
          color: var(--primary-text-color);
        }

        .actions {
          padding: 24px;
          position: relative;
          margin-top: 30px;
        }

        .tickets-placeholder {
          display: grid;
          width: 100%;
        }

        paper-button[disabled] {
          background-color: var(--primary-color-transparent);
          font-size: 12px;
        }

        @media (min-width: 640px) {
          .tickets-placeholder {
            grid-template-columns: repeat(auto-fill, 200px);
          }

          .ticket-item {
            max-width: 250px;
          }

          .ticket-item[in-demand] {
            transform: scale(1.15);
          }
        }
      </style>

      <div class="tickets-wrapper container section">
        <h1 class="container-title big-heading">[[ticketsBlock.title]]</h1>
        <h2>[[ticketsBlockDescription]]</h2>

        <content-loader
          class="tickets-placeholder"
          card-padding="24px"
          card-height="216px"
          border-radius="var(--border-radius)"
          title-top-position="32px"
          title-height="42px"
          title-width="70%"
          load-from="-70%"
          load-to="130%"
          animation-time="1s"
          items-count="[[contentLoaders.itemsCount]]"
          hidden$="[[!pending]]"
        >
        </content-loader>

        <div class="tickets" layout horizontal wrap center-justified>
          <paper-button
            class="action-button"
            on-click="onTicketTap"
          >
          [[ticketsBlockCallToAction]]
          </paper-button>
        </div>

      </div>
    `;
  }

  private ticketsBlock = ticketsBlock;
  private contentLoaders = contentLoaders.tickets;
  private subscribeBlock = subscribeBlock;
  private ticketsBlockDescription = ticketsBlock.description;
  private ticketsBlockCallToAction = ticketsBlock.callToAction;

  @property({ type: Object })
  tickets = initialTicketsState;

  @property({ type: Object })
  private user = initialUserState;

  @property({ type: Object })
  contentState = initialContentStateState;

  override stateChanged(state: RootState) {
    this.tickets = state.tickets;
    this.user = state.user;
    this.contentState = state.contentState;
    if (this.contentState instanceof Success) {
      const contentStateTicketsBlock = this.contentState.data['ticketsBlock'] ?? {};
      this.ticketsBlockDescription = contentStateTicketsBlock.description ?? ticketsBlock.description;
      this.ticketsBlockCallToAction = contentStateTicketsBlock.callToAction ?? ticketsBlock.callToAction;
    }
  }

  @computed('tickets')
  private get pending() {
    return this.tickets instanceof Pending;
  }

  private getDiscount(ticket: Ticket) {
    if (!(this.tickets instanceof Success)) {
      return '';
    }
    const primaryTicket = this.tickets.data.find((ticket) => ticket.primary);
    if (!primaryTicket) {
      return '';
    }
    const maxPrice = primaryTicket && primaryTicket.price;
    if (!ticket.regular || ticket.primary || ticket.soldOut || !maxPrice) {
      return '';
    }
    const discount = String(Math.round(100 - (ticket.price * 100) / maxPrice));
    return this.ticketsBlock.save.replace('${discount}', discount);
  }

  // private onTicketTap(e: PointerEvent & { model: { ticket: Ticket } }) {
  private onTicketTap() {
    // if (e?.model?.ticket.soldOut || !e?.model?.ticket.available) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   return;
    // }

    // logTicketsClick(e.model.ticket.name);

    // (globalThis as any)?.showpass?.tickets.eventPurchaseWidget('devfestyyc2023', {
    //   'theme-primary': showpass.theme.primary,
    //   'theme-secondary': showpass.theme.secondary,
    //   'theme-dark': showpass.theme.dark
    // });

    // window.open('https://www.showpass.com/devfestyyc2023/', '_blank');

    let userData = {
      firstFieldValue: '',
      secondFieldValue: '',
    };

    if (this.user instanceof Success) {
      const name = this.user.data.displayName?.split(' ') || ['', ''];
      userData = {
        firstFieldValue: name[0] || '',
        secondFieldValue: name[1] || '',
      };

      if (this.user.data.email) {
        this.subscribeAction({ ...userData, email: this.user.data.email });
      }
    }

    if (this.user instanceof Success && this.user.data.email) {
      this.subscribeAction({ ...userData, email: this.user.data.email });
    } else {
      openSubscribeDialog({
        title: this.subscribeBlock.formTitle,
        submitLabel: this.subscribeBlock.subscribe,
        firstFieldLabel: this.subscribeBlock.firstName,
        secondFieldLabel: this.subscribeBlock.lastName,
        firstFieldValue: userData.firstFieldValue,
        secondFieldValue: userData.secondFieldValue,
        submit: (data) => this.subscribeAction(data),
      });
    }
  }

  private getButtonText(available: boolean) {
    return available ? buyTicket : this.ticketsBlock.notAvailableYet;
  }

  private subscribeAction(data: DialogData) {
    store.dispatch(subscribe(data));
  }

  private getTimer(timer: boolean) {
    const now = new Date();
    // get number of days left between dates
    const daysLeft = Math.floor((new Date(2024, 10, 6).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return timer ? daysLeft + ' days left' : '';
  }

  openJustificationLetter() {
    window.open('https://docs.google.com/document/d/1SAO3tXOG7ZGZTWLKtxtN1yr35f5Tg4x-SM9IuRvS0VQ/edit', '_blank');
  }
}

/**
 * 
        <div class="tickets" layout horizontal wrap center-justified>
          <template is="dom-if" if="[[tickets.error]]"> Error loading tickets </template>

          <template is="dom-repeat" items="[[tickets.data]]" as="ticket">
            <a
              class="ticket-item card"
              href$="[[ticket.url]]"
              rel="noopener noreferrer"
              sold-out$="[[ticket.soldOut]]"
              in-demand$="[[ticket.inDemand]]"
              on-click="onTicketTap"
              layout
              vertical
            >
              <div class="header">
                <h4>[[ticket.name]]</h4>
              </div>
              <div class="content" layout vertical flex-auto>
                <div class="ticket-price-wrapper">
                  <div class="price">[[ticket.currency]][[ticket.price]]</div>
                  <div class="price-original" hidden$="[[!ticket.originalPrice]]">
                  [[ticket.currency]][[ticket.originalPrice]]</div>
                  <!--<div class="price">[[ticket.currency]]000</div>-->
                  <div class="discount">[[getDiscount(ticket)]]</div>
                </div>
                <!--<div class="type-description" layout vertical flex-auto center-justified>
                  <div class="ticket-timer" hidden$="[[!ticket.timer]]">[[getTimer(ticket.timer)]]</div>
                  <div class="ticket-dates" hidden$="[[!ticket.starts]]">
                    [[ticket.starts]] - [[ticket.ends]]
                  </div>
                  <div class="ticket-info">[[ticket.info]]</div>
                </div>-->
              </div>
              <!--<div class="actions">
                <div class="sold-out" block$="[[ticket.soldOut]]">[[ticketsBlock.soldOut]]</div>
                <paper-button
                  class="action-button"
                  hidden$="[[ticket.soldOut]]"
                  disabled$="[[!ticket.available]]"
                >
                  [[getButtonText(ticket.available)]]
                </paper-button>
              </div>-->
            </a>
          </template>
        </div>

        <!--<div class="additional-info">*[[ticketsBlock.ticketsDetails]]</div>-->
        <!--<h2 class="laid-off">Have you been recently laid off?</h2>-->
        <!--<p>ᐳᐅ!DEVFESTYYC is proud to offer one (1) complimentary Festival pass.</p>-->
        <!--<div class="additional-info">*This is a limited quantity, first-come first-served offer.
        Once we run out of free passes they won't be available anymore. Certain conditions apply.
        Go to 
        <a href="https://go.devfestyyc.com/LAIDOFFLIFTOFF" target="_blank">go.devfestyyc.com/LAIDOFFLIFTOFF</a>
         to get your ticket.</div>-->
        <!--<h2 class="laid-off">JUSTIFY YOUR ATTENDANCE</h2>-->
        <!--<p>
          Want to get your manager or organization to support your attendance at ᐳᐅ!DEVFESTYYC?
            <br/>Use our handy template to get you letter started and sent!
        </p>-->
        <!--<div>
          <paper-button
            class="action-button"
            on-click="openJustificationLetter"
          >
            GET THE JUSTIFICATION LETTER
          </paper-button>
        </div>-->
 */