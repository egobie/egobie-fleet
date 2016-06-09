angular.module('app.sign.in', ['ionic', 'util.shared', 'util.url'])

    .controller('signInCtrl', function($scope, $state, $http, shared, url) {
        $scope.signInForm = {
            username: "",
            password: ""
        };

        $scope.signIn = function() {
            var body = {
                username: $scope.signInForm.username,
                password: $scope.signInForm.password
            };

            if (!validateUser(body.username, body.password)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.signIn, body)
                .success(function(data, status, headers, config) {
                    shared.refreshUser(data);

                    if (shared.isResidential()) {
                        $state.go('menu.home.resident');
                    } else {
                        $state.go('menu.task');
                    }
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        function validateUser(username, password) {
            if (!username) {
                shared.alert("Username should not be empty");
                return false;
            }

            if (!password) {
                shared.alert("Password should not be empty");
                return false;
            }

            return true;
        }
    });
