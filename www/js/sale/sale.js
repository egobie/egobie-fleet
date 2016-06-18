angular.module('app.sale', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.sale', {
                url: '/sale',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/sale/sale.html'
                    }
                }
            });
    })

    .controller('saleCtrl', function($scope, $http, $ionicModal, $ionicActionSheet, $ionicPopup, shared, url) {
        $scope.states = shared.getStates();
        $scope.users = [];
        $scope.total = 0;
        $scope.page = 0;
        $scope.user = {
            fleet_name: "",
            first_name: "",
            last_name: "",
            middle_name: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            zip: ""
        };

        $scope.$watch(function() {
            return shared.getSaleUsers().users;
        }, function(newValue) {
            var _users = shared.getSaleUsers();
            $scope.users = _users.users;
            $scope.total = _users.total;
        });

        $ionicModal.fromTemplateUrl('templates/sale/new.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.userModel = modal;
        });

        $scope.showAddUser = function() {
            $scope.userModel.show();
        };

        $scope.hideAddUser = function() {
            $scope.userModel.hide();
            $scope.clearUser();
        };

        $scope.showUserActionSheet = function(user) {
            if (user.fleet_setup !== 0) {
                return;
            }

            $scope.hideUserActionSheet = $ionicActionSheet.show({
                titleText: "Re-send Invitation Email",
                destructiveText: "Send Email",
                destructiveButtonClicked: function() {
                    shared.showLoading();
                        $http
                            .post(url.resendEmail, shared.getRequestBody({
                                fleet_user_id: user.user_id
                            }))
                            .success(function(data, status, headers, config) {
                                shared.hideLoading();
                                $scope.hideUserActionSheet();
                            })
                            .error(function(data, status, headers, config) {
                                $scope.hideUserActionSheet();
                                shared.hideLoading();
                                shared.alert(data);
                            });
                },
                cancelText: 'Close',
                cancel: function() {

                }
            }); 
        };

        $scope.showStatusSheet = function(task) {
            if (task.status === "RESERVED") {
                $scope.hideStatusSheet = $ionicActionSheet.show({
                    titleText: 'Start Task (CANNOT MAKE THIS TASK "RESERVED" AGAIN)',
                    destructiveText: "Start",
                    destructiveButtonClicked: function() {
                        $ionicPopup.confirm({
                            title: "Start this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.startTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();

                                        $scope.hideStatusSheet();
                                        $scope.loadTasks();
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideStatusSheet();
                                        shared.hideLoading();
                                        shared.alert(data);
                                    });
                            }
                        });
                    },
                    cancelText: 'Close',
                    cancel: function() {

                    }
                });
            } else if (task.status === "IN_PROGRESS") {
                $scope.hideStatusSheet = $ionicActionSheet.show({
                    titleText: 'Finish Task CANNOT MAKE THIS TASK "RESERVED" OR "IN_PROGRESS" AGAIN',
                    destructiveText: "DONE",
                    destructiveButtonClicked: function() {
                        $ionicPopup.confirm({
                            title: "Finish this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.finishTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();
                                        $scope.hideStatusSheet();
                                        $scope.loadTasks();
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideStatusSheet();
                                        shared.hideLoading();
                                        shared.alert(data);
                                    });
                            }
                        });

                        return false;
                    },
                    cancelText: 'Close',
                    cancel: function() {

                    }
                });
            }
        };

        $scope.loadUsers = function(animation) {
            shared.loadSaleUsers(animation, 0);
        };

        $scope.addUser = function() {
            if (!$scope.validateNewUser()) {
                return;
            }

            $http
                .post(url.newFleetUser, shared.getRequestBody($scope.user))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.hideAddUser();
                    $scope.loadUsers(true);
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.userBorderStyle = function(setup) {
            if (setup === 0) {
                return {
                    'egobie-user-not-active-border': true
                };
            } else if (setup === 1) {
                return {
                    'egobie-user-active-border': true
                };
            }
        };

        $scope.userColorStyle = function(setup) {
            if (setup === 0) {
                return {
                    'egobie-user-not-active': true
                };
            } else if (setup === 1) {
                return {
                    'egobie-user-active': true
                };
            }
        };

        $scope.getUserStatus = function(setup) {
            if (setup === 0) {
                return "NOT ACTIVATE";
            } else {
                return "ACTIVATED";
            }
        };

        $scope.noUser = function() {
            return !$scope.users || $scope.users.length === 0;
        };

        $scope.validateNewUser = function() {
            if (!$scope.user.fleet_name) {
                shared.alert("Please input business name");
                return false;
            }

            if (!$scope.user.street) {
                shared.alert("Please input street address");
                return false;
            }

            if (!$scope.user.city) {
                shared.alert("Please input city");
                return false;
            }

            if (!$scope.user.state) {
                shared.alert("Please choose state");
                return false;
            }

            if (!$scope.user.zip) {
                shared.alert("Please input zipcode");
                return false;
            }

            if (!$scope.user.first_name) {
                shared.alert("Please input contact's first name");
                return false;
            }

            if (!$scope.user.last_name) {
                shared.alert("Please input contact's last name");
                return false;
            }

            if (!shared.testEmail($scope.user.email)) {
                shared.alert("Invalid Email Address!");
                return false;
            }

            if (!shared.testPhone($scope.user.phone)) {
                shared.alert("Invalid phone number");
                return false;
            }

            return true;
        };

        $scope.clearUser = function() {
            $scope.user.fleet_name = "";
            $scope.user.fleet_name = "";
            $scope.user.first_name = "";
            $scope.user.last_name = "";
            $scope.user.middle_name = "";
            $scope.user.email = "";
            $scope.user.phone = "";
            $scope.user.street = "";
            $scope.user.city = "";
            $scope.user.state = "";
            $scope.user.zip = "";
        };

        $scope.loadUsers(false);
    });