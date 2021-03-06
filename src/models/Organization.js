import { Model } from '@vuex-orm/core';
import Incident from '@/models/Incident';

export default class Organization extends Model {
  static entity = 'organizations';

  static fields() {
    return {
      id: this.increment(),
      name: this.string(''),
      url: this.string(''),
      facebook: this.string(''),
      twitter: this.string(''),
      affiliates: this.attr([]),
      primary_location: this.attr(null),
      secondary_location: this.attr(null),
      type_t: this.attr(null),
      user_count: this.attr(null),
      incidents: this.attr(null),
      incident_primary_contacts: this.attr(null),
      primary_contacts: this.attr(null),
      files: this.attr(null),
    };
  }

  get incident_list() {
    return Incident.query()
      .whereIdIn(this.incidents)
      .get();
  }

  static apiConfig = {
    actions: {
      addFile(id, file, type) {
        return this.post(
          `/organizations/${id}/files`,
          {
            file,
            type_t: type,
          },
          { save: false },
        );
      },
      deleteFile(id, file) {
        return this.delete(
          `/organizations/${id}/files`,
          {
            data: { file },
          },
          { save: false },
        );
      },
    },
  };
}
