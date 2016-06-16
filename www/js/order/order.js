angular.module('app.order', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.order', {
                url: '/order',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/order/order.html'
                    }
                }
            });
    })

    .controller('fleetOrderCtrl', function($scope, $interval, $ionicModal, $http, shared, url) {
        $scope.toHourMin = shared.toHourMin;
        $scope.details = [];
        $scope.orders = [];
        $scope.interval = null;

        $ionicModal.fromTemplateUrl('templates/order/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.orderDetailModel = modal;
        });

        $scope.$on('$destroy', function(event) {
            $interval.cancel($scope.interval);
        });

        $scope.showOrderDetail = function(id) {
            $scope.orderDetailModel.show();
            $scope.loadOrderDetail(id);
        };

        $scope.hideOrderDetail = function() {
            $scope.details = [];
            $scope.orderDetailModel.hide();
        };

        $scope.loadOrder = function(animation) {
            if (animation) {
                shared.showLoading();
                
                if ($scope.interval) {
                    $interval.cancel($scope.interval);
                }

                $scope.interval = $interval(function() {
                    $scope.loadOrder(false);
                }, 30000);
            }

            $http
                .post(url.fleetOrder, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.orders = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.loadOrderDetail = function(id) {
            shared.showLoading();

            $http
                .post(url.fleetOrderDetail, shared.getRequestBody({
                    fleet_service_id: id
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.details = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.unitStyle = function(unit) {
            if (unit === "DAY") {
                return {
                    'day': true
                };
            } else if (unit === "HOUR") {
                return {
                    'hour': true
                };
            } else if (unit === "MINUTE") {
                return {
                    'min': true
                };
            }
        };

        $scope.isWaiting = function(reservation) {
            return reservation.status === "WAITING";
        };

        $scope.isWill = function(reservation) {
            return reservation.how_long > 0 && reservation.status === "RESERVED";
        };

        $scope.isDelay = function(reservation) {
            return reservation.how_long < 0 && reservation.status === "RESERVED";
        };

        $scope.isInProgress = function(reservation) {
            return reservation.status === "IN_PROGRESS";
        };

        $scope.noOrder = function() {
            return !$scope.orders || $scope.orders.length === 0;
        };

        $scope.interval = $interval(function() {
            $scope.loadOrder(false);
        }, 30000);

        $scope.loadOrder(true);
    });