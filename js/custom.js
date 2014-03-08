/*global store */

var myApp = angular.module('app', ['ngAnimate']);

var MainCtrl = function($scope) {
  //debug
  // enddebug

  if (!store.enabled) {
    $scope.view = {
      upgrade: true
    };
    return;
  }

  $scope.habits = store.get('habits') || {
    success: [],
    comfort: []
  };

  $scope.saveComfort = function() {
    var comfort = $scope.newComfort;
    var newComfort = { name: comfort };
    $scope.newComfort = '';
    $scope.habits.comfort.push(newComfort);

    store.set('habits', $scope.habits);
  };

  $scope.removeComfort = function(index) {
    $scope.habits.comfort.splice(index, 1);
    store.set('habits', $scope.habits);
  };

  $scope.saveSuccess = function() {
    var success = $scope.newSuccess;
    var newSuccess = { name: success };
    $scope.newSuccess = '';
    $scope.habits.success.push(newSuccess);
    store.set('habits', $scope.habits);
  };

  $scope.removeSuccess = function(index) {
    $scope.habits.success.splice(index, 1);
    store.set('habits', $scope.habits);
  };

  $scope.setHabit = function(habit) {
    $scope.lastHabit = habit;
  };

  $scope.show = function(type) {
    if (!type) {
      $scope.mindful = false;
      $scope.alternative = false;
      return;
    }
    switch (type)
    {
    case ('mindful'):
      $scope.mindful = true;
      $scope.alternative = false;
      break;
    case ('alternative'):
      $scope.mindful = false;
      $scope.alternative = true;
      break;
    default:
      $scope.mindful = false;
      $scope.alternative = false;
    }


  };

  $scope.history = store.get('history') || [];

  $scope.reset = function() {
    $scope.reviewEvents = [];
    $scope.bill = {
      drinks: {
        ordered: 0,
        received: 0
      },
      food: {
        ordered: 0,
        received: 0
      }
    };
    $scope.location = undefined;
    $scope.drinkCount = [];
    $scope.hasLocation = false;
    $scope.waitingOnBill = false;
    $scope.waitingOnFood = false;
    $scope.waitingOnDrink = false;
    $scope.payedBill = false;
    $scope.hasOrdered = false;

    $scope.view = {
      history: false,
      details: true
    };
  };
  $scope.reset();
  $scope.save = function() {
    $scope.history.push({
      location: $scope.location,
      log: $scope.reviewEvents
    });
    store.set('history', $scope.history);
    $scope.reset();
    $scope.toggleView();

  };

  $scope.toggleView = function(){
    if ($scope.view.history) {
      $scope.view.history = false;
      $scope.view.details = true;
    } else if ( $scope.view.details) {
      $scope.view.history = true;
      $scope.view.details = false;
    }
  };

  var addAction = function(action, type) {
    var message = '';
    switch (action){
    case 'arrive':
      message += 'Arrived at ';
      break;
    case 'order':
      $scope.hasOrdered = true;
      message += 'Ordered ';
      break;
    case 'receive':
      message += 'Received ';
      break;
    case 'pay':
      message += 'Payed ';
      break;
    }
    message += type;
    $scope.reviewEvents.push({
      message: message,
      time: new Date()
    });
  };

  $scope.arrive = function (){
    if ($scope.location) {
      $scope.hasLocation = true;
      addAction('arrive', $scope.location);
    }
  };
  var resetBillRequest = function() {
    $scope.waitingOnPayingBill = false;
    $scope.waitingOnBill = false;
  };
  $scope.orderDrink = function (){
    $scope.bill.drinks.ordered++;
    resetBillRequest();
    $scope.waitingOnDrink = true;
    addAction('order', 'drink');
  };
  $scope.receiveDrink = function (){
    $scope.bill.drinks.received++;
    $scope.waitingOnDrink = false;
    addAction('receive', 'drink');
  };

  $scope.orderFood = function (){
    $scope.bill.food.ordered++;
    $scope.waitingOnFood = true;
    resetBillRequest();
    addAction('order', 'food');
  };
  $scope.receiveFood = function (){
    $scope.bill.food.received++;
    $scope.waitingOnFood = false;
    addAction('receive', 'food');
  };

  $scope.orderBill = function (){
    $scope.waitingOnBill = true;
    addAction('order', 'bill');
  };
  $scope.receiveBill = function (){
    $scope.waitingOnBill = false;
    $scope.waitingOnPayingBill = true;
    addAction('receive', 'bill');
  };
  $scope.payBill = function (){
    $scope.waitingOnPayingBill = false;
    addAction('pay', 'bill');
    $scope.payedBill = true;
  };

};
myApp.controller('MainCtrl', ['$scope', MainCtrl]);
