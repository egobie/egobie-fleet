angular.module('app.home.fleet', ['ionic', 'util.shared'])

    .service('orderOpening', function() {
        return {
            id: -1,
            day: "",
            start: "",
            end: "",
            diff: -1,

            clear: function() {
                this.id = -1;
                this.day = "";
                this.start = "";
                this.end = "";
                this.diff = -1;
            }
        };
    })

    .service('orderService', function(shared) {
        var _i = 0;
        var _temp = shared.getServices();
        var obj = {
            index: {},
            services: [],
            clear: function() {
                var charge = null;
                var addons = null;

                for (var _j = 0; _j < this.services.length; _j++) {
                    this.services[_j].checked = false;

                    charge = this.services[_j].charge;
                    addons = this.services[_j].addons;

                    if (charge) {
                        for (var i = 0; i < charge.length; i++) {
                            charge[i].amount = 1;
                        }
                    }

                    if (addons) {
                        for (var i = 0; i < addons.length; i++) {
                            addons[i].amount = 1;
                        }
                    }
                }
            }
        };

        for (var _id in _temp) {
            obj.index[_id] = _i;
            obj.services.push(_temp[_id]);
            _i++;
        }

        return obj;
    })

    .service('fleetOrder', function() {
        return {
            _id: 0,
            orders: {},
            type: "",
            getOrders: function() {
                var orders = [];

                for (var _id in this.orders) {
                    orders.push(this.orders[_id]);
                }

                return orders;
            },
            add: function(carCount, services, addons) {
                this._id++;
                this.orders[this._id] = {
                    order_id: this._id,
                    car_count: carCount,
                    service_ids: services,
                    addons: addons
                };
            },
            edit: function(id, carCount, services, addons) {
                this.orders[id].car_count = carCount;
                this.orders[id].service_ids = services;
                this.orders[id].addons = addons;
            },
            remove: function(id) {
                delete this.orders[id];
            },
            clear: function() {
                this._id = 0;
                this.orders = {};
            }
        };
    })

    .service('order', function(shared) {
        return {
            price: 0,
            time: 0,
            getRealPrice: function() {
                if (this.price <= 0) {
                    return "";
                }

                var discount = shared.getUser().discount;

                if (discount > 0) {
                    return (this.price * 1.07 * 0.9).toFixed(2);
                } else {
                    return (this.price * 1.07).toFixed(2);
                }
            },
            getRealTime: function() {
                var hour = Math.floor(this.time / 60);
                var mins = this.time % 60;

                if (this.time <= 0) {
                    return "";
                } else if (hour < 1) {
                    return mins + " mins";
                } else if (hour < 2) {
                    return (hour + " hour ") + (mins === 0 ? "" : mins + " mins");
                } else {
                    return hour + " hours " + (mins === 0 ? "" : mins + " mins");
                }
            },
            clear: function() {
                this.price = 0;
                this.time = 0;
            }
        };
    })

    .service('demandOrder', function($interval) {
        return {
            services: [],
            interval: null,
            clear: function() {
                if (this.interval) {
                    $interval.cancel(this.interval);
                }

                this.services = [];
                this.interval = null;
            }
        };
    })

    .config(function($stateProvider) {

        $stateProvider

            .state('menu.home.demand', {
                url: '/fleet/demand',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/demand/demand.html'
                    }
                }
            })

            .state('menu.home.demandOrder', {
                url: '/fleet/demand/order',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/demand/order.html'
                    }
                }
            })

            .state('menu.home.reservation', {
                url: '/fleet/reservation',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/reservation/reservation.html'
                    }
                }
            })

            .state('menu.home.residentCar', {
                url: '/fleet/reservation/car',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/car.html'
                    }
                }
            })

            .state('menu.home.residentService', {
                url: '/fleet/reservation/service',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/service.html'
                    }
                }
            })

            .state('menu.home.residentAddon', {
                url: '/fleet/reservation/addon',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/addon.html'
                    }
                }
            })

            .state('menu.home.residentPayment', {
                url: '/fleet/reservation/payment',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/fleet/payment.html'
                    }
                }
            });
    })

    .controller('navigationCtrl', function($scope, $state, $ionicModal, shared) {
        shared.goHome();

        var user = shared.getUser();

        $scope.showEditUser = function() {
            $ionicModal.fromTemplateUrl('templates/setting/user.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.editUserModal = modal;
                $scope.editUserModal.show();
            });
        };

        $scope.gotoOnDemand = function() {
            if (!user.first || !user.phone) {
                $scope._egobie = "menu.home.demand";
                $scope.showEditUser();
            } else {
                $state.go("menu.home.demand");
            }
        };

        $scope.gotoReservation = function() {
            if (!user.first || !user.phone) {
                $scope._egobie = "menu.home.reservation";
                $scope.showEditUser();
            } else {
                $state.go("menu.home.reservation");
            }
        };
    });
