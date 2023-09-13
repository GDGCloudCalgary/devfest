/* eslint-disable */
import { customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/markdown/short-markdown';
import { RootState } from '../store';
import { ReduxMixin } from '../store/mixin';
import { initialUiState } from '../store/ui/state';
import { aboutOrganizerBlock, heroSettings } from '../utils/data';
import '../utils/icons';
import './shared-styles';

@customElement('about-organizer-block')
export class AboutOrganizerBlock extends ReduxMixin(PolymerElement) {
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

        .team-wrapper {
          text-align: center;
        }

        .action-button {
          margin: 8px;
          margin-left: 0;
          padding-left: 2rem;
          padding-right: 2rem;
          border-radius: 9999px;
          background-color: transparent;
          border: 1px solid #fff;
          color: #fff;
        }

        .block:not(:last-of-type) {
          margin-bottom: 32px;
        }

        .team-icon {
          --iron-icon-height: 160px;
          --iron-icon-width: 160px;
          --iron-icon-fill-color: var(--default-primary-color);
          max-width: 50%;
        }

        .image-link {
          width: 80%;
          height: 80%;
        }

        .organizers-photo {
          --lazy-image-width: 100%;
          --lazy-image-height: 100%;
          --lazy-image-fit: cover;
          width: var(--lazy-image-width);
          height: var(--lazy-image-height);
        }

        .description {
          color: var(--secondary-text-color);
        }

        .big-heading {
          font-size: 40px;
          line-height: 50px;
          text-align: center;
        }

        paper-button {
          margin: 0;
        }
      </style>

      <div class="container section">
        <h1 class="container-title big-heading">Organizer</h1>
        <div layout horizontal>
          <div layout horizontal center-center flex hidden$="[[viewport.isPhone]]">
            <a href="/team" class="image-link">
              <lazy-image
                class="organizers-photo"
                src="[[aboutOrganizerBlock.image]]"
                alt="Organizer"
              ></lazy-image>
            </a>
          </div>

          <div class="description-block" flex>
            <template is="dom-repeat" items="[[aboutOrganizerBlock.blocks]]" as="block">
              <div class="block">
                <h1 class="container-title">[[block.title]]</h1>

                <short-markdown content="[[block.description]]"></short-markdown>

                <template is="dom-if" if="[[block.callToAction.newTab]]">
                  <a href="[[block.callToAction.link]]" target="_blank" rel="noopener noreferrer">
                    <paper-button class="action-button">
                      <span>[[block.callToAction.label]]</span>
                    </paper-button>
                  </a>
                </template>
                <template is="dom-if" if="[[!block.callToAction.newTab]]">
                  <a href="[[block.callToAction.link]]">
                    <paper-button class="action-button">
                      <span>[[block.callToAction.label]]</span>
                    </paper-button>
                  </a>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="container section team-wrapper">
        <h1 class="container-title big-heading">Team</h1>
        <h1 class="container-title">[[team.title]]</h1>
        <div class="description-block" flex>
          <div class="block">
            <short-markdown content="[[team.description]]"></short-markdown>

            <div
              style="display: flex; align-items: center; justify-content: center; margin-top: 32px;"
            >
              <a href="/team">
                <paper-button class="action-button">
                  <span>GET TO KNOW OUR TEAM</span>
                </paper-button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="container section team-wrapper">
        <h1 class="container-title big-heading">GDG</h1>
        <h1 class="container-title">Developers build everywhere!</h1>
        <div class="description-block" flex>
          <div class="block">
            <short-markdown
              content="Google Developer Groups (GDG) are the world’s largest network of technologists. GDG chapters can be found in over 1000 cities worldwide (with 27 chapters across Canada). GDGs are committed to advancing developer knowledge and expertise of Google technology to build for AI, Cloud, Mobile and Web."
            ></short-markdown>

            <div
              style="display: flex; align-items: center; justify-content: center; margin-top: 32px;"
            >
              <a href="https://gdg.community.dev/" target="_blank">
                <paper-button class="action-button">
                  <span>FIND A COMMUNITY</span>
                </paper-button>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private aboutOrganizerBlock = aboutOrganizerBlock;
  private team = heroSettings.team;

  @property({ type: Object })
  private viewport = initialUiState.viewport;

  override stateChanged(state: RootState) {
    this.viewport = state.ui.viewport;
  }
}
