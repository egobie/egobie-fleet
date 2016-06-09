angular.module('util.url', [])

    .factory('url', function() {
//        var host = "http://localhost:8000";
        var host = "http://egobie-app-lb-1883256124.us-east-1.elb.amazonaws.com";

        return {
            website: "http://www.egobie.com/",
            faq: "http://www.egobie.com/#!faq/aifir",

            checkEmail: host + "/check/email",
            checkUsername: host + "/check/name",

            signIn: host + "/signin",
            signUp: host + "/signup",

            carMaker: host + "/car/maker",
            carModel: host + "/car/model",
            cars: host + "/car/user",
            newCar: host + "/car/new",
            editCar: host + "/car/update",
            deleteCar: host + "/car/delete",

            payments: host + "/payment/user",
            newPayment: host + "/payment/new",
            editPayment: host + "/payment/update",
            deletePayment: host + "/payment/delete",
            pay: host + "/payment/pay",

            updateUser: host + "/user/update/user",
            updateHome: host + "/user/update/home",
            updateWork: host + "/user/update/work",
            updatePassword: host + "/user/update/password",
            feedback: host + "/user/feedback",

            services: host + "/service",
            userReservations: host + "/service/reservation",

            openings: host + "/service/opening",
            ondemand: host + "/service/now",
            addService: host + "/service/add",
            placeOrder: host + "/service/order",
            cancelOrder: host + "/service/cancel",
            forceCancelOrder: host + "/service/cancel/force",
            demandService: host + "/service/demand",
            readService: host + "/service/read/",
            demandAddon: host + "/service/demand/addon",
            demandOpening: host + "/service/demand/opening/",

            userHistories: host + "/history",
            ratingHistory: host + "/history/rating",

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
