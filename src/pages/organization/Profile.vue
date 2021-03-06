<template>
  <div class="flex flex-col w-3/4 m-auto">
    <div class="w-full bg-white shadow mt-6">
      <div
        class="border-b px-4 py-2 font-semibold flex justify-between items-center"
      >
        {{ $t('profileVue.general_information') }}
        <base-button
          type="primary"
          class="px-4 py-2"
          :text="$t('actions.save')"
          :action="saveOrganization"
        />
      </div>
      <div class="px-8 pb-6 mt-2">
        <div class="flex">
          <div v-if="!logoUrl" class="flex">
            <DragDrop
              class="w-48 h-32 text-center mr-6 border border-dashed"
              :choose-title="$t('profileVue.upload_org_logo')"
              :drag-title="$t('profileVue.logo_specs')"
              @files="handleLogoUpload"
            ></DragDrop>

            <div class="mt-4">
              <div class="py-1">{{ $t('~~Provide Logo') }}</div>
              <div class="text-xs py-1 text-crisiscleanup-grey-700">
                {{ $t('profileVue.logo_customizes_website') }}
              </div>
            </div>
          </div>
          <div v-else>
            <img
              class="w-48 h-32"
              :src="logoUrl"
              :alt="$t('Organization Logo')"
            />
            <DragDrop
              class="text-primary-dark cursor-pointer"
              :disabled="uploading"
              @files="handleLogoUpload"
            >
              <base-button
                class="text-center pb-4 cursor-pointer"
                :show-spinner="uploading"
                :disabled="uploading"
                >{{ $t('actions.change_logo') }}
              </base-button>
            </DragDrop>
          </div>
        </div>
        <div class="divider" />
        <form ref="form" class="org-form">
          <div class="form-row">
            <base-input
              class="mr-2 w-1/2"
              :placeholder="$t('profileVue.organization_name')"
              :value="currentOrganization.name"
              required
              @input="
                value => {
                  updateOrganization(value, 'name');
                }
              "
            ></base-input>
            <form-select
              :placeholder="$t('profileVue.organization_type')"
              class="w-1/2 flex-grow border border-crisiscleanup-dark-100"
              :options="organizationTypes"
              :value="currentOrganization.type_t"
              item-key="key"
              label="label"
              @input="
                value => {
                  updateOrganization(value, 'type_t');
                }
              "
            ></form-select>
          </div>
          <div class="form-row">
            <base-input
              class="mr-2 w-1/2"
              :placeholder="$t('profileVue.address')"
              :value="currentOrganization.address"
              @input="
                value => {
                  updateOrganization(value, 'address');
                }
              "
            ></base-input>
            <base-input
              class="mr-2 w-1/2"
              :placeholder="$t('profileVue.url')"
              :value="currentOrganization.url"
              @input="
                value => {
                  updateOrganization(value, 'url');
                }
              "
            ></base-input>
          </div>
          <div class="form-row">
            <base-input
              class="mr-2 w-1/2"
              :placeholder="$t('profileVue.email')"
              :value="currentOrganization.email"
              @input="
                value => {
                  updateOrganization(value, 'email');
                }
              "
            ></base-input>
          </div>
          <div class="divider" />
          <div class="form-row">
            <base-input
              class="mr-2 w-1/2"
              :placeholder="$t('profileVue.phone')"
              :value="currentOrganization.phone"
              @input="
                value => {
                  updateOrganization(value, 'phone');
                }
              "
            ></base-input>
          </div>
          <div class="divider" />
          <div class="pb-2">{{ $t('profileVue.linkedin') }}</div>
          <div class="form-row">
            <div class="w-32 flex items-center">
              <img
                src="https://simpleicons.org/icons/facebook.svg"
                class="w-8 mr-2"
              />
              <label class="pr-3">{{ $t('profileVue.facebook') }}</label>
            </div>
            <base-input
              size="small"
              :value="currentOrganization.facebook"
              :placeholder="$t('profileVue.facebook')"
              @input="
                value => {
                  updateOrganization(value, 'facebook');
                }
              "
            />
          </div>
          <div class="form-row">
            <div class="w-32 flex items-center">
              <img
                src="https://simpleicons.org/icons/twitter.svg"
                class="w-8 mr-2"
              />
              <label class="pr-3">{{ $t('profileVue.twitter') }}</label>
            </div>
            <base-input
              size="small"
              :value="currentOrganization.twitter"
              :placeholder="$t('profileVue.twitter')"
              @input="
                value => {
                  updateOrganization(value, 'twitter');
                }
              "
            />
          </div>
          <div class="divider" />
          <div class="form-row">
            <autocomplete
              class="form-field"
              icon="search"
              :suggestions="userResults"
              display-property="full_name"
              size="large"
              :placeholder="$t('profileVue.primary_contact')"
              clear-on-selected
              @search="onUserSearch"
            />
          </div>
        </form>
      </div>
    </div>
    <div class="flex mb-32">
      <div class="w-1/2 bg-white shadow mt-6 mr-3">
        <div class="border-b px-8 py-4 font-semibold">
          {{ $t('profileVue.primary_response_area') }}
        </div>
        <div class="py-2 flex items-center justify-center">
          <base-button
            v-if="currentOrganization.primary_location"
            text="$t('profileVue.edit_response_area')"
            type="primary"
            class="px-2 py-1"
            :action="
              () => {
                showingLocationModal = true;
                settingLocation = 'primary_location';
              }
            "
          ></base-button>
          <base-button
            v-else
            class="px-2 py-1"
            type="primary"
            text="$t('profileVue.add_response_area')"
            :action="
              () => {
                showingLocationModal = true;
                settingLocation = 'primary_location';
              }
            "
          ></base-button>
        </div>
        <div id="primary-location" class="w-full h-64"></div>
      </div>
      <div class="w-1/2 bg-white shadow mt-6 mr-3">
        <div class="border-b px-8 py-4 font-semibold">
          {{ $t('profileVue.secondary_response_area') }}
        </div>
        <div class="py-2 flex items-center justify-center">
          <base-button
            v-if="currentOrganization.secondary_location"
            text="$t('profileVue.edit_response_area')"
            type="primary"
            class="px-2 py-1"
            :action="
              () => {
                showingLocationModal = true;
                settingLocation = 'secondary_location';
              }
            "
          ></base-button>
          <base-button
            v-else
            class="px-2 py-1"
            type="primary"
            text="$t('profileVue.add_response_area')"
            :action="
              () => {
                showingLocationModal = true;
                settingLocation = 'secondary_location';
              }
            "
          ></base-button>
        </div>
        <div id="secondary-location" class="w-full h-64"></div>
      </div>
      <modal
        v-if="showingLocationModal"
        :title="$t('profileVue.select_location')"
        modal-style="height: 70%"
        modal-classes="w-3/5"
        @close="showingLocationModal = false"
        @ok="saveCurrentLocation"
      >
        <LocationTool
          :organization="currentOrganization.id"
          class="h-full p-3"
          :locations="existingLocation"
          @changed="setCurrentLocation"
        />
      </modal>
    </div>
  </div>
</template>

<script>
import * as L from 'leaflet';
import Organization from '@/models/Organization';
import Location from '@/models/Location';
import User from '@/models/User';
import DragDrop from '../../components/DragDrop';
import LocationTool from '../../components/LocationTool';
import { getErrorMessage } from '@/utils/errors';

export default {
  name: 'Profile',
  components: { DragDrop, LocationTool },
  data() {
    return {
      showingLocationModal: false,
      currentPolygon: null,
      primaryLocationMap: null,
      secondaryLocationMap: null,
      settingLocation: '',
      userResults: [],
      organizationTypes: [
        'orgType.voad',
        'orgType.coad',
        'orgType.government',
        'orgType.ltr',
      ].map(key => {
        return { key, label: this.$t(key) };
      }),
      uploading: false,
    };
  },
  computed: {
    currentUser() {
      return User.find(this.$store.getters['auth/userId']);
    },
    currentOrganization() {
      return Organization.find(this.currentUser.organization.id);
    },
    existingLocation() {
      if (this.settingLocation === 'primary_location') {
        return this.currentOrganization.primary_location
          ? [this.currentOrganization.primary_location]
          : [];
      }

      if (this.settingLocation === 'secondary_location') {
        return this.currentOrganization.secondary_location
          ? [this.currentOrganization.secondary_location]
          : [];
      }
      return [];
    },
    logoUrl() {
      if (this.currentOrganization.files.length) {
        const logos = this.currentOrganization.files.filter(
          file => file.file_type_t === 'fileTypes.logo',
        );
        if (logos.length) {
          return logos[0].url;
        }
      }
      return '';
    },
  },
  async mounted() {
    this.primaryLocationMap = L.map('primary-location', {
      zoomControl: false,
    }).setView([35.7465122599185, -96.41150963125656], 3);
    this.secondaryLocationMap = L.map('secondary-location', {
      zoomControl: false,
    }).setView([35.7465122599185, -96.41150963125656], 3);
    this.createTileLayer().addTo(this.primaryLocationMap);
    this.createTileLayer().addTo(this.secondaryLocationMap);
    await this.reloadMaps();
  },
  methods: {
    setCurrentLocation(location) {
      this.currentPolygon = location;
    },
    async reloadMaps() {
      const { primary_location, secondary_location } = this.currentOrganization;

      if (primary_location) {
        this.primaryLocationMap.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            return;
          }
          this.primaryLocationMap.removeLayer(layer);
        });
        await Location.api().fetchById(primary_location);
        const location = Location.find(primary_location);
        const geojsonFeature = {
          type: 'Feature',
          properties: location.attr,
          geometry: location.poly || location.geom || location.point,
        };
        L.geoJSON(geojsonFeature, {
          weight: '1',
        }).addTo(this.primaryLocationMap);
      }
      if (secondary_location) {
        this.secondaryLocationMap.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            return;
          }
          this.secondaryLocationMap.removeLayer(layer);
        });
        await Location.api().fetchById(secondary_location);
        const location = Location.find(secondary_location);
        const geojsonFeature = {
          type: 'Feature',
          properties: location.attr,
          geometry: location.poly || location.geom || location.point,
        };
        L.geoJSON(geojsonFeature, {
          weight: '1',
        }).addTo(this.secondaryLocationMap);
      }
    },
    async saveOrganization() {
      const isValid = this.$refs.form.reportValidity();
      if (!isValid) {
        return;
      }
      try {
        await Organization.api().patch(
          `/organizations/${this.currentOrganization.id}`,
          this.currentOrganization.$toJson(),
        );
        await this.$toasted.success(
          this.$t('~~Successfully Saved Organization'),
        );
      } catch (error) {
        await this.$toasted.error(getErrorMessage(error));
      }
    },
    async saveCurrentLocation() {
      this.loading = true;
      let { geometry } = this.currentPolygon.toGeoJSON();
      const { type, features } = this.currentPolygon.toGeoJSON();
      const location = {};
      if (type === 'FeatureCollection') {
        const [feature] = features;
        geometry = feature.geometry;
      }

      if (geometry.type === 'Point') {
        location.point = geometry;
      } else if (geometry.type === 'Polygon') {
        location.poly = geometry;
      } else if (geometry.type === 'MultiPolygon') {
        location.geom = geometry;
      }

      try {
        const response = await Location.api().post('/locations', location);
        const locationId = response.response.data.id;
        await Location.api().fetchById(locationId);
        this.updateOrganization(locationId, this.settingLocation);
        await Organization.api().patch(
          `/organizations/${this.currentOrganization.id}`,
          {
            [this.settingLocation]: locationId,
          },
        );
        await this.reloadMaps();
        this.settingLocation = '';
      } catch (e) {
        this.$log.error(e);
      } finally {
        this.loading = false;
      }
    },
    createTileLayer() {
      return L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          id: 'openStreetMap',
        },
      );
    },
    updateOrganization(value, key) {
      Organization.update({
        where: this.currentOrganization.id,
        data: {
          [key]: value,
        },
      });
    },
    async handleLogoUpload(fileList) {
      if (fileList.length === 0) {
        this.uploading = false;
        return;
      }
      const formData = new FormData();
      formData.append('upload', fileList[0]);
      formData.append('type_t', 'fileTypes.logo');
      this.uploading = true;
      try {
        const result = await this.$http.post(
          `${process.env.VUE_APP_API_BASE_URL}/files`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          },
        );
        const file = result.data.id;

        const logos = this.currentOrganization.files.filter(
          picture => picture.file_type_t === 'fileTypes.logo',
        );

        const oldImages = logos.map(picture =>
          Organization.api().deleteFile(
            this.currentOrganization.id,
            picture.id,
          ),
        );
        await Promise.all(oldImages);

        await Organization.api().addFile(this.currentOrganization.id, file);
        await Organization.api().get(
          `/organizations/${this.currentOrganization.id}`,
        );
      } catch (error) {
        await this.$toasted.error(getErrorMessage(error));
      } finally {
        this.uploading = false;
      }
    },
    async onUserSearch(value) {
      const results = await User.api().get(
        `/users?search=${value}&limit=10&fields=id,name&organization=${this.currentOrganization.id}`,
        {
          dataKey: 'results',
        },
      );
      this.userResults = results.entities.users;
    },
  },
};
</script>

<style scoped>
.divider {
  width: 36rem;
  @apply my-4 border-b;
}

.org-form {
  width: 36rem;
}

.form-row {
  @apply flex pb-4;
}
</style>
