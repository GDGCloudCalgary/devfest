import { customElement, property } from '@polymer/decorators';
import '@polymer/google-map';
import '@polymer/paper-icon-button';
import { html, PolymerElement } from '@polymer/polymer';
import { RootState } from '../store';
import { ReduxMixin } from '../store/mixin';
import { initialUiState } from '../store/ui/state';
import { CONFIG, getConfig } from '../utils/config';
import { location, mapBlock } from '../utils/data';
import '../utils/icons';
import './shared-styles';

@customElement('map-block')
export class MapBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          margin: 32px auto;
          display: block;
          position: relative;
          font-family: montserrat;
        }

        .description-card {
          margin: 0 -16px;
          padding: 16px;
          background-color: #2b2c2f;
          color: var(--text-primary-color);
          border-radius: 20px;
        }

        .bottom-info {
          margin-top: 24px;
        }

        .directions {
          --paper-icon-button: {
            width: 48px;
            height: 48px;
            color: var(--text-primary-color);
          }
        }

        @media (min-width: 640px) {
          :host {
            margin: 64px auto 72px;
          }

          google-map {
            display: block;
            height: 640px;
          }

          .description-card {
            margin: 0;
            padding: 24px;
            max-width: 320px;
            transform: translateY(80px);
          }

          .address {
            font-size: 12px;
          }
        }
      </style>

      <template is="dom-if" if="[[viewport.isTabletPlus]]">
        <google-map
          id="map"
          latitude="[[location.mapCenter.latitude]]"
          longitude="[[location.mapCenter.longitude]]"
          api-key="[[googleMapApiKey]]"
          zoom="[[location.pointer.zoom]]"
          disable-default-ui="[[option.disableDefaultUI]]"
          draggable="[[option.draggable]]"
          additional-map-options="[[options]]"
          styles="[[option.darkStyles]]"
        >
          <google-map-marker
            latitude="[[location.pointer.latitude]]"
            longitude="[[location.pointer.longitude]]"
            title="[[location.pointer.name]]"
            icon="images/map-marker.svg"
          ></google-map-marker>
          <google-map-marker
            latitude="[[location.secondPointer.latitude]]"
            longitude="[[location.secondPointer.longitude]]"
            title="[[location.secondPointer.name]]"
            icon="images/map-marker.svg"
          ></google-map-marker>
        </google-map>
      </template>

      <div class="container" layout vertical end-justified fit$="[[viewport.isTabletPlus]]">
        <div class="description-card" layout vertical justified>
          <div>
            <h1 class="container-title">[[mapBlock.title]]</h1>
            <p>[[location.description]]</p>
          </div>
          <div class="bottom-info" layout horizontal justified center>
            <span class="address">[[location.address]]</span>
            <a
              href="https://www.google.com/maps/dir/?api=1&amp;destination=[[location.address]]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <paper-icon-button
                class="directions"
                icon="hoverboard:directions"
              ></paper-icon-button>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  private location = location;
  private mapBlock = mapBlock;
  private googleMapApiKey = getConfig(CONFIG.GOOGLE_MAPS_API_KEY);

  @property({ type: Object })
  private viewport = initialUiState.viewport;
  @property({ type: Object })
  private option = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    draggable: false,
    darkStyles: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ffffff',
          },
        ],
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#000000',
          },
          {
            lightness: 13,
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#144b53',
          },
          {
            lightness: 14,
          },
          {
            weight: 1.4,
          },
        ],
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            color: '#08304b',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0c4152',
          },
          {
            lightness: 5,
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#0b434f',
          },
          {
            lightness: 25,
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#0b3d51',
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            color: '#146474',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: [
          {
            color: '#021019',
          },
        ],
      },
    ],
    purpleStyles: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [
          {
            saturation: 36,
          },
          {
            color: '#000000',
          },
          {
            lightness: 40,
          },
        ],
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'on',
          },
          {
            color: '#000000',
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#000000',
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#000000',
          },
          {
            lightness: 17,
          },
          {
            weight: 1.2,
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified',
          },
          {
            saturation: '-100',
          },
          {
            lightness: '30',
          },
        ],
      },
      {
        featureType: 'administrative.neighborhood',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified',
          },
          {
            gamma: '0.00',
          },
          {
            lightness: '74',
          },
        ],
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
          {
            color: '#34334f',
          },
          {
            lightness: '-37',
          },
        ],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'all',
        stylers: [
          {
            lightness: '3',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000',
          },
          {
            lightness: 21,
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2d2c45',
          },
          {
            lightness: '0',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#000000',
          },
          {
            lightness: 29,
          },
          {
            weight: 0.2,
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#7d7c9b',
          },
          {
            lightness: '43',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2d2c45',
          },
          {
            lightness: '1',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#7d7c9b',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2d2c45',
          },
          {
            lightness: '-1',
          },
          {
            gamma: '1',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text',
        stylers: [
          {
            visibility: 'on',
          },
          {
            hue: '#ff0000',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#7d7c9b',
          },
          {
            lightness: '-31',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2d2c45',
          },
          {
            lightness: '-36',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2d2c45',
          },
          {
            lightness: '0',
          },
          {
            gamma: '1',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ],
  };

  override stateChanged(state: RootState) {
    this.viewport = state.ui.viewport;
  }
}
