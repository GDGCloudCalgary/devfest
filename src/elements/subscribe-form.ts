/* eslint-disable */
import { Failure, Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input';
import { PaperInputElement } from '@polymer/paper-input/paper-input';
import { html, PolymerElement } from '@polymer/polymer';
import { RootState, store } from '../store';
import { ReduxMixin } from '../store/mixin';
import { subscribe } from '../store/subscribe/actions';
import { initialSubscribeState, SubscribeState } from '../store/subscribe/state';
import { subscribeBlock } from '../utils/data';
import '../utils/icons';
import './shared-styles';

@customElement('subscribe-form')
export class SubscribeFormFooter extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          --paper-input-container-color: var(--text-primary-color);
          --paper-input-container-focus-color: var(--default-primary-color);
          --paper-input-container-input-color: var(--text-primary-color);
        }

        paper-input {
          padding-bottom: 0;
        }

        paper-input,
        .form-content {
          width: 100%;
        }

        paper-input-container input,
        paper-input-container label {
          font-size: 14px;
        }

        iron-icon {
          margin-bottom: 5px;
        }

        paper-button {
          margin: 8px;
          padding-left: 2rem;
          padding-right: 2rem;
          border-radius: 9999px;
          background-color: transparent;
          border: 1px solid #fff;
          color: #fff;
          animation: button-pop 0.25s ease-out;
        }

        .ping-span {
          animation: custom-ping 1s cubic-bezier(0, 0, 0.2, 1) 1s infinite;
          --tw-border-opacity: 1;
          border-color: rgb(255 255 255 / var(--tw-border-opacity));
          border-width: 1px;
          border-radius: 9999px;
          width: 100%;
          position: absolute;
          top: -0.25rem;
          bottom: -0.25rem;
        }

        *,
        *::before,
        *::after {
          border: 0 solid #fff;
        }

        @keyframes custom-ping {
          75%,
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        @keyframes button-pop {
          0% {
            transform: scale(var(--btn-focus-scale, 0.95));
          }
          40% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        paper-button:hover {
          cursor: pointer;
        }

        paper-button[disabled] {
          background: none;
        }

        paper-button[disabled] .ping-span {
          border: 0 solid #fff;
        }
      </style>

      <div class="form-content" layout vertical center>
        <paper-input
          id="emailInput"
          on-touchend="_focus"
          label="[[subscribeBlock.yourEmail]]"
          value="{{email}}"
          required
          auto-validate$="[[validate]]"
          error-message="[[subscribeBlock.emailRequired]]"
          autocomplete="off"
          disabled="[[subscribed.data]]"
        >
          <iron-icon
            icon="hoverboard:checked"
            slot="suffix"
            hidden$="[[!subscribed.data]]"
          ></iron-icon>
        </paper-input>
        <paper-button on-click="subscribe" disabled="[[disabled]]">
          <span class="ping-span"></span>
          [[ctaLabel]]
        </paper-button>
      </div>
    `;
  }

  private subscribeBlock = subscribeBlock;

  @property({ type: Object })
  subscribed: SubscribeState = initialSubscribeState;
  @property({ type: String })
  email = '';

  @property({ type: Boolean })
  private validate = false;

  override stateChanged(state: RootState) {
    this.subscribed = state.subscribed;
  }

  private subscribe() {
    this.validate = true;
    const emailInput = this.shadowRoot!.querySelector<PaperInputElement>('#emailInput');

    if ((this.initialized || this.failure) && emailInput?.validate()) {
      store.dispatch(subscribe({ email: this.email }));
    }
  }

  @computed('subscribed')
  private get ctaLabel() {
    return this.subscribed instanceof Success
      ? this.subscribeBlock.subscribed
      : this.subscribeBlock.subscribe;
  }

  @computed('email', 'subscribed')
  private get disabled() {
    return (
      !this.email ||
      this.subscribed instanceof Success ||
      !this.email
        ?.toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    );
  }

  @computed('subscribed')
  private get failure() {
    return this.subscribed instanceof Failure;
  }

  @computed('subscribed')
  private get initialized() {
    return this.subscribed instanceof Initialized;
  }
}
