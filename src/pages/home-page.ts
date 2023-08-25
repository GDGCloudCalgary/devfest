import { customElement, property, query } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import '@power-elements/lazy-image';
import '../components/about-block';
import '../components/hero/hero-block';
import { HeroBlock } from '../components/hero/hero-block';
import '../elements/about-organizer-block';
import '../elements/featured-videos';
import '../elements/fork-me-block';
import '../elements/gallery-block';
import '../elements/latest-posts-block';
import '../elements/map-block';
import '../elements/partners-block';
import '../elements/speakers-block';
import '../elements/subscribe-block';
import '../elements/tickets-block';
import { firebaseApp } from '../firebase';
import { store } from '../store';
import { ReduxMixin } from '../store/mixin';
import { queueSnackbar } from '../store/snackbars';
import { openVideoDialog } from '../store/ui/actions';
import {
  aboutBlock,
  buyTicket,
  dates,
  description,
  heroSettings,
  location,
  showForkMeBlockForProjectIds,
  title,
  viewHighlights,
} from '../utils/data';
import '../utils/icons';
import { INCLUDE_SITE_TITLE, updateMetadata } from '../utils/metadata';
import { POSITION, scrollToElement } from '../utils/scrolling';

@customElement('home-page')
export class HomePage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
          height: 100%;
        }

        hero-block {
          font-size: 24px;
          text-align: center;
        }

        .hero-logo {
          --lazy-image-width: 100%;
          --lazy-image-height: 76px;
          width: var(--lazy-image-width);
          height: var(--lazy-image-height);
          max-height: 76px;
        }

        .hero-logo-text {
          font-size: 50px;
          font-family: rocket-rinder;
          color: #131954;
          text-shadow: magenta -2px -2px 0px, magenta 2px -2px 0px, magenta -2px 2px 0px,
            magenta 2px 2px 0px;
          animation: blink 12s infinite;
          -webkit-animation: blink 12s infinite;
        }

        .hero-logo-subtext {
          color: magenta;
          text-shadow: #ccc -2px -2px 0px, #ccc 2px -2px 0px, #ccc -2px 2px 0px, #ccc 2px 2px 0px;
        }

        .description {
          font-family: streamster;
          font-size: 30px;
          margin-top: -30px;
        }

        .info-items {
          margin: 24px auto;
          font-size: 20px;
          font-family: montserrat;
        }

        .info-items > *:not(:first-of-type) {
          margin-top: 4px;
        }

        .action-buttons {
          margin: 0 -8px;
          font-size: 14px;
        }

        .action-buttons paper-button {
          margin: 8px;
          padding-left: 2rem;
          padding-right: 2rem;
          border-radius: 9999px;
          background-color: transparent;
          border: 1px solid #fff;
          animation: button-pop 0.25s ease-out;
          color: #fff;
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

        .action-buttons .watch-video {
          color: #fff;
        }

        .action-buttons iron-icon {
          --iron-icon-fill-color: currentColor;
          margin-right: 8px;
        }

        .scroll-down {
          margin-top: 24px;
          color: currentColor;
          user-select: none;
          cursor: pointer;
        }

        .scroll-down svg {
          width: 24px;
          opacity: 0.6;
        }

        .scroll-down .stroke {
          stroke: currentColor;
        }

        .scroll-down .scroller {
          fill: currentColor;
          animation: updown 2s infinite;
        }

        .neonText {
          color: #fff;
          text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa,
            0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa;
        }

        .pulsate {
          animation: pulsate 1.5s infinite alternate;
        }

        @keyframes updown {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(0, 5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes pulsate {
          100% {
            text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #0fa, 0 0 80px #0fa,
              0 0 90px #0fa, 0 0 100px #0fa, 0 0 150px #0fa;
          }
          0% {
            text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px #0fa, 0 0 45px #0fa,
              0 0 55px #0fa, 0 0 70px #0fa, 0 0 80px #0fa;
          }
        }

        @-webkit-keyframes blink {
          20%,
          24%,
          55% {
            color: #111;
            text-shadow: none;
          }
          0%,
          19%,
          21%,
          23%,
          25%,
          54%,
          56%,
          100% {
            color: #131954;
            text-shadow: magenta -2px -2px 0px, magenta 2px -2px 0px, magenta -2px 2px 0px,
              magenta 2px 2px 0px, 0 0 5px magenta, 0 0 15px magenta, 0 0 20px magenta,
              0 0 40px magenta, 0 0 60px magenta, 0 0 10px magenta, 0 0 98px magenta;
          }
        }

        @keyframes blink {
          20%,
          24%,
          55% {
            color: #111;
            text-shadow: none;
          }
          0%,
          19%,
          21%,
          23%,
          25%,
          54%,
          56%,
          100% {
            color: #131954;
            text-shadow: magenta -2px -2px 0px, magenta 2px -2px 0px, magenta -2px 2px 0px,
              magenta 2px 2px 0px, 0 0 5px magenta, 0 0 15px magenta, 0 0 20px magenta,
              0 0 40px magenta, 0 0 60px magenta, 0 0 10px magenta, 0 0 98px magenta;
          }
        }

        .ocean {
          height: 5%;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: #015871;
        }

        .wave {
          background-image: url('/images/new/wave.svg');
          background-repeat: repeat-x;
          background-size: 500px auto;
          background-position: bottom;
          position: absolute;
          bottom: 0%;
          width: 100%;
          height: 200px;
          animation: wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          z-index: 1;
        }

        .wave:nth-of-type(2) {
          opacity: 0.7;
          animation: swell 5s ease -1.25s infinite,
            wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite;
          z-index: 0;
        }

        @keyframes wave {
          0% {
            background-position-x: 0%;
          }
          100% {
            background-position-x: -500px;
          }
        }

        @keyframes swell {
          0%,
          100% {
            background-position: right bottom 10px;
          }
          50% {
            background-position: right bottom 0;
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

        @keyframes custom-ping {
          75%,
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        @media (min-height: 500px) {
          hero-block {
            height: calc(100vh + 57px);
            max-height: calc(100vh + 1px);
          }

          .home-content {
            margin-top: -48px;
          }

          .scroll-down {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
          }

          .hero-logo-text {
            font-size: 30px;
          }

          .description {
            font-size: 21px;
            margin-top: -20px;
          }

          .info-items {
            margin: 30px auto;
            font-size: 16px;
            margin-top: 40px;
          }
        }

        @media (min-width: 812px) {
          hero-block {
            height: calc(100vh + 65px);
          }

          .hero-logo-text {
            font-size: 50px;
          }

          .description {
            font-size: 30px;
            margin-top: -30px;
          }

          .info-items {
            margin: 48px auto;
            font-size: 20px;
            line-height: 1.1;
          }
        }
      </style>

      <hero-block
        id="hero"
        background-image="[[heroSettings.background.image]]"
        background-color="[[heroSettings.background.color]]"
        font-color="[[heroSettings.fontColor]]"
        hide-logo
      >
        <div class="home-content" layout vertical center>
          <!--<lazy-image class="hero-logo" src="/images/logo.png" alt="[[siteTitle]]"></lazy-image>-->
          <div class="hero-logo">
            <span class="hero-logo-text"
              >ᐳᐅ! DEVFEST<span class="hero-logo-subtext">YYC</span></span
            >
            <div class="description">[[heroSettings.description]]</div>
          </div>

          <div class="info-items">
            <div class="info-item">[[city]]. [[dates]]</div>
          </div>

          <div class="action-buttons" layout horizontal center-justified wrap>
            <paper-button on-click="scrollToTickets" invert>
              <span class="ping-span"></span>
              <iron-icon icon="hoverboard:ticket"></iron-icon>
              [[buyTicket]]
            </paper-button>
          </div>

          <div class="scroll-down" on-click="scrollNextBlock">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Layer_2"
              x="0px"
              y="0px"
              viewBox="0 0 25.166666 37.8704414"
              enable-background="new 0 0 25.166666 37.8704414"
              xml:space="preserve"
            >
              <path
                class="stroke"
                fill="none"
                stroke="#c7c4b8"
                stroke-width="2.5"
                stroke-miterlimit="10"
                d="M12.5833445
                36.6204414h-0.0000229C6.3499947
                36.6204414
                1.25
                31.5204487
                1.25
                25.2871208V12.5833216C1.25
                6.3499947
                6.3499951
                1.25
                12.5833216
                1.25h0.0000229c6.2333269
                0
                11.3333216
                5.0999947
                11.3333216
                11.3333216v12.7037992C23.916666
                31.5204487
                18.8166714
                36.6204414
                12.5833445
                36.6204414z"
              ></path>
              <path
                class="scroller"
                fill="#c7c4b8"
                d="M13.0833359
                19.2157116h-0.9192753c-1.0999985
                0-1.9999971-0.8999996-1.9999971-1.9999981v-5.428606c0-1.0999994
                0.8999987-1.9999981
                1.9999971-1.9999981h0.9192753c1.0999985
                0
                1.9999981
                0.8999987
                1.9999981
                1.9999981v5.428606C15.083334
                18.315712
                14.1833344
                19.2157116
                13.0833359
                19.2157116z"
              ></path>
            </svg>
            <i class="icon icon-arrow-down"></i>
          </div>
        </div>
      </hero-block>
      <template is="dom-if" if="{{showForkMeBlock}}">
        <fork-me-block></fork-me-block>
      </template>
      <about-block></about-block>
      <speakers-block></speakers-block>
      <subscribe-block></subscribe-block>
      <tickets-block id="tickets-block"></tickets-block>
      <about-organizer-block></about-organizer-block>
      <map-block></map-block>
      <partners-block></partners-block>
      <footer-block></footer-block>
    `;
  }
  // <gallery-block></gallery-block>
  // <featured-videos></featured-videos>
  // <latest-posts-block></latest-posts-block>

  private city = location.city;
  private siteTitle = title;
  private dates = dates;
  private viewHighlights = viewHighlights;
  private buyTicket = buyTicket;
  private heroSettings = heroSettings.home;
  private aboutBlock = aboutBlock;

  @query('#hero')
  hero!: HeroBlock;

  @property({ type: Boolean })
  private showForkMeBlock: boolean = false;

  private playVideo() {
    openVideoDialog({
      title: this.aboutBlock.callToAction.howItWas.label,
      youtubeId: this.aboutBlock.callToAction.howItWas.youtubeId,
    });
  }

  private scrollToTickets() {
    const element = this.$['tickets-block'];
    if (element) {
      scrollToElement(element);
    } else {
      store.dispatch(queueSnackbar('Error scrolling to section.'));
    }
  }

  private scrollNextBlock() {
    scrollToElement(this.hero, POSITION.BOTTOM);
  }

  private shouldShowForkMeBlock(): boolean {
    const showForkMeBlock = firebaseApp.options.appId
      ? (showForkMeBlockForProjectIds as string[]).includes(firebaseApp.options.appId)
      : false;
    if (showForkMeBlock) {
      import('../elements/fork-me-block');
    }
    return showForkMeBlock;
  }

  override connectedCallback() {
    super.connectedCallback();
    updateMetadata(title, description, INCLUDE_SITE_TITLE.NO);
    this.showForkMeBlock = this.shouldShowForkMeBlock();
  }
}
