angular.module('app.home.opening', ['ionic', 'app.home.fleet', 'util.shared', 'util.url'])

    .controller('openingCtrl', function($scope, $http, $timeout, shared, url, orderOpening, fleetOrder) {
        $scope.openings = [];
        $scope.showIndex = -1;
        $scope.selectedRange = null;
        $scope.getTime = shared.getTime;
        $scope.desiredDate = {
            day: "",
            hour: ""
        };

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
                    orders: fleetOrder.getOrders()
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

        $scope.saveDesiredDate = function() {
            var now = new Date();
            var dates = ($scope.desiredDate.day + " " + $scope.desiredDate.hour).split(/[- :]/);

            if (dates.length !== 5) {
                shared.alert("Invalid input datetime");
                return;
            }

            var date = new Date(dates[0], dates[1] - 1, dates[2], dates[3], dates[4]);
            var month = 0;
            var day = 0;
            var hour = 0;
            var min = 0;
            var later = null;
            var min_later = 0;
            var hour_later = 0;

            if (date.toDateString() === "Invalid Date" || now > date) {
                shared.alert("Invalid input datetime");
            } else {
                later = new Date(date);
                month = date.getMonth() + 1;
                day = date.getDate();
                hour = date.getHours();
                min = date.getMinutes() < 30 ? 0 : 30;
                later.setMinutes(min + 30);
                hour_later = later.getHours();
                min_later = later.getMinutes();

                orderOpening.id = -1;
                orderOpening.start = shared.twoDigits(hour) + ":" + shared.twoDigits(min) +
                        (hour < 12 ? " A.M" : " P.M");
                orderOpening.end = shared.twoDigits(hour_later) + ":" + shared.twoDigits(min_later) +
                        (hour_later < 12 ? " A.M" : " P.M");
                orderOpening.day = date.getFullYear() + "-" + shared.twoDigits(month) + "-" + shared.twoDigits(day);

                var t = $timeout(function() {
                    $scope.hideOpeningModal();
                    $timeout.cancel(t);
                }, 200);
            }
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