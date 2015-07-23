import Ember from 'ember';
import SidePanelRouteMixin from 'ember-cli-paint/mixins/side-panel-route';
import PaginatedRouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(SidePanelRouteMixin, PaginatedRouteMixin, {
  perPage: 10,
  currentUser: Ember.inject.service(),
  preferences: Ember.inject.service(),

  titleToken: function(models) {
    let advisorName = models.unusedAdvisor.get('advisor.name');

    return `Unused Advisor: ${advisorName}`;
  },

  model: function(params) {
    return this.store.findRecord('unusedAdvisor', params.unused_advisor_id).then((unusedAdvisor) => {
      let advisorEmails = unusedAdvisor.get('advisor.emails').join(',');

      return Ember.RSVP.hash({
        unusedAdvisor: unusedAdvisor,
        emails: this.findPaged('email', { emails: advisorEmails }),
        emailTemplates: this.store.query('emailTemplate', { purpose: "Unused Advisor" }),
        emailVariables: this.store.query('emailVariable', {
          concerning_type: "email/unused_advisorship_email",
          concerning_id: unusedAdvisor.get('id')
        }),
        projectHistory: this.store.query('projectHistory', { advisor_id: unusedAdvisor.get('advisor.id') })
      });
    });
  },

  setupController: function(controller, models) {
    controller.set('emailDelivery', this.store.createRecord('emailDelivery', {
      concerningType: "email/unused_advisorship_email",
      concerningId: models.unusedAdvisor.get('id'),
      recipients: models.unusedAdvisor.get('defaultEmail'),
      from: this.get('currentUser.email')
    }));

    controller.set('model', models.unusedAdvisor);
    controller.set('emails', models.emails);
    controller.set('emailTemplates', models.emailTemplates);
    controller.set('emailVariables', models.emailVariables);
    controller.set('projectHistory', models.projectHistory);
    controller.set('selectedEmailTemplate', models.emailTemplates.findBy('id',
      this.get('preferences.unusedAdvisorEmailTemplateId')));
  }
});
