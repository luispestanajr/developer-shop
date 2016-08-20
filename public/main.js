require.config({
    baseUrl: ".",

    paths: {
        'angular'           : 'assets/js/angular1.4.12.min',
        'angular-route'     : 'assets/js/angular-route.1.2.25.min',
        'angular-animate'   : 'assets/js/angular-animate.1.5.8.min',
        'jquery'            : 'assets/js/jquery-3.1.0.min',
        'bootstrap'         : 'assets/js/bootstrap.min',
        'inputMask'         : 'assets/js/inputmask',
        'ui.bootstrap'      : 'assets/js/angular-ui-bootstrap/dist/ui-bootstrap-tpls',
        'app'               : 'assets/js/app',
        'ngTouch'           : 'assets/js/angular-touch'
    },

    shim: {
        'app'               : ['angular-route', 'angular-animate', 'bootstrap', 'ui.bootstrap'],
        'angular-route'     : ['angular'],
        'angular-animate'   : ['angular'],
        'ui.bootstrap'      : ['angular', 'angular-animate', 'ngTouch'],
        'ngTouch'           : ['angular'],
        'bootstrap'         : ['jquery'],
        'angular'           : ['jquery']
    },

    deps: ['app']
});