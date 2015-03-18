(function(){
  var app = angular.module('mathDocument',
                           ['ui.bootstrap',
                            'bibliography-directives',
                            'equation-directive',
                            'proof-directive',
                            'reference-directive',
                            'section-directive',
                            'sidebar-directive',
                            'theorem-directive',
                           ]);
  // collapsible element
  app.controller(
    'CollapseCtrl', function ($scope) {
      $scope.isCollapsed = true;
    });

  app.controller("DocumentController", function($scope,$http){
    /*$scope.equations = {};
    $http.get('eqnList.json').then(function(response) {
      $scope.equations = response.data;
    });*/
  });
})();

/*(function(){
    var app = angular.module('mathDocument',
                             ['ui.bootstrap',
                                 'bibliography-directives',
                                 'equation-directive',
                                 'proof-directive',
                                 'reference-directive',
                                 'section-directive',
                                 'sidebar-directive',
                                 'theorem-directive',
    ]);
    // collapsible element
    app.controller(
        'CollapseCtrl', function ($scope) {
            $scope.isCollapsed = true;
        });

        app.controller("DocumentController", ['$scope', '$http', '$sce', function($scope, $http, $sce){
            $http({
                url: "demo.tex",
                method: "POST",
            }).success(function(data, status, headers, config){
                $scope.documentBody = DiscoTeX.parseString(data);
                MathJax.Hub.Configured();
            }).error(function(data, status, headers, config){
            });

            //   $scope.equations = {};
            //     $http.get('eqnList.json').then(function(response) {
            //     $scope.equations = response.data;
            //     });
        }]);

        app.directive('compile', ['$compile', function ($compile) {
            return function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    },
                    function(value) {
                        // when the 'compile' expression changes
                        // assign it into the current DOM
                        element.html(value);

                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(element.contents())(scope);
                    }
                );
            };
        }]);

})();
*/
(function(){
  var app = angular.module('bibliography-directives',[]);

  // service for recording the bibitem contents,
  // used by the citation elements
  app.factory('bibItemDatabase', function($http){
    var bibPromise = null;
    return function(){
      // check if already requested
      if (bibPromise) {
        return bibPromise;
      } else {
        bibPromise = $http.get('json/bibItems.json');
        return bibPromise;
      }
    };
  });

  app.controller('BibliographyCtrl',
      ['$scope','bibItemDatabase',
       function($scope,bibItemDatabase){
         $scope.bd = {};
         bibItemDatabase().then(function(response){
           $scope.bd = response.data;
           console.log($scope.bd);
         });
       }]);

  app.directive('dtBibliography', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'templates/bibliographyElement.html',
    };
  });

  app.directive('dtBibitem', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
      },
      template: '<li id="{{ label }}"><dt-bibitemhelper label="{{ label }}" bd="bd" ng-controller="BibliographyCtrl"></dt-bibitemhelper></li>',
    };
  });

  app.directive('dtBibitemhelper', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
        bd: '=',
      },
      templateUrl: 'templates/bibItemElement.html',
      //link: function(scope,elem,attr){},
    };
  });

  app.directive('dtCite', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
      },
      template: '<dt-cite-helper label="{{label}}" bd="bd" ng-controller="BibliographyCtrl"></dt-cite-helper>',
    };
  });

  app.directive('dtCiteHelper', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
        bd: '=',
      },
      templateUrl: 'templates/citeElement.html',
      link: function(scope,elem,attr){
        scope.active = false;
        scope.show = function(){ scope.active = true; };
        scope.hide = function(){ scope.active = false;};
      },
    };
  });

})();

(function(){
  var app = angular.module('equation-directive',[]);

  // service for recording equations,
  // used by the reference elements
  app.factory('equationDatabase', function(){
    var service = {
      equationDict: {},
      addEqn: function(label,eqnTag,eqnBody){
        service.equationDict[label] = {body: eqnBody, tag: eqnTag};
      }
    };
    return service;
  });

  app.directive('dtEquation', ['equationDatabase', function(equationDatabase){
    return {
      restrict: 'E',
      scope: {
        label: '@',
        tag: '@',
      },
      transclude: true,
      //templateUrl: 'templates/eqnElement.html',
      link: function(scope, elem, attrs, controller, transcludeFn) {
        transcludeFn(scope,function(clone){
          scope.body = clone.text().trim();
          var content = '';
          if (attrs.hasOwnProperty('label')) {
            equationDatabase.addEqn(scope.label,
                                    scope.tag,
                                    scope.body);
            content += '\\label{'+scope.label+'}\n';
          }
          content += scope.body+'\n';
          if (attrs.hasOwnProperty('tag')) {
            content += '\\tag{\\('+scope.tag+'\\)}';
          }
          elem.html('<script type="math/tex; mode=display">'+
                    content+
                    '</script>');
        });
      },
    };
  }]);
})();

(function(){
  var app = angular.module('proof-directive',['ui.bootstrap.accordion']);

  app.config(['$provide', Decorate]);

  function Decorate($provide){
    $provide.decorator('accordionGroupDirective', function($delegate){
      var directive = $delegate[0];
      directive.templateUrl = 'templates/proofAccordionOverride.html';

      return $delegate;
    });
  }

  app.directive('dtProof', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: function(elem, attrs){
        var type = 'Static';
        if (attrs.hasOwnProperty('collapsible')) { type = 'Collapse'};
        return 'templates/proof' + type + '.html';
      },
      scope: {},
      link: function(scope,elem,attrs){
        scope.collapsible = attrs.hasOwnProperty('collapsible');
        if (scope.collapsible) {
          scope.startCollapsed = attrs.hasOwnProperty('startCollapsed');
          scope.isOpen=!scope.startCollapsed;
        }
        scope.useName = false;
        if (attrs.hasOwnProperty('name')) {
          scope.useName = true;
          scope.name = attrs['name'];
        }
      },
    };
  });
})();

(function(){
  var app = angular.module('reference-directive', ['equation-directive']);

  app.controller('RefCtrl',
                 ['$scope', 'equationDatabase',
                  function($scope,equationDatabase){
                    $scope.equations = equationDatabase.equationDict;
                  }]);

  app.directive('dtReference', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
      },
      template: ('<dt-reference-helper equations="equations" label="{{label}}">'
                 + '</dt-reference-helper>'),
    }
  });

  app.directive('dtEqref', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
      },
      template: ('<dt-reference-helper equations="equations" label="{{label}}">'
                 + '</dt-reference-helper>'),
    }
  });

  // This helper exists solely so that users don't have to put
  // 'equations="equations"' on every reference tag they write.
  app.directive('dtReferenceHelper', function(){
    return {
      restrict: 'E',
      scope: {
        label: '@',
        equations: '=',
      },
      templateUrl: 'templates/refElement.html',
      controller: 'RefCtrl',
      link: function(scope, elem, attrs, controller){
        scope.$watch('equations', function(){
          scope.tag = scope.equations[scope.label].tag;
          scope.body = scope.equations[scope.label].body;
        });
      },
    }
  });
})();

(function(){
  var app = angular.module('section-directive',[]);

  app.directive('dtSection', function(){
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        number: '=',
        sectionTitle: '@',
      },
      templateUrl: 'templates/sectionElement.html',
    };
  });

})();

(function(){
  var app = angular.module('sidebar-directive',[]);

  app.directive('dtSidebar', function(){
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'templates/sidebarElement.html',
      link: function(scope,element,attrs){
        /* Extract the number-title pairs.
           The for loop is unfortunately mildly necessary,
           HTMLcollections do not allow you to map over them easily.
        */
        var numberTitles = function(sections){
          ntArray = [];
          for (var i=0; i<sections.length; i++) {
            ntArray.push({number: sections[i].getAttribute('number'),
                          title: sections[i].getAttribute('section-title')});
          }
          return ntArray;
        }
        scope.sections = numberTitles(document.getElementsByTagName('dt-section'));
      },
    }
  });
})();

(function(){
  var app = angular.module('theorem-directive',[]);

  // still a bad solution but good enough for now
  app.factory('theoremTypes',function(){
    var types = {
      "theorem": "Theorem",
      "definition": "Definition",
      "corollary": "Corollary",
      "lemma": "Lemma",
    };
    return types;
  });

  app.directive('dtTheoremlike', ['theoremTypes', function(theoremTypes){
    return {
      restrict: 'E',
      scope: {
        number: '=',
        name: '@',
        type: '@class',
      },
      transclude: true,
      templateUrl: 'templates/thmElement.html',
      link: function(scope){
        scope.typeDict = theoremTypes;
      },
    };
  }]);
})();
