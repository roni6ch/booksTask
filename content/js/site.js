/** **********************************ANGULAR*************************************** */

var app = angular.module('booksApp', ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'homeController',
		resolve: {
			books: function(booksService){
				return booksService.getBooks();
			}
		}
	});
});

/*
 * ********************* home Controller ****************
 */

app.controller('homeController' ,function ($scope, $http,books) {
	angular.element("#bs-carousel").carousel('cycle');
	$scope.books = books.data.books;
	//console.log($scope.books);
	$scope.openRemoveModal = function(index){
		$scope.bookName = $scope.books[index]['Title'];
		$scope.bookIndex = index;
		$("#bs-carousel").carousel('pause');
		$("#removeModal").modal();
	}

	$scope.deleteButton = function(bookIndex){
		if (bookIndex !== -1 && bookIndex !== undefined){
			$("#bs-carousel").carousel('cycle');
			$scope.books.splice(bookIndex,1);
			angular.element(".item:first-child").addClass("active");
			console.log($scope.books);
		}
	}
	$scope.edit = function(index){
		$scope.bookIndex = index;
		angular.element(".editableDone").show();
		angular.element(".delBT").hide();
		$("#bs-carousel").carousel('pause');
	}
	$scope.doneEdit = function(){
		var title = angular.element("#book"+$scope.bookIndex).find(".bookTitle").val();
		var autuor = angular.element("#book"+$scope.bookIndex).find(".bookAutuor").val();
		if (title !== "" && title !== undefined && autuor !== "" && autuor !== undefined){
			angular.element(".editableDone").hide();
			angular.element(".delBT").show();
			$("#bs-carousel").carousel('cycle');
		}
	}

});

/*
 * ********************* Factory ****************
 */

app.factory('booksService', function ($http, $q) {
	return {
		getBooks: function() {
			return	$http.get('content/json/booksData.json').then(
					function(response) {
						return response;
					},
					function(data) {
						console.log('problem get the books json file.')
					})
		}
	};
});


/*
 * ********************* Filters  ****************
 */
app.filter('capitalizeWord', function() {
	return function(text) {
		if (text!=null) {
			text = text.replace(/[^a-zA-Z 0-9]+/g,"");
			text = text.toLowerCase();
			var stringArr = text.split(" ");
			var result = "";
			var cap = stringArr.length;
			for(var x = 0; x < cap; x++) {
				var res = stringArr[x].substring(0,1).toUpperCase() + stringArr[x].substring(1);
				if(x === cap - 1) {
					result += res ;
				} else {
					result += res + " ";
				}
			}
			return result;
		}
	}
});