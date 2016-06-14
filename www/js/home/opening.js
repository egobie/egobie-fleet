angular.module('app.home.opening', ['ionic', 'app.home.fleet', 'util.shared', 'util.url'])

    .controller('openingCtrl', function($scope, $http, $timeout, shared, url, orderOpening, fleetOrder) {
        $scope.openings = [];
        $scope.showIndex = -1;
        $scope.selectedRange = null;
        $scope.getTime = shared.getTime;

        var orders = fleetOrder.getServicesAndAddons();
        var types = {};

        $scope.hideOpeningModal = function() {
            $scope.openingModal.hide();
        };

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
                    services: orders.services,
                    addons: orders.addons,
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
    });