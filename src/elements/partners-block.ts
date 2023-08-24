import { Failure, Initialized, Pending, Success } from '@abraham/remotedata';
import { computed, customElement, observe, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import { RootState, store } from '../store';
import { closeDialog, openSubscribeDialog } from '../store/dialogs/actions';
import { ReduxMixin } from '../store/mixin';
import { PartnerGroupsState, selectPartnerGroups } from '../store/partners';
import { addPotentialPartner } from '../store/potential-partners/actions';
import {
  initialPotentialPartnersState,
  PotentialPartnersState,
} from '../store/potential-partners/state';
import { queueSnackbar } from '../store/snackbars';
import { loading, partnersBlock } from '../utils/data';
import '../utils/icons';
import './shared-styles';

@customElement('partners-block')
export class PartnersBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
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

        .partners-wrapper {
          text-align: center;
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

        .big-heading {
          font-size: 40px;
          line-height: 50px;
        }

        .block-title {
          margin: 24px 0 8px;
        }

        .logos-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          grid-gap: 30px;
          width: 80%;
          align-self: center;
        }

        .logo-item {
          padding: 50px 30px;
          border-radius: 20px;
          background-color: #2b2c2f;
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          margin-top: 20px;
          color: var(--primary-text-color);
        }

        .logo-img {
          --lazy-image-width: 170px;
          --lazy-image-height: 84px;
          --lazy-image-fit: contain;
          width: var(--lazy-image-width);
          height: var(--lazy-image-height);
        }

        .cta-button {
          margin-top: 24px;
          color: var(--default-primary-color);
        }

        @media (min-width: 812px) {
          .logos-wrapper {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }
        }
      </style>

      <div class="container section partners-wrapper">
        <h1 class="container-title big-heading">[[partnersBlock.title]]</h1>

        <template is="dom-if" if="[[pending]]">
          <p>[[loading]]</p>
        </template>
        <template is="dom-if" if="[[failure]]">
          <p>Error loading partners.</p>
        </template>

        <template is="dom-repeat" items="[[partners.data]]" as="block">
          <h4 class="block-title">[[block.title]]</h4>
          <div class="logos-wrapper">
            <template is="dom-repeat" items="[[block.items]]" as="logo">
              <a
                class="logo-item"
                href$="[[logo.url]]"
                title$="[[logo.name]]"
                target="_blank"
                rel="noopener noreferrer"
                layout
                center-center
              >
                <lazy-image
                  class="logo-img"
                  src="[[logo.logoUrl]]"
                  alt="[[logo.name]]"
                ></lazy-image>
                <span class="logo-title">[[logo.name]]</span>
              </a>
            </template>
          </div>
        </template>

        <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
          <paper-button class="action-button" on-click="addPotentialPartner">
            <span>[[partnersBlock.button]]</span>
          </paper-button>
        </div>
      </div>
    `;
  }

  private loading = loading;
  private partnersBlock = partnersBlock;

  @property({ type: Object })
  potentialPartners = initialPotentialPartnersState;
  @property({ type: Object })
  partners: PartnerGroupsState = new Initialized();

  @computed('partners')
  get pending() {
    return this.partners instanceof Pending;
  }

  @computed('partners')
  get failure() {
    return this.partners instanceof Failure;
  }

  override stateChanged(state: RootState) {
    this.partners = selectPartnerGroups(state);
    this.potentialPartners = state.potentialPartners;
  }

  private addPotentialPartner() {
    openSubscribeDialog({
      title: this.partnersBlock.form.title,
      submitLabel: this.partnersBlock.form.submitLabel,
      firstFieldLabel: this.partnersBlock.form.fullName,
      secondFieldLabel: this.partnersBlock.form.companyName,
      submit: (data) => store.dispatch(addPotentialPartner(data)),
    });
  }

  @observe('potentialPartners')
  private onPotentialPartners(potentialPartners: PotentialPartnersState) {
    if (potentialPartners instanceof Success) {
      closeDialog();
      store.dispatch(queueSnackbar(this.partnersBlock.toast));
    }
  }
}
