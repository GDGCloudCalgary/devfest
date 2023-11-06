/* eslint-disable */
// TODO: enable imports
// import '@polymer/iron-icon';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { openVideoDialog } from '../store/ui/actions';
import { aboutBlock } from '../utils/data';
// TODO: enable imports
// import '../utils/icons';
import { ThemedElement } from './themed-element';

@customElement('about-block')
export class AboutBlock extends ThemedElement {
  static override get styles() {
    return [
      ...super.styles,
      css`
        .container {
          padding-top: 64px;
          display: grid;
          grid-gap: 32px;
          grid-template-columns: 1fr;
          font-family: montserrat;
        }

        .container-sub-text {
          margin-bottom: 20px;
        }

        .big-heading {
          font-size: 40px;
          line-height: 50px;
        }

        .statistics-block {
          display: grid;
          grid-gap: 32px 16px;
          grid-template-columns: repeat(2, 1fr);
          margin-top: 50px;
        }

        .statistics-image {
          --lazy-image-width: none;
          --lazy-image-height: 76px;
          height: var(--lazy-image-height);
          max-width: 240px;
          max-height: 76px;
        }

        .about-image {
          --lazy-image-width: none;
          --lazy-image-height: 100px;
          height: var(--lazy-image-height);
          max-width: 240px;
          max-height: 100px;
        }

        .numbers {
          font-size: 40px;
        }

        .numbers::after {
          content: '';
          display: block;
          height: 2px;
          width: 64px;
          background-color: var(--default-primary-color);
        }

        .label {
          margin-top: 4px;
        }

        .about-info {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .section {
          padding-top: 6rem;
          padding-bottom: 6rem;
        }

        .about-info-left {
          width: 40%;
        }

        .about-info-right {
          width: 60%;
        }

        .about-info-half {
          width: 48%;
        }

        .center-heading {
          text-align: center;
          padding: 0 20%;
        }

        .bottom-margin {
          margin-bottom: 60px;
        }

        .blob-image {
          position: absolute;
          --lazy-image-width: none;
          --lazy-image-height: 100px;
          height: var(--lazy-image-height);
          max-width: 240px;
          max-height: 100px;
        }

        .image-text {
          width: 80%;
        }

        @media (min-width: 814px) {
          .about-info {
            flex-direction: row;
          }
        }

        @media (min-width: 640px) {
          .content {
            grid-gap: 64px;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          }

          .statistics-block {
            grid-gap: 32px;
          }

          .numbers {
            font-size: 56px;
          }
        }

        @media (max-width: 814px) {
          .about-info {
            flex-direction: column;
          }

          .about-info-left {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .about-info-right {
            width: 100%;
          }

          .about-info-half {
            width: 100%;
          }

          .image-link {
            display: flex;
            justify-content: center;
            width: inherit;
          }

          .about-image {
            width: 138px;
          }

          .image-text {
            width: 100%;
          }
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="container">
        <div class="section">
          <h1 class="container-title big-heading center-heading">Build for AI, Cloud, Mobile and Web with Google.</h1>
          <p class="center-heading bottom-margin">North America’s premiere Google technology developer festival is back!</p>
          <div class="about-info">  
            <div class="about-info-left">
              <a target="_blank" href="https://go.devfestyyc.com/innovationweek" class="image-link">
                <lazy-image
                  class="about-image"
                  src="/images/new/innovation_week_logo.png"
                  alt="Innovation Week Logo"
                ></lazy-image>
              </a>
              <p class="image-text">
                ᐳᐅ!DEVFESTYYC is the kick off to Calgary Innovation Week. Check out over 100 other
                Innovation Week events!
              </p>
            </div>
            <div class="about-info-right">
              <h1 class="container-title">${aboutBlock.callToAction.featuredSessions.title}</h1>
              <p>${aboutBlock.callToAction.featuredSessions.description}</p>
              <!--<a
                href="${aboutBlock.callToAction.featuredSessions.link}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <paper-button class="animated icon-right">
                  <span class="cta-label">${aboutBlock.callToAction.featuredSessions.label}</span>
                  <iron-icon icon="hoverboard:arrow-right-circle"></iron-icon>
                </paper-button>
              </a>-->

              <h1 class="container-title">${aboutBlock.callToAction.howItWas.title}</h1>
              <p>${aboutBlock.callToAction.howItWas.description}</p>
              <!--<paper-button class="animated icon-right" @click="${this.playVideo}">
                <span>${aboutBlock.callToAction.howItWas.label}</span>
                <iron-icon icon="hoverboard:arrow-right-circle"></iron-icon>
              </paper-button>-->

              <h1 class="container-title">${aboutBlock.callToAction.info.title}</h1>
              <p>${aboutBlock.callToAction.info.description}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private playVideo() {
    openVideoDialog({
      title: aboutBlock.callToAction.howItWas.label,
      youtubeId: aboutBlock.callToAction.howItWas.youtubeId,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'about-block': AboutBlock;
  }
}
