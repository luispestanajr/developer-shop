define(function () {
    var app = angular.module('developerShop', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

    app.config(['$routeProvider', '$controllerProvider', '$provide', '$locationProvider', function ($routeProvider, $controllerProvider, $provide, $locationProvider) {

        app.register = {
            controller: $controllerProvider.register,
            factory: $provide.factory
        };

        function resolveController(names) {
            return {
                load: ['$q', '$rootScope', function ($q, $rootScope) {
                    var defer = $q.defer();
                    require(names, function () {
                        defer.resolve();
                        $rootScope.$apply();
                    });
                    return defer.promise;
                }]
            }
        }

        $routeProvider
            .when('/', {
                templateUrl: '../pages/home.html',
                controller: 'homeController'
            });

        $locationProvider.html5Mode(true);
    }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['developerShop']);
    });

    app.controller('homeController', ['$scope', '$location', '$rootScope', '$http', 'cartItems', function($scope, $location, $rootScope, $http, cartItems) {
        $scope.currentPage = '/';
        $scope.cartItems = cartItems;

        $scope.checkOut = function(){

        }
    }]);

    app.controller('cartController', function($scope, $location, $rootScope, $http) {
        $scope.cartItems = [];
        $scope.savings = 0;
        $scope.cupomApplied = false;

        $scope.applyCupomCode = function(){
            $scope.cupomApplied = $scope.cupomCode === "SHIPIT";
        }

        $scope.$watch('cupomApplied', function() {

            $scope.savings = $scope.getSavings();
        });

        $scope.getSavings = function(){
            if ($scope.cupomApplied)
            {
                return ($scope.getTotal() * 15) / 100; //15% percent
            }

            return 0;
        }

        $scope.getTotal = function(){

            var total = 0; //init variable

            for(var i = 0; i < $scope.cartItems.length; i++)
            {
                total += $scope.cartItems[i].price * $scope.cartItems[i].hours;
            }

            return Math.round((total - $scope.savings) * 100) / 100; //Round number
        }

        $scope.removeItem = function(itemId)
        {
            for(var i = 0; i < $scope.cartItems.length; i++)
            {
                if($scope.cartItems[i].id === itemId){

                    $scope.cartItems.splice(i, 1);
                }
            }
        }

        $scope.$on("addToCart", function (event, args) {

            for(var i = 0; i < $scope.cartItems.length; i++)
            {
                if($scope.cartItems[i].id === args.member.id){

                    return false; //if item exists, return and do nothing
                }
            }

            $scope.cartItems.push(args.member);
        });
    });

    app.controller('memberListController', function($scope, $location, $rootScope, $http, $q) {
        $scope.currentPage = 0
        ,$scope.filteredTodos = []
        ,$scope.memberList = []
        ,$scope.numPerPage = 4
        ,$scope.totalItems = 0;

        $scope.getMemberList = function() {

            $http.get('https://api.github.com/orgs/vtex/members?client_id=008eef314871fa1f74e8&client_secret=5eda828c3edea0324a840da4fbf7eb15a2f93806')
                .success(function(res){

                    var promises = [];

                    $scope.totalItems = res.length;

                    angular.forEach(res, function(member) {


                        //getAllInvoices returns a promise...
                        promises.push(
                            $scope.getMemberDetails(member.login).success(function(data){

                                var memberPrice = $scope.calcMemberPrice(data.followers, data.public_repos);
                                $scope.memberList.push({"id": data.id
                                    ,"login": data.login
                                    ,"name": data.name
                                    ,"company": data.company
                                    ,"blog": data.blog
                                    ,"location": data.location
                                    ,"email": data.email
                                    ,"avatar_url": data.avatar_url
                                    ,"price": memberPrice
                                    ,"hours": 1});
                            })
                        );
                    })

                    $q.all(promises).then(function(){
                        $scope.currentPage = 1;
                    });
            });
        };

        $scope.addToCart = function(memberId){

            for(var i = 0; i < $scope.memberList.length; i++)
            {
                if($scope.memberList[i].id === memberId)
                {
                    $scope.$broadcast("addToCart", {member: $scope.memberList[i] });
                }
            }
        }

        $scope.calcMemberPrice = function(numFollowers, numRepos){
            var priceFollowers = numFollowers * 0.10;
            var priceRepos = numRepos * 1.50;

            return Math.round((priceFollowers + priceRepos) * 100) / 100;
        }

        $scope.getMemberDetails = function(login){

            return $http.get(`https://api.github.com/users/${login}?client_id=008eef314871fa1f74e8&client_secret=5eda828c3edea0324a840da4fbf7eb15a2f93806`);
        }

        $scope.getMemberList();

        $scope.pageChanged = function() {
        };

        $scope.$watch('currentPage', function() {

            if($scope.currentPage > 0) {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                $scope.filteredTodos = $scope.memberList.slice(begin, end);
            }
        });
    });

    app.directive('memberList', function($compile) {
        return {
            restrict: 'E', //element only
            templateUrl: '../../controllers/memberList.html',
            //replace: true,
            //require: '?ngModel',
            controller: 'memberListController'
        };
    });

    app.directive('userCart', function($compile) {
        return {
            restrict: 'E', //element only
            templateUrl: '../../controllers/cart.html',
            //replace: true,
            //require: '?ngModel',
            controller: 'cartController'
        };
    });

    app.service('cartItems', function () {
        var cartItems = [];

        return {
            getCartItems: function () {
                return cartItems;
            },
            setCartItems: function (items) {
                cartItems = items;
            }
        };
    });

    return app;
});
