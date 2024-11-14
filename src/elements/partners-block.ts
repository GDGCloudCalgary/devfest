/* eslint-disable */
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
import { heroSettings, loading, partnersBlock } from '../utils/data';
import '../utils/icons';
import './shared-styles';
import { PartnerGroup } from '../models/partner-group';

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

        .year-selection {
          width: 30%;
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
          width: 50%;
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

        @media (min-width: 812px) {
          .logos-wrapper {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }
        }
      </style>

      <!--<div class="container section partners-wrapper">
        <h1 class="container-title big-heading">Speakers</h1>
        <h1 class="container-title">[[speakersData.title]]</h1>
        <p>[[speakersData.description]]</p>

        <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
          <paper-button class="action-button" on-click="openCFP">
            <span>Submit your idea!</span>
          </paper-button>
        </div>
      </div>-->

      <div class="container section partners-wrapper">
        <h1 class="container-title big-heading">[[partnersBlock.title]]</h1>

        <div class="year-selection">
          <template is="dom-if" if="[[_isEqualTo(year, '2023')]]">
            <span year="2023" on-click="filterList" class="year-button border-right year-selected">2023</span>
          </template>
          <template is="dom-if" if="[[!_isEqualTo(year, '2023')]]">
            <span year="2023" on-click="filterList" class="year-button border-right">2023</span>
          </template>

          <template is="dom-if" if="[[_isEqualTo(year, '2024')]]">
            <span year="2024" on-click="filterList" class="year-button year-selected">2024</span>
          </template>
          <template is="dom-if" if="[[!_isEqualTo(year, '2024')]]">
            <span year="2024" on-click="filterList" class="year-button">2024</span>
          </template>
        </div>

        <template is="dom-if" if="[[pending]]">
          <p>[[loading]]</p>
        </template>
        <template is="dom-if" if="[[failure]]">
          <p>Error loading partners.</p>
        </template>

        <template is="dom-repeat" items="[[filteredPartners]]" as="block">
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
        <template is="dom-if" if="[[!filteredPartners.length]]">
          <!--<h1 style="text-align: center">Coming Soon!</h1>-->
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
            <!-- <a href="https://go.devfestyyc.com/cfp" target="blank">
              <paper-button class="action-button">
                <span>Call for Speakers</span>
              </paper-button>
            </a> -->
            <span>Announcing soon!</span>
          </div>
        </template>

        <!--<div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;">
          <paper-button class="action-button" on-click="addPotentialPartner">
            <span>[[partnersBlock.button]]</span>
          </paper-button>
        </div>-->
      </div>
    `;
  }

  private loading = loading;
  private partnersBlock = partnersBlock;
  private speakersData = heroSettings.speakers;
  private volunteersData = heroSettings.volunteers;

  @property({ type: Object })
  potentialPartners = initialPotentialPartnersState;
  @property({ type: Object })
  partners: PartnerGroupsState = new Initialized();
  @property({ type: Array })
  filteredPartners: PartnerGroup[] = [];
  @property({ type: String })
  year = '2024';

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
    this.filterPartners();
  }

  filterPartners() {
    if (this.partners instanceof Success) {
      const { data } = this.partners;
      const filteredPartners: any[] = JSON.parse(JSON.stringify(data));
      filteredPartners.map(partner => {
        partner.items = partner.items.filter((i: any) => i.year && i.year.includes(this.year));
      });
      this.filteredPartners = filteredPartners;
    } else {
      this.filteredPartners = [];
    }
  }

  filterList(event: any) {
    const year = event.target.getAttribute('year');
    this.year = year;
    this.filterPartners();
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

  private openCFP() {
    window.open('https://go.devfestyyc.com/cfp', '_blank');
  }

  _isEqualTo(year: string, selectedYear: string) {
    return year === selectedYear;
  }
}
