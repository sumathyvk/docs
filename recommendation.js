window.onload = function () {
  var app = new Vue({
    el: '#recommender-body',
    data: {
      title: 'Recommendations for you',
      showRecommendations: false,
      userId: '',
      uniqueId: 0,
      results: [
        {
          "Category": null,
          "CategoryId": 0,
          "ProductList": [
            {
              "Id": "",
              "SkuCode": "",
              "ProductId": "",
              "CourseGuid": "",
              "Title": "",
              "Description": "",
              "ProductUrl": "",
              "RelativeProductUrl":"",
              "ImageUrl": "",
              "LaunchCourseUrl": null,
              "SyllabusUrl": "",
              "FOS": "",
              "ProductType": "",
              "ProductFamily": "",
              "Credits": ""
            }
          ]
        }],
        subscriptions:
            [
              {
              "SubscriptionName": null,
              "Description": null,
              "ProductUrl": null,
              "ProductImageUrl": null,
              "ProductType":null,
              "ViewCoursesText": null,
              "RecommendationCategoryText":null,
              "SkuCode":null,
"UserSubscriptionStatus":false,
              "Recommendations": [
                {
                  "Category": null,
                  "CategoryId": 0,
                  "ProductList": [
                    {
                      "Id": "",
                      "SkuCode": "",
                      "ProductId": "",
                      "CourseGuid": "",
                      "Title": "",
                      "Description": "",
                      "ProductUrl": "",
                      "RelativeProductUrl":"",
                      "ImageUrl": "",
                      "LaunchCourseUrl": null,
                      "SyllabusUrl": "",
                      "FOS": "",
                      "ProductType": "",
                      "ProductFamily": "",
                      "Credits": ""
                    }
                  ]
                
                }]
              }
            ],
      jurisdictions: [],
      jurisdictionsLoaded: false,
      recommendationsLoaded: false,
      recommendationsLoadFailed: false,
      jurisdictionsLoadFailed: false
    },
    computed:{
    	
    },
    mounted:function(){    	
      // Code that will run only after the
      // entire view has been rendered
      // TODO: Load the user id and user unique id
      this.userId = recommender_settings.userId;
      this.uniqueId = recommender_settings.userUniqueId;
      recommender_settings.getRecommendationsUrl = recommender_settings.baseUrl + recommender_settings.getRecommendationsUrl;
      recommender_settings.getJurisdictionUrl = recommender_settings.baseUrl + recommender_settings.getJurisdictionUrl;
          
      // Initalizing event for course syllabus modal pop up
      $('#courseSyllabus').on('shown.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var syllabusUrl = button.data('url') // Extract URL from data-* attributes

        var modal = $(this)
        modal.find('.modal-body').html("Loading syllabus...")

        // Call the syllabus url and get the data
        axios.get(syllabusUrl)
          .then(function (response) {

            modal.find('.modal-body').html(response.data)
          })
          .catch(function (error) {
            modal.find('.modal-body').html(error)
          })

      })

      $('#courseSyllabus').on('hide.bs.modal', function (e) {
        // The syllabus.css file downloaded from the course syllabus endpoint
        // is intervening with existing styles. So, we disable the css once modal pop up is closed.
        $("#courseSyllabus link[href$='.css']").attr('disabled', 'disabled')
        var modal = $(this)
        modal.find('.modal-body').html("Loading syllabus...")
      })
      
      $('.accordion-collapse').on('show.bs.collapse', function () {
    	  var skuCode=$(this).attr('data-sku')
    	  
    		 if( $("[data-acc-sku='"+skuCode+"'] i").hasClass('chevron-transform')){
        		 $("[data-acc-sku='"+skuCode+"'] i").removeClass('chevron-transform')
        		 
        		 
        	  }
        	 else{
        		 $("[data-acc-sku='"+skuCode+"'] i").addClass('chevron-transform') 
        		$("[data-acc-sku='"+skuCode+"'] span").text('Hide courses');
        	 }
      });
      
      $('.accordion-collapse').on('hide.bs.collapse', function () {
    	  var skuCode=$(this).attr('data-sku')
    	  
    		 if( $("[data-acc-sku='"+skuCode+"'] i").hasClass('chevron-transform')){
        		 $("[data-acc-sku='"+skuCode+"'] i").removeClass('chevron-transform')
        		 $("[data-acc-sku='"+skuCode+"'] span").text('View courses');
        	  }
        	 else{
        		 $("[data-acc-sku='"+skuCode+"'] i").addClass('chevron-transform')
        	 }
      });

      $('#loading-progress').modal({
        backdrop: false,
        keyboard: false
      });

      // Attempt to get jurisdictions from cookie      
      jurisdictionList = Cookies.get(recommender_settings.jurisdictionsCookie)

      // If there are non zero jurisdictions, parse and send it to recommendations
      // and also to load the jurisdiction panel
      if (jurisdictionList) {
        jurisdictionList = JSON.parse(jurisdictionList)
      }

      this.getRecommendations(this.userId, this.uniqueId, jurisdictionList);
      this.getJurisdictions(jurisdictionList);


    },
    watch: {
      recommendationsLoaded: function () {
        this.manageLoadingProgress();
      },
      jurisdictionsLoaded: function () {
        this.manageLoadingProgress();
      },
      recommendationsLoadFailed: function () {
        this.manageLoadingProgress();
      }
  
    },
    methods: {
    	// TODO: Check below methods and remove if redundant - toggleChevron and toggleAccordion
    	toggleChevron:function(action){
    		if(action){
    			return 'chevron-transform'
    		}
    	},
    	toggleAccordion:function(skuCode,action){
    		if(action)
    			{
    			$("[data-sku='"+skuCode+"']").collapse('show');
    			 $("[data-acc-sku='"+skuCode+"'] i").addClass('chevron-transform')
    			 	$("[data-acc-sku='"+skuCode+"'] span").text('Hide courses');
    			return 'collapse in'
    			}
    		else
    			{
    			return 'collapse'
    			}
    	},
      getRecommendations: function (userId, uniqueId, jurisdictionsList) {
        this.recommendationsLoaded = false;
        axios.post(recommender_settings.getRecommendationsUrl, {
          u: userId,
          i: uniqueId,
          j: jurisdictionsList
        })
          .then(function (response) {
            console.log(response);
            app.results = response.data.Recommendations;
            app.subscriptions = response.data.Subscriptions;
            app.showRecommendations = true;
            app.recommendationsLoaded = true;
            app.recommendationsLoadFailed = false;
            $('#accordion').collapse('show')
            // Toggle accordions based on subscription status
      
          })
          .catch(function (error) {
            // TODO: Handle error
            app.recommendationsLoadFailed = true;
            console.log(error);
          });
      },
      getJurisdictions: function (jurisdictionList) {
        this.jurisdictionsLoaded = false;
        axios.get(recommender_settings.getJurisdictionUrl)
          .then(function (response) {
            console.log(response);
            app.jurisdictions = response.data;
            app.jurisdictionsLoaded = true;
            app.jurisdictionsLoadFailed = false;


            $('.jurisdiction-autocomplete').select2({ data: app.jurisdictions, maximumSelectionLength: 3 });
            $('.jurisdiction-autocomplete').val(jurisdictionList).trigger("change");
          })
          .catch(function (error) {
            // TODO: Handle error
            app.jurisdictionsLoadFailed = true;
            console.log(error)
          })
      },
      jurisdictionClick: function (event) {
        //alert(event.target.innerText)
        if ($(event.target).hasClass('jurisdiction-item-selected')) {
          $(event.target).removeClass('jurisdiction-item-selected')
        }
        else {
          $(event.target).addClass('jurisdiction-item-selected')

        }
      },
      saveJurisdiction: function (event) {
        // Collapse the accordion
        $(".collapse").collapse('hide');

        // Get all the selected jurisdictions
        var jurisdictionsList = [];
        $(".jurisdiction-item-selected").each(function (event) {
          jurisdictionsList.push(this.innerText)
        })

        $(".jurisdiction-autocomplete").find(":selected").each(function (event) {
          jurisdictionsList.push(this.innerText)
        })

        // Save into a cookie
        Cookies.set(recommender_settings.jurisdictionsCookie, jurisdictionsList)

        // Refresh the results
        this.results = [];
        this.getRecommendations(this.userId, this.uniqueId, jurisdictionsList);
      },
      manageLoadingProgress: function () {
        if ((this.jurisdictionsLoaded && this.recommendationsLoaded) || this.recommendationsLoadFailed) {
          $('#loading-progress').hide();
        }
        else {

          $('#loading-progress').appendTo('#recommender-container');

          $('#loading-progress').show();

          $('body').removeClass("modal-open")
        }
        
        this.subscriptions.forEach(function(item){
      	if(item.UserSubscriptionStatus)
        		{
        	//toggleSubscriptionAccordion(item.SkuCode,'show');
      		$("[data-sku='"+item.SkuCode+"']").collapse('show');
        		}
        	
        })
      },
      toggleSubscriptionAccordion:function(skuCode,action){
    	//  $("[data-sku='"+skuCode+"']").collapse(action);
    	 if( $("[data-sku='"+skuCode+"']").hasClass('chevron-transform')){
    		 $("[data-sku='"+skuCode+"']").removeClass('chevron-transform')
    	  }
    	 else{
    		 $("[data-sku='"+skuCode+"']").addClass('chevron-transform')
    	 }
      }
      
      

    }
  })
}
