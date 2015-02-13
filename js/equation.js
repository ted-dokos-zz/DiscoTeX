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
      templateUrl: 'templates/eqnElement.html',
      link: function(scope, elem, attrs, controller, transcludeFn) {
        transcludeFn(scope,function(clone){
          scope.body = clone.text().trim();
          var label = elem.attr("label");
          scope.useLabel = !(label === "");
          var tag = elem.attr("tag");
          scope.useTag = !(tag === "");
          if (scope.useLabel) {
            equationDatabase.addEqn(label,tag,scope.body);
          }
        });
      },
    };
  }]);
})();