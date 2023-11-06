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

@customElement('statistics-block')
export class StatisticsBlock extends ThemedElement {
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
          <h1 class="container-title big-heading">Build smarter. Ship faster.</h1>
          <h3>
            Unlock creativity and simplify your workflow with open, integrated solutions,
            frameworks, programs and diversity. Get to know the 2023 ᐳᐅ!DEVFESTYYC programming!
          </h3>
          <div class="about-info">
            <div class="statistics-block about-info-half">
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Leverage AI + Deep Learning</div>
                <div class="label">
                  Bring the power of responsible generative AI, ML and LLMs to apps and workflows.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Scale with Cloud</div>
                <div class="label">
                  Simplify and scale development and accelerate digital transformation without
                  managing infrastructure.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Build for Mobile</div>
                <div class="label">
                  Develop high quality mobile apps for all audiences and form factors.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Build for Web</div>
                <div class="label">Create fast and secure sites for the open web.</div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Advance with Frameworks</div>
                <div class="label">
                  Accelerate value creation using Open Source modern development frameworks.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Launch with Google</div>
                <div class="label">
                  Launch your developer career with Google-made programs and support.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/new/devfest_logo.png"
                    alt="Devfest Logo"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Everyone is Welcome</div>
                <div class="label">
                  Co-create the future of tech by welcoming everyone to join us in building the
                  future of technology
                </div>
              </div>
            </div>

            <div class="statistics-block about-info-half">
              <div class="item">
                <div class="numbers">${aboutBlock.statisticsBlock.attendees.number}</div>
                <div class="label">${aboutBlock.statisticsBlock.attendees.label}</div>
              </div>

              <div class="item">
                <div class="numbers">${aboutBlock.statisticsBlock.days.number}</div>
                <div class="label">${aboutBlock.statisticsBlock.days.label}</div>
              </div>

              <div class="item">
                <div class="numbers">${aboutBlock.statisticsBlock.sessions.number}</div>
                <div class="label">${aboutBlock.statisticsBlock.sessions.label}</div>
              </div>

              <div class="item">
                <div class="numbers">${aboutBlock.statisticsBlock.tracks.number}</div>
                <div class="label">${aboutBlock.statisticsBlock.tracks.label}</div>
              </div>

              <div class="item">
                <div class="numbers">${aboutBlock.statisticsBlock.venues.number}</div>
                <div class="label">${aboutBlock.statisticsBlock.venues.label}</div>
              </div>

              <div class="item">
                <div class="numbers">${aboutBlock.statisticsBlock.prizes.number}</div>
                <div class="label">${aboutBlock.statisticsBlock.prizes.label}</div>
              </div>
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
    'statistics-block': StatisticsBlock;
  }
}
