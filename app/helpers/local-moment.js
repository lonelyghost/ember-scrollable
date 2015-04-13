import Ember from 'ember';
import timeZoneAbbreviation from './time-zone-abbreviation';

var localMoment = function(time, timeZone, format) {
  var timeToFormat;

  if (timeZone != null) {
    timeToFormat = moment.tz(time, timeZone);
  } else {
    timeToFormat = moment(time);
  }

  return `${timeToFormat.format(format)} ${timeZoneAbbreviation(time, timeZone)}`;
};

Ember.Handlebars.makeBoundHelper(localMoment);

export default localMoment;
