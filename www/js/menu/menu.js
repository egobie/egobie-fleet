angular.module('app.menu', ['ionic', 'ngCordova', 'util.request', 'util.shared'])

    .config(function($stateProvider, $ionicConfigProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        // $ionicConfigProvider.views.maxCache(10);
        $ionicConfigProvider.views.transition('platform');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        // $ionicConfigProvider.views.forwardCache(false);
        $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
        $ionicConfigProvider.backButton.text('');                  // default is 'Back'
        $ionicConfigProvider.backButton.previousTitleText(false);  // hides the 'Back' text
        // $ionicConfigProvider.templates.maxPrefetch(20);

        $stateProvider

            // Side Menu
            .state('menu', {
                url: '/menu',
                templateUrl: 'templates/menu/menu.html',
                abstract: true,
                resolve: {
//                    resolveUserCars: function(requestUserCars) {
//                        return requestUserCars.promise;
//                    },
//                    resolveCarMakers: function(requestCarMakers) {
//                        return requestCarMakers.promise;
//                    },
//                    resolveCarModels: function(requestCarModels) {
//                        return requestCarModels.promise;
//                    },
                    resolveServices: function(requestServices) {
                        return requestServices.promise;
                    },
                    resolveAddons: function(requestAddons) {
                        return requestAddons.promise;
                    }
//                    resolveUserPayments: function(requestUserPayments) {
//                        return requestUserPayments.promise;
//                    }
                }
            });
    })

    .controller('menuCtrl', function($scope, $ionicHistory, $timeout, $state, shared) {
        $scope.user = {
            name: shared.getUser().first || "Welcome",
            isFleet: shared.isFleet()
        };

        $scope.$watch(function() {
            return shared.getUser().first;
        }, function(newValue) {
            $scope.user.name = newValue || "Welcome";
        });

        $scope.signOut = function() {
            shared.showLoading();

            $timeout(function() {
                shared.hideLoading();
                $state.go('sign.in');

                $timeout(function () {
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        historyRoot: true
                    });
                }, 300);
            }, 300);
        };

        shared.loadSaleOrders(true);
        shared.loadSaleUsers(true, 0);
    });