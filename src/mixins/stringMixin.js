import moment from 'moment';

export const stringMixin = {
  filters: {
    truncateYear: function (iniitialDate, compareDate) {
      if (moment(iniitialDate).format('YYYY') === moment(compareDate).format('YYYY')) {
        return moment(iniitialDate).format("MMM D");
      }

      return moment(iniitialDate).format("MMM Do, YYYY");

    },
    truncateMonth: function (iniitialDate, compareDate) {

      if (moment(iniitialDate).format('MMM') === moment(compareDate).format('MMM') &&
        moment(iniitialDate).format('YYYY') === moment(compareDate).format('YYYY') &&
        typeof compareDate !== 'undefined') {
        return moment(iniitialDate).format("Do, YYYY");
      }

      return moment(iniitialDate).format("MMM Do, YYYY");

    },
    decodeASCII: function (val){
      let e = document.createElement('textarea');
      e.innerHTML = val;
      // handle case of empty input
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
  }
};
