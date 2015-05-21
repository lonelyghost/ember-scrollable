import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['currentUser'],
  currentUser: Ember.computed.oneWay('controllers.currentUser'),
  teamId: null,
  teams: Ember.computed.oneWay('currentUser.teams'),
  teamMembers: Ember.computed.oneWay('model.teamMembers'),

  isTeamView: Ember.computed('teamId', function() {
    return this.get('teamId') !== null;
  }),

  selectedTeam: Ember.computed('teamId', 'teams.@each.id', {
    get: function() {
      var teamId = this.get('teamId');

      if (teamId != null) {
        return this.get('teams').findBy('id', teamId);
      } else {
        return null;
      }
    },

    set: function(_, value) {
      if (value != null) {
        this.set('teamId', value.get('id'));
      } else {
        this.set('teamId', null);
      }

      return value;
    }
  }),

  queryParams: {
    teamId: 'team_id'
  },

  upcomingInteractions: Ember.computed('model.interactions.[]', function() {
    return this.get('model.interactions')
      .filterBy('scheduledCallTime')
      .sortBy('scheduledCallTime');
  }),

  interactionsToSchedule: Ember.computed('model.interactions.[]', function() {
    return this.get('model.interactions').filter(function(interaction) {
      return interaction.get('requestedAt') != null &&
        interaction.get('scheduledCallTime') == null &&
        !interaction.get('actioned');
    }).sort(function(a, b) {
      return -Ember.compare(a.get('requestedAt'), b.get('requestedAt'));
    });
  }),

  unusedAdvisors: Ember.computed('model.unusedAdvisors.[]', function() {
    return this.get('model.unusedAdvisors').sortBy('termsSentAt');
  })
});
