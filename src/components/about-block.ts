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

          .about-info {
            flex-direction: row;
          }
        }

        @media (max-width: 500px) {
          .about-info {
            flex-direction: column;
          }

          .about-info-left {
            width: 100%;
          }

          .about-info-right {
            width: 100%;
          }

          .about-info-half {
            width: 100%;
          }
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="container">
        <div class="about-info section">
          <div class="about-info-left"></div>
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
          </div>
        </div>

        <div class="section">
          <h1 class="container-title big-heading">
            Building What's Next: It's Clear. The Pipelines of the Future are Digital.
          </h1>
          <div class="about-info">
            <div class="statistics-block about-info-half">
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/icons/Data_AI.png"
                    alt="Data AI"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Data & AI Pipelines</div>
                <div class="label">
                  Process and utilize data from ingestion to training ML models.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/icons/CICD.png"
                    alt="CI/CD"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">CI/CD Pipelines</div>
                <div class="label">
                  Deliver code and infrastructure changes more frequently and reliably.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/icons/Security.png"
                    alt="Security"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Security Pipelines</div>
                <div class="label">Secure your assets and reduce cost and complexity.</div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/icons/Migration.png"
                    alt="Migration"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Migration Pipelines</div>
                <div class="label">
                  Migrate data and workloads to cloud efficiently, at massive scale.
                </div>
              </div>
              <div class="item">
                <div>
                  <lazy-image
                    class="statistics-image"
                    src="/images/icons/Talent.png"
                    alt="Talent"
                  ></lazy-image>
                </div>
                <div style="font-weight: bold;">Talent Pipelines</div>
                <div class="label">Advance your cloud career with programs from Google.</div>
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
    'about-block': AboutBlock;
  }
}
