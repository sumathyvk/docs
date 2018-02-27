var cartSummaryApp = angular.module('cartSummaryApp', []);

cartSummaryApp.controller('CartController', function CartController($scope,$http) {
	$scope.invoice = {
    
    "customer": {
        "first_name": "John",
        "last_name": "Doe"
    },
    
     "items": [
        {
            "id": 17437,
            "name": "Old Mother Hubbard Classic Crunchy Natural Dog Treats",
            "thumbnail": "images/17437.jpg",
            "unit_price": 8.26,
            "quantity": 5
        },
        {
            "id": 75639,
            "name": "Accoutrements Horse Head Mask",
            "thumbnail": "images/75639.jpg",
            "unit_price": 29.95,
            "quantity": 2
        },
        {
            "id": 58364,
            "name": "How To Avoid Huge Ships (Paperback)",
            "thumbnail": "images/58364.gif",
            "unit_price": 91.99,
            "quantity": 1
        },
        {
            "id": 64528,
            "name": "Hutzler 571 Banana Slicer",
            "thumbnail": "images/64528.jpg",
            "unit_price": 5.89,
            "quantity": 7
        }
    ],
    
     "sales_tax": 8.5
    
    
    
};
// populate order detail
	var formData = {
		first_name:"<customer first name>",
		last_name:"<customer last name>",
        id: "<item id>",
        name: "<item name>",
        unit_price: "<item price>",
        quantity: "<item quantity>",
		grand_total:"<grand total>"
    };
	
    
	// remove item
    $scope.removeItem = function(index) {
        $scope.invoice.items.splice(index, 1);
    },
    //total
    $scope.total = function() {
        var total = 0;
        angular.forEach($scope.invoice.items, function(item) {
            total += item.unit_price * item.quantity;
        })

        return total;
    }
    // grand total
    $scope.grandtotal = function() {
        var total = 0;
        var grandTotal= 0;
       total = $scope.total()
			  grandTotal = total+ $scope.invoice.sales_tax;
        return grandTotal;
    }
	//form submission
	$scope.submitForm = function() {
        console.log("posting data....");
        formData = $scope.form;
        console.log(formData);
        $http.post('form.php', JSON.stringify(formData)).success(function(data, status, headers, config) {
			// successful response.
			console.log(data);
      }).
      error(function(data, status, headers, config) {
			//server returns response with an error status.
			console.log(error);
      });
    };
    
});
