//Zu jedem Datum 3 Stunden addieren um mit Zeitumstellung umzugehen
//FIXME: Das muss besser gehen

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }