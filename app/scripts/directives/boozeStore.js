
angular.module('SlushFunApp')
  .directive('boozeStore', function($compile) {

    var ratingLabelClass = function(searchResultRating){
      return {'label-success' : searchResultRating > 80,
              'label-warn' : searchResultRating > 60,
              'label-danger' : searchResultRating < 60}
    };

    return {
      scope: {
        searchResult: '='
      },
      restrict: 'A',
      replace: 'true',
      templateUrl: '/views/deliveries.storeSearchResult.html',

    };
  });