angular.module('App', []).controller('CrudCtrl', ['$scope',
	function($scope) {
	  $scope.MyList = [
	      {
	        title : "Futurama",
	        id : 1,
			img:'http://cdn1.nflximg.net/webp/7621/3787621.webp',
	        editable : false
	      },
	      {
	        title : "The Interview",
	        id : 2,
			img:'http://cdn1.nflximg.net/webp/1381/11971381.webp',
	        editable : false
	      },
		  {
	        title : "Gilmore Girls",
	        id : 3,
			img:'http://cdn1.nflximg.net/webp/7451/11317451.webp',
	        editable : false
	      }
	    ];
		
		$scope.Recommendation = [
	      {
	        title : "Family Guy",
	        id : 4,
			img:'http://cdn5.nflximg.net/webp/5815/2515815.webp',
	        editable : false
	      },
	      {
	        title : "The Croods",
	        id : 5,
			img:'http://cdn3.nflximg.net/webp/2353/3862353.webp',
	        editable : false
	      },
		  {
	        title : "Friends",
	        id : 6,
			img:'http://cdn0.nflximg.net/webp/3200/9163200.webp',
	        editable : false
	      }
	    ];
	 
	 $scope.entity = {}
	    
	 $scope.edit = function(index){
	   $scope.entity = $scope.MyList[index];
	   $scope.entity.index = index;
	   $scope.entity.editable = true;
	 }
	    
	 $scope.delete = function(index){		 
	   $scope.MyList.splice(index,1);
	 }
	    
	 $scope.save = function(index){		 
	   $scope.MyList[index].editable = false;
	   
	 }
	 
	 $scope.editRec = function(index){	 
	   $scope.entity = $scope.Recommendation[index];
	   $scope.entity.index = index;
	   $scope.MyList.push($scope.entity);
	   $scope.Recommendation.splice(index,1);
	   
	 }
	    
	 $scope.deleteRec = function(index){		 
	   $scope.Recommendation.splice(index,1);
	 }
	    
	 $scope.saveRec = function(index){
	   $scope.Recommendation[index].editable = false;
	   
	 }
	 
	    
	 $scope.add = function(){
	   $scope.MyList.push({
	      title : "",
		  img : "",
		  id:"",
          editable : true
	   })
	 }
	}
]);
