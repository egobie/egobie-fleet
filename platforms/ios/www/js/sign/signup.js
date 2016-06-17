angular.module('app.sign.up', ['ionic', 'util.shared', 'util.url'])

    .controller('signUpCtrl', function(shared, url, $scope, $state, $http) {
        $scope.signUpForm = {
            username: "",
            password1: "",
            password2: "",
            email: "",
            token: ""
        };

        $scope.nameInUse = false;

        $scope.displayNameInUse = function() {
            return {
                "egobie-display-none": !$scope.nameInUse
            };
        };

        $scope.inputNameInUse = function() {
            return {
                "egobie-in-use": $scope.nameInUse
            };
        };

        $scope.signUp = function() {
            if ($scope.nameInUse) {
                shared.alert("Username is in use");
                return;
            }

            var body = {
                "username": $scope.signUpForm.username,
                "password": $scope.signUpForm.password1,
                "email": $scope.signUpForm.email,
                "token": $scope.signUpForm.token
            };

            if (!validateUser(body.username, body.password, $scope.signUpForm.password2, body.email, body.token)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.signUp, body, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .success(function(data, status, headers, config) {
                    shared.refreshUser(data);
                    $state.go('tutorial');
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.checkUsername = function() {
            if ($scope.signUpForm.username &&
                    $scope.signUpForm.username.length >= 6 && $scope.signUpForm.username.length <= 12) {
                $http
                    .post(url.checkUsername, {
                        "value": $scope.signUpForm.username
                    })
                    .success(function(data, status, headers, config) {
                        $scope.nameInUse = (status !== 200);
                    })
                    .error(function(data, status, headers, config) {
                        shared.alert(data);
                        $scope.nameInUse = false;
                    });
            } else {
                $scope.nameInUse = false;
            }
        };

        function validateUser(username, password1, password2, email, token) {
            if (!username || username.length < 6) {
                shared.alert("Username must be at least 6 characters!");
                return false;
            }

            if (!username || username.length > 12) {
                shared.alert("Username must be at most 12 characters!");
                return false;
            }

            if (!password1 || password1.length < 8) {
                shared.alert("Password must be at least 8 characters!");
                return false;
            }

            if (!password1 || password1.length > 16) {
                shared.alert("Password must be at most 16 characters!");
                return false;
            }

            if (!password1 || !password2 || password1 !== password2) {
                shared.alert("Password is not equal!");
                return false;
            }

            if (!email || !shared.testEmail(email)) {
                shared.alert("Invalid Email Address!");
                return false;
            }

            if (!token || !shared.testFleetToken(token)) {
                shared.alert("Invalid Token!");
                return false;
            }

            return true;
        }
    });
