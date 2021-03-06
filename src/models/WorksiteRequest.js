import { Model } from '@vuex-orm/core';
import moment from 'moment';

export default class WorksiteRequest extends Model {
  static entity = 'worksite_requests';

  static fields() {
    return {
      id: this.increment(),
      worksite_work_type: this.attr(null),
      worksite: this.attr(null),
      case_number: this.attr(null),
      requested_by: this.attr(null),
      requested_by_org: this.attr(null),
      requested_to_org: this.attr(null),
      expires_at: this.attr(null),
      created_at: this.attr(null),
      approved_at: this.attr(null),
      rejected_at: this.attr(null),
      accepted_rejected_reason: this.attr(null),
    };
  }

  get status() {
    return moment(this.expires_at) > moment() ? 'Requested' : 'Expired';
  }

  get last_action() {
    if (this.approved_at) {
      return `${moment(this.approved_at).format(
        'DD/MM/YYYY hh:mm',
      )} (Approved)`;
    }

    if (this.rejected_at) {
      return `${moment(this.rejected_at).format(
        'DD/MM/YYYY hh:mm',
      )} (Rejected)`;
    }

    if (moment(this.expires_at) > moment()) {
      return `${moment(this.created_at).format('DD/MM/YYYY hh:mm')} (Created)`;
    }

    return 'Expired';
  }

  get next_action() {
    if (this.approved_at) {
      return '';
    }

    if (this.rejected_at) {
      return '';
    }

    if (moment(this.expires_at) > moment()) {
      return `${moment(this.created_at).format(
        'DD/MM/YYYY hh:mm',
      )} (Auto approval)`;
    }

    return '';
  }

  get has_response() {
    return Boolean(this.approved_at) || Boolean(this.rejected_at);
  }

  static apiConfig = {
    actions: {
      acceptRequest(id, reason = 'Accept') {
        const data = {
          action: 'approve',
          accepted_rejected_reason: reason,
        };
        return this.post(`/worksite_requests/${id}/respond`, data, {
          save: false,
        });
      },
      rejectRequest(id, reason = 'Reject') {
        const data = {
          action: 'reject',
          accepted_rejected_reason: reason,
        };
        return this.post(`/worksite_requests/${id}/respond`, data, {
          save: false,
        });
      },
      cancelRequest(id) {
        return this.delete(`/worksite_requests/${id}`, {}, { save: false });
      },
    },
  };
}
