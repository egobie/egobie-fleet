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

        $scope.current = {
            id: -1,
            price: 0,
            status: null
        };

        $scope.$watch(function() {
            return shared.getSaleOrders();
        }, function(newValue) {
            $scope.orders = newValue;
        });

        $ionicModal.fromTemplateUrl('templates/order/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.orderDetailModel = modal;
        });

        $scope.showOrderDetail = function(order) {
            $scope.orderDetailModel.show();
            $scope.loadOrderDetail(order.id);
            $scope.current.id = order.id;
            $scope.current.price = order.price;
            $scope.current.status = order.status;
        };

        $scope.hideOrderDetail = function() {
            $scope.orderDetailModel.hide();
            $scope.clear();
        };

        $scope.loadOrderDetail = function(id) {
            shared.showLoading();

            $http
                .post(url.saleOrderDetail, shared.getRequestBody({
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

        $scope.loadOrder = function() {
            shared.loadSaleOrders();
        };

        $scope.savePrice = function() {
            if ($scope.isValid()) {
                shared.showLoading();

                $http
                    .post(url.promotePrice, shared.getRequestBody({
                        price: parseFloat($scope.current.price),
                        fleet_service_id: $scope.current.id
                    }))
                    .success(function(data, status, headers, config) {
                        shared.hideLoading();
                        $scope.hideOrderDetail();
                        $scope.loadOrder(true);
                    })
                    .error(function(data, status, headers, config) {
                        shared.hideLoading();
                        shared.alert(data);
                    });
            }
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

        $scope.isDisabled = function() {
            return {
                "egobie-button-disabled": !$scope.isValid()
            };
        };

        $scope.isValid = function() {
            return $scope.current.status === "WAITING" && $scope.current.price > 0 &&
                shared.testNumeric($scope.current.price);
        };

        $scope.clear = function() {
            $scope.details = [];
            $scope.current.id = -1;
            $scope.current.price = 0;
            $scope.current.status = null;
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