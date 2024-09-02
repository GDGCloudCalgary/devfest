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
          display: flex;
          flex-direction: column;
          align-items: center;
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
          opacity: 0.6;
          transition: opacity 0.3s ease-in-out;
          -moz-transition: opacity 0.3s ease-in-out;
          -webkit-transition: opacity 0.3s ease-in-out;
        }

        .stat-label {
          font-weight: bold;
          font-size: 24px;
        }

        .stat-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
        }

        .stat-row-2 {
          display: flex;
          flex-direction: row;
          justify-content: center;
          width: 100%;
        }
        
        .item {
          flex-grow: 1;
          padding: 20px 30px;
          margin-bottom: 15px;
          border-radius: 20px;
          background-color: #2b2c2f;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 300px;
          position: relative;
          flex-basis: 0;
          transition: flex-grow .3s;
          overflow: hidden;

          &:hover {
            flex-grow: 4.3;
          }

          &:before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .margin-right {
          margin-right: 15px;
        }

        .margin-top {
          margin-top: 50px;
        }

        .item-2 {
          flex-grow: 1;
          padding: 20px 30px;
          border-radius: 20px;
          background-color: #2b2c2f;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 300px;
          position: relative;
          flex-basis: 0;
          transition: flex-grow .3s;
          overflow: hidden;

          &:hover {
            flex-grow: 4.3;
          }

          &:before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .stat-item {
          height: 178px;
        }

        .item:hover .label {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          -moz-transition: opacity 0.3s ease-in-out;
          -webkit-transition: opacity 0.3s ease-in-out;
        }

        .item-2:hover .label {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          -moz-transition: opacity 0.3s ease-in-out;
          -webkit-transition: opacity 0.3s ease-in-out;
        }

        .about-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 30px;
        }

        .message {
          font-size: 16px;
          margin-top: 20px;
          color: #ccc;
          text-align: center;
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
          width: 100%;
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
            flex-direction: column;
          }
        }

        @media (max-width: 814px) {
          .stat-row {
            flex-direction: column;
          }

          .stat-row-2 {
            flex-direction: column;
          }

          .item {
            flex-basis: unset;
            height: unset;
            margin-right: 0;
          }

          .item-2 {
            flex-basis: unset;
            height: unset;
            margin-right: 0;
            margin-bottom: 15px;
          }

          .label {
            opacity: 1;
          }
        }

        @media (min-width: 640px) {
          .content {
            grid-gap: 64px;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
            Here's what's waiting for you!
          </h3>
          <div class="about-info">
            <div class="statistics-block about-info-half">
              <div class="stat-row">
                <div class="item margin-right">
                  <div class="stat-label">ᐳ Code.</div>
                  <div class="label">
                    Get hands-on with Google’s cutting-edge Generative AI, Cloud, Mobile and Web platforms and technologies built for developers, including Gemini, Android, Firebase, Flutter, Tensorflow, Chrome, Kotlin, Google Cloud Platform plus over 20 more!
                  </div>
                </div>
                <div class="item margin-right">
                  <div class="stat-label">∞ Create.</div>
                  <div class="label">
                    Spark your next big idea, with the power of Gemini generative AI and Google Labs. 
                  </div>
                </div>
                <div class="item margin-right">
                  <div class="stat-label">+ Connect.</div>
                  <div class="label">
                    Meet top local and leading international tech evangelists, experts, developers, decision makers, artists, film makers, designers and builders coding and creating the future with Google technology.
                  </div>
                </div>
                <div class="item">
                  <div class="stat-label">! Ignite.</div>
                  <div class="label">
                    Immerse yourself in Google technology accelerated art, video game, film, fashion and maker projects that will unlock your ingenuity and imagination!
                  </div>
                </div>
              </div>
              <div class="stat-row-2">
                <div class="item-2 margin-right">
                  <div class="stat-label">* Grow.</div>
                  <div class="label">
                    Advance from beginner to expert and fast track your skills, career and opportunities with labs, certifications and programs by Google! Get hands-on with powerful technology to build smarter, ship faster and scale from 1 to billions of users.
                  </div>
                </div>
                <div class="item-2 margin-right">
                  <div class="stat-label">ᐅ Play.</div>
                  <div class="label">
                    Enjoy rad pop ups, activations and experiences curated by the local art and music tastemakers.
                  </div>
                </div>
                <div class="item-2">
                  <div class="stat-label">▲ Explore.</div>
                  <div class="label">
                    Discover our exploding tech scene, iconic, award-winning architecture, fantastic dining and roaring craft beer, spirits and coffee scenes and find out why <a href='https://www.lifeincalgary.ca/' target='_blank'>Calgary is the world’s 7th most livable city</a>. Extend your stay in the stunning natural beauty of the Canadian Rockies, including the world-renowned <a href='https://www.nationalgeographic.com/travel/article/banff-canada-park' target='_blank'>Banff National Park and Lake Louise</a>.
                  </div>
                </div>
              </div>
            </div>

            <div class="statistics-block about-info-half margin-top">
              <div class="stat-row">
                <div class="item margin-right stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.attendees.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.attendees.label}</div>
                </div>

                <div class="item margin-right stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.days.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.days.label}</div>
                </div>

                <div class="item margin-right stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.speakers.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.speakers.label}</div>
                </div>

                <div class="item stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.sessions.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.sessions.label}</div>
                </div>
              </div>
              <div class="stat-row-2">
                <div class="item margin-right stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.tracks.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.tracks.label}</div>
                </div>

                <div class="item margin-right stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.venues.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.venues.label}</div>
                </div>

                <div class="item stat-item">
                  <div class="numbers">${aboutBlock.statisticsBlock.prizes.number}</div>
                  <div class="label">${aboutBlock.statisticsBlock.prizes.label}</div>
                </div>
              </div>
            </div>
            
            <div class="message">
              All this plus pop-ups, karaoke, food, prizes and fun.
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
