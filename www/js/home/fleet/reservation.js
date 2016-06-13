angular.module('app.home.fleet.reservation', ['ionic', 'app.home.fleet', 'util.shared', 'util.url'])

    .controller('reservationOrderCtrl', function($scope, $ionicModal, shared, fleetOrder) {
        $scope.order = fleetOrder;

        $scope.$watch(function() {
            return $scope.order;
        }, function (newValue, oldValue) {
            $scope.order = newValue;
        });

        $ionicModal.fromTemplateUrl('templates/home/fleet/service.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addReservationModal = modal;
        });

        $scope.showAddReservation = function() {
            $scope.addReservationModal.show();
        };

        $scope.noReservation = function() {
            return Object.keys($scope.order.reservations).length === 0;
        };

        $scope.getService = function(id) {
            var service = shared.getService(id);

            return service.name + (service.note ? " (" + service.note + ")" : "");
        };

        $scope.getAddon = function(id) {
            var addon = shared.getAddon(id);

            return addon.name + (addon.note ? " (" + addon.note + ")" : "");
        };
    })

    .controller('orderCtrl', function($scope, $state, $ionicActionSheet, $http, shared, url, fleetOrder) {
        $scope.validateRequest = function(request) {
            if (request.car_id <= 0) {
                shared.alert("Please choose a vehicle");
                return false;
            }

            if (request.payment_id <= 0) {
                shared.alert("Please choose a payment method");
                return false;
            }

            if (request.opening <= 0) {
                shared.alert("Please choose a date");
                return false;
            }

            if (!request.services.length) {
                shared.alert("Please choose at least one service");
                return false;
            }

            return true;
        };

        $scope.placeOrderSheet = function() {
            var request = {
                note: "test",
                types: "",
                opening: 1,
                services: [],
                addons: [],
                day: "",
                hour: ""
            };

            var id = 0;
            var reservation = null;
            var addonInfo = null;

            for (id in fleetOrder.reservations) {
                reservation = fleetOrder.reservations[id];

                if (reservation.services && reservation.services.length > 0) {
                    request.services.push({
                        car_count: reservation.car_count,
                        services: reservation.services
                    });
                }

                if (reservation.addons && reservation.addons.length > 0) {
                    addonInfo = {
                        car_count: reservation.car_count,
                        addons: []
                    };

                    Array.prototype.forEach.call(reservation.addons, function(addon) {
                        addonInfo.addons.push({
                            id: addon.id,
                            amount: addon.amount
                        });
                    });

                    request.addons.push(addonInfo);
                }
            }

            console.log(request);
            return;

            if (!$scope.validateRequest(request)) {
                return;
            }

            $scope.hideReservationSheet = $ionicActionSheet.show({
                titleText: 'We will send estimated price to you later. We require you to cancel the reservation 24 hours ahead, otherwise we will charge 50% of the appointment cost.',
                destructiveText: 'Confirm',
                destructiveButtonClicked: function() {
                    shared.showLoading();
                    $http
                        .post(url.placeOrder, shared.getRequestBody(request))
                        .success(function(data, status, headers, config) {
                            shared.hideLoading();

                            $scope.hideReservationSheet();

                            $state.go("menu.myservice.reservation");
                        })
                        .error(function(data, status, headers, config) {
                            $scope.hideReservationSheet();
                            shared.hideLoading();
                            shared.alert(data);
                        });
                },
                cancelText: 'Cancel',
                cancel: function() {
                    
                }
            });
        };
    })

    .controller('openingCtrl', function($scope, $http, $timeout, shared, url, orderOpening, orderService, orderAddon) {
        $scope.openings = [];
        $scope.showIndex = -1;
        $scope.selectedRange = null;
        $scope.getTime = shared.getTime;

        var services = [];
        var addons = [];
        var types = {};

        $scope.hideOpeningModal = function() {
            $scope.openingModal.hide();
        };

        for (var _i = 0; _i < orderService.services.length; _i++) {
            if (orderService.services[_i].checked) {
                services.push(orderService.services[_i].id);
                types[orderService.services[_i].type] = 1;
            }
        }

        for (var key in orderAddon.addons) {
            if (orderAddon.addons[key].checked) {
                addons.push(orderAddon.addons[key].addon.id);
            }
        }

        $scope.showOpening = function(index, day) {
            if (index === $scope.showIndex) {
                $scope.showIndex = -1;
            } else {
                $scope.showIndex = index;
                shared.clickOpening(day);
            }
        };

        $scope.reloadOpening = function() {
            $scope.showIndex = -1;
            $scope.openings = [];
            shared.reloadOpening();
            shared.showLoading();

            $http
                .post(url.openings, shared.getRequestBody({
                    services: services,
                    addons: addons,
                    types: Object.keys(types).length > 1 ? "BOTH" : Object.keys(types)[0]
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.openings = shared.processOpening(data);
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                    $scope.hideOpeningModal();
                });
        };

        $scope.goToOrder = function(id, day, start, end) {
            shared.demandOpening(id);

            orderOpening.id = id;
            orderOpening.day = day;
            orderOpening.start = $scope.getTime(start);
            orderOpening.end = $scope.getTime(end);

            var t = $timeout(function() {
                $scope.hideOpeningModal();
                $timeout.cancel(t);
            }, 200);
        };

        $scope.reloadOpening();
    })

    .controller('openingSelectCtl', function($scope, $ionicModal, shared, orderOpening) {
        $scope.opening = {
            day: orderOpening.day,
            start: orderOpening.start,
            end: orderOpening.end
        };

        $scope.$watch(function() {
            return orderOpening.id;
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
    })

    .controller('addressSelectCtrl', function($scope, $ionicModal, shared) {
        $scope.address = shared.getUser().home_street || "";

        $scope.$watch(function() {
            return shared.getUser().home_street;
        }, function (newValue, oldValue) {
            $scope.address = shared.getUser().home_street;
        });

        $scope.showEditHome = function() {
            $ionicModal.fromTemplateUrl("templates/setting/home.html", {
                scope: $scope
            }).then(function(modal) {
                $scope.editHomeModal = modal;
                $scope.editHomeModal.show();
            });
        };
    })

    .controller('addonSelectCtl', function($scope, $state, shared, orderAddon, order) {
        $scope.addons = orderAddon.addons;

        $scope.selectAddon = function() {
            shared.openExtra();
            $state.go('menu.home.residentAddon');
        };

        $scope.unselectAddon = function($event, addon) {
            shared.unselectService(addon.id);

            addon.checked = false;
            order.price -= (addon.addon.price * addon.addon.amount);
            order.time -= addon.addon.time;
            addon.addon.amount = 1;
        };

        $scope.isAddonSelected = function(checked) {
            return {
                "egobie-service-disabled": !checked
            };
        };

        $scope.toggleAddon = function(addon) {
            addon.checked = !addon.checked;

            if (addon.checked) {
                order.time += addon.addon.time;
                order.price += addon.addon.price;
            } else {
                order.time -= addon.addon.time;
                order.price -= (addon.addon.price * addon.addon.amount);
                addon.addon.amount = 1;
            }
        };

        $scope.loseFocus = function(addon) {
            if (!addon.addon.amount || addon.addon.amount < addon.addon.min) {
                addon.addon.amount = 1;
                order.price += addon.addon.price;
            }
        };

        $scope.changeAddonAmount = function(oldValue, newValue) {
            var isNanOld = isNaN(oldValue);
            var isNanNew = isNaN(newValue.addon.amount);

            if (isNanOld && isNanNew) {
                return;
            } else if (isNanOld) {
                oldValue = 1;
            } else if (isNanNew){
                newValue.addon.amount = 1;
            }

            if (newValue.addon.amount > newValue.addon.max) {
                newValue.addon.amount = newValue.addon.max;
            }

            order.price -= oldValue * newValue.addon.price;
            order.price += newValue.addon.amount * newValue.addon.price;
        };

        $scope.pickAddon = function() {
            var ids = [];

            for (var key in $scope.addons) {
                if ($scope.addons[key].checked) {
                    console.log($scope.addons[key]);
                    ids.push($scope.addons[key].addon.id);
                }
            }

            shared.demandAddons(ids);

            $scope.$ionicGoBack();
            //$state.go("menu.home.reservation");
        };
    });

