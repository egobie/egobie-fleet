angular.module('app.home.service', ['ionic', 'app.home.fleet', 'util.shared', 'util.url'])

    .controller('serviceSelectCtl', function($scope, $ionicModal, $timeout, shared, orderService, fleetOrder) {
        $scope.services = orderService.services;
        $scope.addons = shared.getAddons();
        $scope.serviceNames = shared.getServiceNames();
        $scope.carWash = shared.getCarWashServices();
        $scope.oilChange = shared.getOilChangeServices();
        $scope.selectedService = null;
        $scope.newReservation = {
            selected: 0,
            carCount: 0,
            title: "NEW RESERVATION",
            isValid: function() {
                return this.selected > 0 && this.carCount > 0;
            }
        };

        $scope.$watch(function() {
            return orderService.services;
        }, function(newValue, oldValue) {
            $scope.services = orderService.services;
        });

        $ionicModal.fromTemplateUrl('templates/service/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.serviceModel = modal;
        });

        $scope.hideAddReservation = function() {
            $scope.clearReservation();
            $scope.addReservationModal.hide();
            $timeout(function() {
                $scope.addReservationModal.remove();
            }, 200);
        };

        $scope.selectService = function() {
            var services = [];
            var addons = [];

            for (var _i = 0; _i < $scope.services.length; _i++) {
                if ($scope.services[_i].checked) {
                    services.push($scope.services[_i].id);
                }
            }

            for (var _i in $scope.addons) {
                if ($scope.addons[_i].checked) {
                    addons.push({
                        id: $scope.addons[_i].id,
                        amount: 1
                    });
                }
            }

            if ($scope.newReservation.isValid()) {
                if ($scope.current) {
                    fleetOrder.edit($scope.current.id, $scope.newReservation.carCount, services, addons);
                } else {
                    fleetOrder.add($scope.newReservation.carCount, services, addons);
                }

                $scope.hideAddReservation();
                // TODO demand addons
                shared.demandService(services);
            }
        };

        $scope.clearReservation = function() {
            $scope.newReservation.selected = 0;
            $scope.newReservation.carCount = 0;

            for (var _i = 0; _i < $scope.services.length; _i++) {
                $scope.services[_i].checked = false;
            }

            for (var _i in $scope.addons) {
                $scope.addons[_i].checked = false;
                $scope.addons[_i].amount = 1;
            }
        };

        $scope.toggleService = function(service, list) {
            var pre = service.checked;

            if (!service.checked) {
                $scope.newReservation.selected++;
            }

            for (var _i = 0; _i < list.length; _i++) {
                if (list[_i].checked) {
                    $scope.newReservation.selected--;
                }

                list[_i].checked = false;
            }

            service.checked = !pre;
        };

        $scope.toggleAddon = function(addon) {
            addon.checked = !addon.checked;

            if (addon.checked) {
                $scope.newReservation.selected++;
            } else {
                addon.amount = 1;
                $scope.newReservation.selected--;
            }
        };

        $scope.showService = function(service) {
            shared.readService(service.id);
            $scope.selectedService = service;
            $scope.serviceModel.show();
        };

        $scope.isServiceSelected = function(checked) {
            return {
                "egobie-service-disabled": !checked
            };
        };

        $scope.isDisabled = function() {
            return {
                "egobie-button-disabled": !$scope.newReservation.isValid()
            };
        };

        $scope.initService = function() {
            if ($scope.current) {
                var addons = [];

                $scope.newReservation.carCount = $scope.current.car_count;
                $scope.newReservation.title = "EDIT RESERVATION";

                Array.prototype.forEach.call($scope.current.addons, function(addon) {
                    addons.push(addon.id);
                });

                for (var _i = 0; _i < $scope.carWash.length; _i++) {
                    if ($scope.current.services.indexOf($scope.carWash[_i].id) >= 0) {
                        $scope.carWash[_i].checked = true;
                        $scope.newReservation.selected++;
                    }
                }

                for (var _i = 0; _i < $scope.oilChange.length; _i++) {
                    if ($scope.current.services.indexOf($scope.oilChange[_i].id) >= 0 ) {
                        $scope.oilChange[_i].checked = true;
                        $scope.newReservation.selected++;
                    }
                }

                for (var _i in $scope.addons) {
                    if (addons.indexOf($scope.addons[_i].id) >= 0) {
                        $scope.addons[_i].checked = true;
                        $scope.newReservation.selected++;
                    }
                }
            }
        };

        $scope.initService();
    });
