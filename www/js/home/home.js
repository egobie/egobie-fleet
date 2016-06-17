/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.home', ['ionic', 'ionic.rating'])

    .config(function($stateProvider) {

        $stateProvider

            .state('menu.home', {
                url: '/home',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/home/home.html'
                    }
                }
            })

            .state('menu.home.fleet', {
                url: '/fleet',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/fleet.html'
                    }
                }
            });
    })

    .controller('reservationCtrl', function($scope, $ionicActionSheet) {

        $scope.showReservationSheet = function() {

            $scope.hideReservationSheet = $ionicActionSheet.show({
                titleText: 'Make a Reservation',
                destructiveText: 'Place Order',
                destructiveButtonClicked: function() {
                    $scope.hideReservationSheet();
                },
                cancelText: 'Cancel',
                cancel: function() {
                    
                }
            });
        };
    });
