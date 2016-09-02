define(function () {
    //Criação do módulo no Angular
    var app = angular.module('developerShop', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

    //Configurar nossa aplicação no angular, definindo rotas e etc
    app.config(['$routeProvider', '$controllerProvider', '$provide', '$locationProvider', function ($routeProvider, $controllerProvider, $provide, $locationProvider) {

        app.register = {
            controller: $controllerProvider.register,
            factory: $provide.factory
        };

        $routeProvider
            .when('/', {
                templateUrl: '../pages/home.html',
                controller: 'homeController'
            })
            .when('/confirmation', {
                templateUrl: '../pages/confirmation.html',
                controller: 'confirmationController'
            });

        $locationProvider.html5Mode(true);
    }]);

    //Realizando o bootstrap (não do twitter) da nossa aplicação
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['developerShop']);
    });

    //Controller da tela inicial
    app.controller('homeController', ['$scope', '$location', '$rootScope', '$http', 'cartItems', function($scope, $location, $rootScope, $http, cartItems) {
        $scope.currentPage = '/';
        $scope.cartItems = cartItems;

        //Método responsável por finalizar o pedido e levar o usuário para a tela de feedback de criação do pedido
        $scope.checkOut = function(){

            var objPedido = {"dataCriacao": new Date(), "codigoCupom": $scope.cupomCode, "produtosPedido": []};

            angular.forEach($scope.cartItems, function(value, key) {

                objPedido.produtosPedido.push({"idDesenvolvedor": value.id, "qtdHoras": value.hours, "valPreco": value.price});
            });

            $http.post('/pedido', JSON.stringify(objPedido))
                .then(function(res){

                    $location.path("/confirmation");
                });
        }
    }]);

    app.controller('confirmationController', function($scope, $location, $rootScope, $http) {
    });

    //Controller de Carrinho de Compras
    app.controller('cartController', function($scope, $location, $rootScope, $http) {
        $scope.cartItems = [];
        $scope.savings = 0;
        $scope.cupomApplied = false;

        //Método responsável por aplicar o cupom de desconto
        $scope.applyCupomCode = function(){
            $scope.cupomApplied = $scope.cupomCode === "SHIPIT"; //TODO: HardCode para validar se o cupom foi digitado corretamente
        }

        //Observar se o cupom foi aplicado ou não
        $scope.$watch('cupomApplied', function() {

            $scope.savings = $scope.getSavings();
        });

        //Método responsável por buscar nossa economia no carrinho de compras
        $scope.getSavings = function(){
            if ($scope.cupomApplied)
                return ($scope.getTotal() * 15) / 100; //TODO: HardCode 15%,
                                                        // TODO: o ideal seria vir de uma tabela da base de dados
                                                        // TODO: porém, neste momento não vamos adicionar esta funcionalidade
                                                        // TODO: para que o projeto consiga ser utilizado sem instalar o MongoDB

            return 0;
        }

        //Método responsável por retornar o valor total do carrinho de compras
        $scope.getTotal = function(){

            var total = 0;

            for(var i = 0; i < $scope.cartItems.length; i++)
            {
                total += $scope.cartItems[i].price * $scope.cartItems[i].hours;
            }

            return Math.round((total - $scope.savings) * 100) / 100; //Arredondando o valor com 2 casas decimais
        }

        //Método responsável por remover um item do carrinho de compras
        $scope.removeItem = function(itemId)
        {
            for(var i = 0; i < $scope.cartItems.length; i++)
            {
                if($scope.cartItems[i].id === itemId){

                    $scope.cartItems.splice(i, 1);
                }
            }
        }

        //Watch para o método de adicionar carrinho,
        $scope.$on("addToCart", function (event, args) {

            for(var i = 0; i < $scope.cartItems.length; i++)
            {
                if($scope.cartItems[i].id === args.member.id){

                    return false; //Se o item já existir, não continuamos percorrendo o loop
                }
            }

            $scope.cartItems.push(args.member); //Adicionar o item no carrinho
        });
    });

    //Controller para a listagem de membros com integração no GitHub
    app.controller('memberListController', function($scope, $location, $rootScope, $http, $q) {
        $scope.currentPage = 0
        ,$scope.filteredTodos = []
        ,$scope.memberList = []
        ,$scope.numPerPage = 4
        ,$scope.totalItems = 0;

        //Método responsável por buscar os membros no github
        $scope.getMemberList = function() {

            $http.get('https://api.github.com/orgs/vtex/members?client_id=008eef314871fa1f74e8&client_secret=5eda828c3edea0324a840da4fbf7eb15a2f93806')
                .success(function(res){

                    var promises = [];

                    $scope.totalItems = res.length;

                    angular.forEach(res, function(member) {

                        //Criar promises que serão executadas com o $q
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

                    //Aguardar a finalização de todas as promises
                    $q.all(promises).then(function(){
                        $scope.currentPage = 1;//Itens carregados, exibir a página 1 da lista de membros
                    });
            });
        };

        //Método responsável por adicionar o membro ao carrinho
        $scope.addToCart = function(memberId){

            for(var i = 0; i < $scope.memberList.length; i++)
            {
                if($scope.memberList[i].id === memberId)
                    $scope.$broadcast("addToCart", {member: $scope.memberList[i] }); //Efetua a adição do item via broadcast
            }
        }

        //Método responsável por calcular o valor da hora do membro
        $scope.calcMemberPrice = function(numFollowers, numRepos){

            var priceFollowers = numFollowers * 0.10;
            var priceRepos = numRepos * 1.50;

            return Math.round((priceFollowers + priceRepos) * 100) / 100;
        }

        //Método responsável por buscar os detalhes do membro
        $scope.getMemberDetails = function(login){

            //usamos a técnica de string interpolation para facilitar a concatenação da variável
            return $http.get(`https://api.github.com/users/${login}?client_id=008eef314871fa1f74e8&client_secret=5eda828c3edea0324a840da4fbf7eb15a2f93806`);
        }

        //Chamando o método de preenchimento da lista de membros
        $scope.getMemberList();

        $scope.pageChanged = function() {};

        //Observando pela mudança de página
        $scope.$watch('currentPage', function() {

            //Evitar que o código seja chamado quando não há necessidade, pois na página 0 (default), não queremos fazer nada
            if($scope.currentPage > 0) {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                $scope.filteredTodos = $scope.memberList.slice(begin, end);
            }
        });
    });

    //Diretiva de lista de membros
    app.directive('memberList', function($compile) {
        return {
            restrict: 'E', //element only
            templateUrl: '../../controllers/memberList.html',
            //replace: true,
            //require: '?ngModel',
            controller: 'memberListController'
        };
    });

    //Diretiva de carrinho
    app.directive('userCart', function($compile) {
        return {
            restrict: 'E', //element only
            templateUrl: '../../controllers/cart.html',
            //replace: true,
            //require: '?ngModel',
            controller: 'cartController'
        };
    });

    //Serviço de items do carrinho
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

    //Retorna o aplicativo para o RequireJS
    return app;
});
