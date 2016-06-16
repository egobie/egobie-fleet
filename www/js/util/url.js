angular.module('util.url', [])

    .factory('url', function() {
        var host = "http://localhost:8000";
//        var host = "http://egobie-app-lb-1883256124.us-east-1.elb.amazonaws.com";

        return {
            website: "http://www.egobie.com/",
            faq: "http://www.egobie.com/#!faq/aifir",

            newFleetUser: host + "/sale/fleet/new",
            allFleetUser: host + "/sale/fleet/all",
            checkUsername: host + "/check/name",

            signIn: host + "/signin",
            signUp: host + "/signup/fleet",

            updateUser: host + "/user/update/user",
            updateWork: host + "/user/update/work",
            updatePassword: host + "/user/update/password",
            feedback: host + "/user/feedback",

            services: host + "/fleet/service",
            addons: host + "/fleet/addon",
            fleetReservations: host + "/fleet/reservation",
            reservationDetail: host + "/fleet/reservation/detail",

            openings: host + "/fleet/opening",
            ondemand: host + "/fleet/now",
            addService: host + "/service/add",
            placeOrder: host + "/fleet/order",
            cancelOrder: host + "/fleet/cancel",
            forceCancelOrder: host + "/fleet/cancel/force",

            demandService: host + "/fleet/demand",
            readService: host + "/fleet/read/",
            demandAddon: host + "/fleet/demand/addon",
            demandOpening: host + "/fleet/demand/opening/",

            fleetHistories: host + "/fleet/history",
            ratingHistory: host + "/fleet/history/rating",

            tasks: host + "/egobie/service/task",
            startTask: host + "/egobie/service/progress",
            finishTask: host + "/egobie/service/done",

            goHome: host + "/action/go/home",
            goNotification: host + "/action/go/notification",
            goService: host + "/action/go/service",
            goHistory: host + "/action/go/history",
            goCoupon: host + "/action/go/coupon",
            goCar: host + "/action/go/car",
            goPayment: host + "/action/go/payment",
            goSetting: host + "/action/go/setting",
            goAbout: host + "/action/go/about",
            goReservation: host + "/action/go/reservation",
            goOndemand: host + "/action/go/ondemand",

            openRating: host + "/action/open/rating",
            openFeedback: host + "/action/open/feedback",
            openService: host + "/action/open/service",
            openExtra: host + "/action/open/extra",
            openDate: host + "/action/open/date",
            openCar: host + "/action/open/car",
            openPayment: host + "/action/open/payment",

            readHistory: host + "/action/read/history",

            clickOpening: host + "/action/click/opening",
            reloadOpening: host + "/action/reload/opening",

            unselectService: host + "/action/unselect/service",
            unselectExtra: host + "/action/unselect/extra"
        };
    });
