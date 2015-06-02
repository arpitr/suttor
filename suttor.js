Incidents = new Mongo.Collection("incidents");
Configurations = new Mongo.Collection("configurations");

if (Meteor.isClient) {
  // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
  Template.body.events({
    "submit .new-incident": function (event) {
      var text = event.target.text.value;
      var getConfigRate = Configurations.findOne({"configRate": {$exists: true}});
      var getRate = getConfigRate.configRate;
      Incidents.insert({
        avgRate: getRate,
        text: text,
        createdAt: new Date(),
      });
      event.target.text.value = "";
      return false;
    },
    "submit .set-new-rate": function (event) {
      var avgRate = event.target.text.value;
      var config_exist = Configurations.findOne({"configRate": {$exists: true}});
      if (config_exist._id) {
        Configurations.update(
            config_exist._id, {
              $set: {
                "configRate": avgRate,
                "updatedAt": new Date() // current time 
              }
            }
        );
      } else {
        Configurations.insert({
          "configRate": avgRate,
          "updatedAt": new Date() // current time
        });
      }
      event.target.text.value = "";
      return false;
    }
  });
  // In the client code, below everything else
  Template.incident.events({
    "click .delete": function () {
      //alert("You better die ass hole.");
      Incidents.remove(this._id);
    }
  });
  // This code only runs on the client
  Template.body.helpers({
    incidents: function () {
      var incidents = Incidents.find({});
      return incidents;
    },
    totalCount: function () {
      var count = Incidents.find().count();
      return count;
    },
    currentCost: function () {
      var currentConfig = Configurations.findOne({"configRate": {$exists: true}});
      return currentConfig.configRate;
    },
    totalSave: function () {
      var totalCount = Incidents.find().count();
      var currentConfig = Configurations.findOne({"configRate": {$exists: true}});
      var totalSave = totalCount * currentConfig.configRate;
      return totalSave;
    },
    formattedIncidents: function () {
      //return "";
      var get_all_incidents = Incidents.find({}).fetch();
      var count_yet = 0;
      get_all_incidents.forEach(function (arrayItem) {
        var date = arrayItem.createdAt;
        date = moment(date).format('MM-DD-YYYY');
        incident_listing[date] = [];
        console.log(date);
        count_yet = count_yet + 1;
        incident_listing[date]['date'] = date;
        incident_listing[date]['markup'] += '<li><span>' + arrayItem.text + '<b>Total Saved</b>' + arrayItem.totalsaved + '<b>Total Count</b>' + count_yet + '</span></li>';
      });
      return incident_listing;
    },
    shortformattedIncidents: function () {
      //return "";
      var get_all_incidents = Incidents.find({}).fetch();
      var count_yet = 0;
      get_all_incidents.forEach(function (arrayItem) {
        var date = arrayItem.createdAt;
        date = moment(date).format('MM-DD-YYYY');
        incident_listing[date] = [];
        count_yet = count_yet + 1;
        incident_listing[date]['date'] = date;
        incident_listing[date]['text'] = date;
      });
      return incident_listing;
    }
  });
}