angular.module('app.home.fleet.reservation', ['ionic', 'app.home.fleet', 'util.shared', 'util.url'])

    .controller('reservationOrderCtrl', function($scope, $ionicModal, $ionicActionSheet, shared, orderOpening, fleetOrder) {
        $scope.order = fleetOrder;
        $scope.opening = {
            day: orderOpening.day,
            start: orderOpening.start,
            end: orderOpening.end
        };

        $scope.$watch(function() {
            return $scope.order;
        }, function (newValue, oldValue) {
            $scope.order = newValue;
        });

        $scope.$watch(function() {
            return orderOpening.day + orderOpening.start;
        }, function(newValue, oldValue) {
            $scope.opening.day = orderOpening.day;
            $scope.opening.start = orderOpening.start;
            $scope.opening.end = orderOpening.end;
        });

        $scope.showOpeningModal = function() {
            $ionicModal.fromTemplateUrl("templates/home/fleet/opening.html", {
                scope: $scope
            }).then(function(modal) {
                $scope.openingModal = modal;
                $scope.openingModal.show();
                shared.openDate();
            });
        };

        $scope._createReservationModal = function() {
            $ionicModal.fromTemplateUrl('templates/home/fleet/service.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.addReservationModal = modal;
                $scope.addReservationModal.show();
            });
        };

        $scope.showAddReservation = function() {
            $scope.current = null;
            $scope._createReservationModal();
        };

        $scope.showEditReservation = function(reservation) {
            $scope.current = reservation;
            $scope._createReservationModal();
        };

        $scope.showReservationActionSheet = function(id, reservation) {
            $scope.hideReservationActionSheet = $ionicActionSheet.show({
                titleText: 'Manage Order',

                buttons: [
                    { text: 'Edit' }
                ],
                buttonClicked: function(index) {
                    $scope.hideReservationActionSheet();

                    if (index === 0) {
                        $scope.showEditReservation(reservation);
                    }
                },

                destructiveText: 'Delete',
                destructiveButtonClicked: function() {
                    fleetOrder.remove(id);
                    orderOpening.clear();
                    $scope.hideReservationActionSheet();
                },

                cancelText: 'Cancel',
                cancel: function() {
                    
                }
            });
        };

        $scope.clearOrders = function() {
            fleetOrder.clear();
            orderOpening.clear();
        };

        $scope.goBack = function() {
            $scope.clearOrders();
            $scope.$ionicGoBack();
        };

        $scope.getServiceName = function(id) {
            var service = shared.getService(id);

            return service.name + " (" + shared.getServiceType(service.type) + ")";
        };

        $scope.getServiceNote = function(id) {
            return shared.getService(id).note;
        };

        $scope.getAddonName = function(id) {
            return shared.getAddon(id).name;
        };

        $scope.getAddonNote = function(id) {
            return shared.getAddon(id).note;
        };
    })

    .controller('orderCtrl', function($scope, $state, $ionicActionSheet, $http, shared, url, orderOpening, fleetOrder) {
        $scope.placeOrderSheet = function() {
            var request = {
                note: "test",
                orders: fleetOrder.getOrders(),
                opening: orderOpening.id,
                day: orderOpening.day,
                hour: orderOpening.start.substring(0, orderOpening.start.length - 4)
            };

            if (!$scope.validateRequest(request)) {
                return;
            }

            $scope.hideReservationSheet = $ionicActionSheet.show({
                titleText: 'We will send estimated price to you later. We require you to cancel the reservation 24 hours ahead, otherwise we will charge 50% of the appointment cost.',
                destructiveText: 'Place Order',
                destructiveButtonClicked: function() {
                    shared.showLoading();
                    $http
                        .post(url.placeOrder, shared.getRequestBody(request))
                        .success(function(data, status, headers, config) {
                            shared.hideLoading();

                            $scope.hideReservationSheet();
                            $scope.clearOrders();
                            $state.go("menu.myservice.reservation");
                        })
                        .error(function(data, status, headers, config) {
                            $scope.hideReservationSheet();
                            $scope.clearOrders();
                            shared.hideLoading();
                            shared.alert(data);
                        });
                },
                cancelText: 'Cancel',
                cancel: function() {
                    
                }
            });
        };

        $scope.clearOrders = function() {
            fleetOrder.clear();
            orderOpening.clear();
        };

        $scope.validateRequest = function(request) {
            if (request.opening <= 0 && (request.day === "" || request.hour === "")) {
                shared.alert("Please choose/input a date");
                return false;
            }

            if (!request.orders.length) {
                shared.alert("Please choose at least one service");
                return false;
            }

            return true;
        };
    });
