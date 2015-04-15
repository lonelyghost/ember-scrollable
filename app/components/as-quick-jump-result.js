import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['type', ':quick-jump-result'],

  type: Ember.computed.oneWay('result.type'),
  id: Ember.computed.oneWay('result.id'),
  path: Ember.computed.oneWay('resultProperties.path'),

  url: Ember.computed('id', 'path', function() {
    return `${EmberENV.pistachioUrl}/${this.get('id')}/${this.get('path')}`;
  }),

  title: Ember.computed('result', 'resultProperties', function() {
    return this.get(`result.${this.get('resultProperties.titlePath')}`);
  }),

  details: Ember.computed('result', 'resultProperties', function() {
    return this.get(`result.${this.get('resultProperties.detailsPath')}`);
  }),

  resultProperties: Ember.computed('type', function() {
    return this.typeProperties[this.get('type')];
  }),

  typeProperties: {
    account: {
      titlePath: 'name',
      path: 'client/accounts'
    },

    advisor: {
      titlePath: 'name',
      detailsPath: 'bestPosition',
      path: 'advisors'
    },

    contact: {
      titlePath: 'name',
      detailsPath: 'accountName',
      path: 'client/contacts'
    },

    entity: {
      titlePath: 'name',
      path: 'entities'
    },

    project: {
      titlePath: 'codename',
      detailsPath: 'externalTitle',
      path: 'projects'
    },

    target: {
      titlePath: 'name',
      path: 'client/targets'
    },

    user: {
      titlePath: 'name',
      detailsPath: 'teamName',
      path: 'faces'
    }
  }
});