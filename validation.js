// Vue JavaScript source code

var urlBase ='http://algoliawebapi-qa.us-west-2.elasticbeanstalk.com/api';
//var urlBase='http://algoliawebapi-stage-env.us-west-2.elasticbeanstalk.com/api/search';
//var urlBase='http://10.0.6.13/Nautilus/api/search';
var urlToGet='';
//var userid='JOE@CPFCO.COM';
//var userid=''
var lowcred = -1;
var highcred = 200;
var lowyear = 2003;
var highyear = 2018;
var vm = new Vue({
    el: '#vuesearch',
    data: {
        dropbtn: 'dropbtn',
        dropdwn: 'dropdwn',
        cpa_base_url: 'http://www.aicpastore.com',
        cpa_stock_img: '/media/images/coverPlaceholder.png',
        img_base_url: 'http://www.aicpastore.com',
        cpa_ajax_loader: '/media/generic_site_content/images/ajax-loading.gif',
        //img_base_url: 'http://cpa2biz.com',
        sort_selected: 'Most Relevant',
        sort_array: ['Most Relevant', 'CPE Credit'],
        completed_sort_array: ['Completion Year', 'CPE Credit'],
        completed_sort_selected: 'Completion Year',
        completed_sort_idx: 0,
        sort_selected_idx: 0,
        s_results: '',
        str_query: '',
        str_query_db: '',
        //make these facets dynamic
        fosfacets: {},
        creditfacets: {},
        bundlefacets: {},
        //selected facets array
        selectedfos: [],
        selectedcredit: '',
        selectedbundle: [],
        //pagination related data elements
        currentpage: '',
        maxpage: '',
        currentpagerange: [],
        str_lowcredit: lowcred,
        str_highcredit: highcred,
        str_lowyear: lowyear,
        str_highyear: highyear,
        jsonToPost: {},
        facetJson: {},
        ready_for_next_query: true,
        selected_facets_count: 0,
        slider_facet_low: 0,
        slider_facet_high: 0,
        credit_input_low: 0,
        credit_input_high: 0,
        page_sku_code: '',
        user_sku_subscription: [],

        //mode 0 is user not logged./no access
        // mode 1 is product page search user logged in access. 
        //mode 2 is my accounts page search for product. 
        //mode 3 is all enrolled courses search. 
        //mode 4 is product specific complete. 
        //mode 5 is completed courses my account
        mode_to_view: 1,
        data_loading: true,
        debug_view: false,
        first_time_load: true,
        is_user_logged: true,
        //dbsearch related fields
        d_results: '',
        year_facets: {},
        lastRequest: {}
    },
    methods: {
        reset_search_q: function () {
            this.str_query = '';
        },

        check_if_parents_exist: function (parents) {
            if (parents) {
                if (parents.length > 0) {
                    return true;
                }
            }
            else return false;
        },
        check_if_course_product: function (courseguid, lmsguid) {
            return courseguid == lmsguid;
        },
        get_page_number_class: function (pagenumber) {
            console.log('page number is ' + pagenumber);
            if (pagenumber == this.currentpage) {
                return 'active';
            }
            else return '';
        },
        gotoLMS: function (url) {
            window.open(url, '_blank');
        },
        getSyllabus: function (courseguid) {
            //ToDo: get syllabus
            var urlForSyllabus = urlBase + '/course?cid=' + courseguid + '&isy=true';
            $.get(urlForSyllabus, function (data) {
                console.log('syllabus for '+ courseguid + ' is ' + data);
               var w=window.open();
               $(w.document.body).html(data);
            });
        },
        change_mode_to_view: function(val){
            if(val=='All'){
                this.mode_to_view=3;
            }
            else{
                if((this.page_sku_code)&&(this.is_user_logged)){
                    this.mode_to_view=1;
                }
                else if (this.is_user_logged) {this.mode_to_view=2}
                else this.mode_to_view=0;
            }
        },
        removeallfacets: function () {
            this.selectedfos = [];
            this.selectedbundle = [];
            this.slider_facet_low = 0;
            this.slider_facet_high = 0;
            this.credit_input_low = 0;
            this.credit_input_high = 0;
        },
        removeselectedfos: function (fos) {
            for (i = 0; i < this.selectedfos.length; i++) {
                if (this.selectedfos[i] == fos) {
                    this.selectedfos.splice(i, 1);
                }
            }

        },
        removeselectedbundle: function (bundle) {
            for (i = 0; i < this.selectedbundle.length; i++) {
                if (this.selectedbundle[i] == bundle) {
                    this.selectedbundle.splice(i, 1);
                }
            }
        },
        set_sort: function (idx) {

            this.sort_selected = this.sort_array[idx];
            this.sort_selected_idx = idx;
        },
        set_completed_sort: function (index) {
            this.completed_sort_selected = this.completed_sort_array[index];
            this.completed_sort_idx = index;
        },
        forward_currpage: function () {
            if (parseInt(this.currentpage) != parseInt(this.maxpage)) { this.currentpage = parseInt(this.currentpage) + 1; }
            if (this.mode_to_view < 4)
                this.get_search();
            else this.get_db_search();
        },
        backward_currpage: function () {
            if (parseInt(this.currentpage) != 1) { this.currentpage = (this.currentpage) - 1; }
            if (this.mode_to_view < 4)
                this.get_search();
            else this.get_db_search();
        },
        create_pagination: function (currpage, totalpages) { // this really should be componentized
            var minpage, maxpage;
            // console.log('begining of pagination script '+this.currentpagerange)
            if (this.currentpagerange.length > 0) {
                this.currentpagerange = [];
            }
            //console.log('middle of pagination '+this.currentpagerange);
            if ((currpage + 1) < 5) minpage = 1;
            else minpage = (currpage + 1) - 4;
            //console.log('minpage is '+minpage);
            maxpage = minpage + 5;
            if (totalpages < maxpage) maxpage = totalpages;
            //console.log('maxpage is '+maxpage);     

            for (n = minpage; n < maxpage + 1; n++) {
                //  console.log('incrementing n as '+n);
                this.currentpagerange.push(n);
            }
            //console.log('end of pagination script '+this.currentpagerange);       
        },
        create_completed_pagination: function (currpage, totalhits) {
            var totalpages = Math.ceil(totalhits / 10);
            console.log(totalpages);
            this.create_pagination(currpage, totalpages);
        },
        update_pagenumber: function (sender) {
            this.currentpage = sender;
            if (this.mode_to_view < 4) this.get_search();
            else this.get_db_search();
        },

        update_facets_count: function () {
            this.selected_facets_count = this.selectedfos.length + this.selectedbundle.length + this.slider_facet_low + this.slider_facet_high + this.credit_input_low + this.credit_input_high;
        },

        create_json: function () {
            var facets = {};
            if (this.selectedfos.length > 0) {
                facets.field = this.selectedfos;
            }
            if (this.selectedbundle.length > 0) {
                facets.parent_bundle = this.selectedbundle;
            }
            facets.credits = [];
            facets.credits[0] = this.str_lowcredit;
            facets.credits[1] = this.str_highcredit;
            if (this.mode_to_view == 2) {
                if (this.user_sku_subscription.length > 0) {
                    facets.sku_family = this.user_sku_subscription;
                }
                else facets.sku_family=['none'];
            }
            if ((this.page_sku_code) && (this.mode_to_view < 2)) {
                facets.sku_code = [this.page_sku_code];
            }
            this.jsonToPost = {
                q: this.str_query == '' ? '' : this.str_query,
                p: this.currentpage == '' ? '' : this.currentpage - 1,
                f: facets,
                u: userid,
                s: this.sort_selected_idx
            };

        },
        get_img_url_from_hit: function (prd_url) {
            if (prd_url) {
                return this.img_base_url + prd_url;
            }
            else return cpa_stock_img;
        },
        trigger_search_from_slider: function (values) {
            //console.log("called from slider");
            this.str_lowcredit = values[0];
            this.str_highcredit = values[1];
            this.currentpage = 0;
            if (this.mode_to_view < 4) this.get_search();
            else this.get_db_search();
        },
        trigger_search_from_input: function (handle, value) {
            //console.log("called from input");
            if (handle == 0) {
                this.str_lowcredit = value;
            }
            else this.str_highcredit = value;
            if (this.mode_to_view < 4) this.get_search();
            else this.get_db_search();
        },
        trigger_dbsearch_from_slider: function (values) {
            this.str_lowyear = values[0];
            this.str_highyear = values[1];
            this.currentpage = 0;
            this.get_db_search();
        },
        trigger_search_from_enter: function () {
            this.currentpage = 0;
            this.get_search();
        },
        trigger_db_search_from_enter: function () {
            this.currentpage = 0;
            this.get_db_search();
        },
        get_user_subscription: function () {
            //will be used to call the user subscription details and get the sku codes           
            var skumatch = false;
            var urlToSend;
            if (userid) {
                urlTosend = urlBase + '/search?uid=' + userid;

                this.$http.get(urlTosend).then(function (response) {
                    this.user_sku_subscription = response.body;
                    console.log(this.user_sku_subscription);
                    for (i = 0; i < this.user_sku_subscription.length; i++) {
                        if (this.page_sku_code == this.user_sku_subscription[i]) {
                            skumatch = true;
                            break;
                        }
                    }

                    if (this.mode_to_view == 1) {
                        if (!skumatch) this.mode_to_view = 0;
                    }
                    this.get_search();
                }).catch(function (error) {
                    console.log(error);
                });
            }
            else {
                this.is_user_logged = false;
                this.mode_to_view = 0;
                this.get_search();
            }

        },
        show_learning_progress: function(){
            if((this.mode_to_view>0)&&(userid)){
                return true;
            }
            else return false;
        },
        identify_mode_to_view: function () {
            //add associated facet filter depending on the mode you are on. also set some data values to display the parent bundle facets on or off
            // also add to the parent bundle for any sku_code
            ////this.selectedbundle.push('CPExpress'); 
            var urlParams = new URLSearchParams(window.location.search);
            console.log(urlParams.has('mode'));
            if (urlParams.has('mode')) {
                this.mode_to_view = urlParams.get('mode');
            }
            console.log(urlParams.has('skucode'));
            if (this.mode_to_view == 2) {
                //ToDo: currently hard coded to stuff CPExpress in the parent bundle facet filter. will need to make this dynamic
                //this.selectedbundle.push('CPExpress');
            }
            if (this.mode_to_view == 1) {
                //fail safe for version 1.3 release
                this.page_sku_code = 'BYT-XX';
            }
            if (urlParams.has('skucode')) {
                if (this.mode_to_view < 2) {
                    this.page_sku_code = urlParams.get('skucode');
                }
            }
            this.get_user_subscription();
        },
        get_search: function () {
            // if its a first time load. get the user sku codes
            //and then create json and load
            // this.ready_for_next_query=false;
            this.data_loading = true;
            this.create_json();
            console.log(this.jsonToPost);
            this.$http.post(urlBase + '/search', this.jsonToPost).then(function (response) {
                console.log(response);
                this.s_results = response.data;
                this.fosfacets = this.s_results.disjunctiveFacets.Field;
                this.creditfacets = this.s_results.disjunctiveFacets.Credits;
                this.bundlefacets = this.s_results.disjunctiveFacets.Parent_bundle;
                this.currentpage = this.s_results.page + 1;
                this.maxpage = this.s_results.nbPages;
                this.create_pagination(this.s_results.page, this.s_results.nbPages);
                this.data_loading = false;
                this.first_time_load = false;
            }).catch(function (error) {
                console.log(error);
            })

        },
        create_db_json: function () {
            // create json for db search
            // var returnJson={};
            var facets = {};
            if (this.selectedfos.length > 0) {
                facets.field = this.selectedfos;
            }
            if (this.selectedbundle.length > 0) {
                facets.parent_bundle = this.selectedbundle;
            }
            facets.credits = [];
            facets.credits[0] = this.str_lowcredit;
            facets.credits[1] = this.str_highcredit;

            /*facets.year = [];
            facets.year[0] = this.str_lowyear;
            facets.year[1] = this.str_highyear;*/

            if ((this.page_sku_code) && (this.mode_to_view == 4)) {
                facets.sku_code = [this.page_sku_code];
            }
            var returnJson = {
                q: this.str_query_db == '' ? '' : this.str_query_db,
                p: this.currentpage == '' ? '' : this.currentpage - 1,
                f: facets,
                u: userid,
                s: this.completed_sort_idx
            }
            return returnJson;
        },
        get_db_search: function () {
            // get search from db
            this.data_loading = true;
            var dbApiUri = urlBase + '/search?ic=true';
            var dbjson = this.create_db_json();
            console.log('query is' + dbjson.q);
            this.$http.post(dbApiUri, dbjson
            ).then(function (response) {
                console.log('returning from db search is ' + dbjson.q);
                this.d_results = response.data;
                console.log(this.d_results.hits);
                this.fosfacets = this.d_results.disjunctiveFacets.Field;
                this.creditfacets = this.d_results.disjunctiveFacets.Credits;
                this.bundlefacets = this.d_results.disjunctiveFacets.Parent_bundle;
                this.year_facets = this.d_results.disjunctiveFacets.Year;
                console.log(this.fosfacets);
                console.log("parent bundle from db " + this.bundlefacets);
                console.log("hit numbers  are " + this.d_results.nbHits);
                this.currentpage = dbjson.p + 1;
                this.create_completed_pagination(dbjson.p, this.d_results.nbHits);
                this.data_loading = false;
            }).catch(function (error) {
                console.log(error);
            })

        },
        db_hit_results: function () {
            return this.d_results.hits.slice(0, 9);
        },
        simple_log: function (val) {
            console.log(val);
        },
        show_bundles: function (skucode) {
            if(this.mode_to_view==0){
                return true;
            }
            else{
                if(this.mode_to_view==3){
                    return true;
                }
                else{
                    for (i = 0; i < this.user_sku_subscription.length; i++) {
                        if (skucode == this.user_sku_subscription[i]) {
                           return false;
                           
                        }
                    }
                    return true;
                }
            }
            return false;
        },
        reset_dbsearch_q: function () {
            this.str_query_db = '';
            this.get_db_search();
        }
    },

    watch: {
        /* str_query: function (val) {
             setTimeout(300, this.get_search());
         },
         str_query_db: function(val){
             this.get_db_search();
         },*/
        mode_to_view: function (val) {
            if (val < 4) {
                if (!this.first_time_load) this.get_search();
            }
            else {
                if (!this.first_time_load) this.get_db_search();
            }
        },
        selectedfos: function (val) {
            this.update_facets_count();
            this.currentpage = 0
            if (this.mode_to_view < 4) {
                if (!this.first_time_load) this.get_search();
            }
            else {
                this.get_db_search();
            }

            // console.log(this.selected_facets_count);
        },
        selectedbundle: function (val) {
            this.update_facets_count();
            this.currentpage = 0;
            if (this.mode_to_view < 4) {
                if (!this.first_time_load) this.get_search();
                // console.log(this.selected_facets_count);
            }
            else {
                this.get_db_search();
            }
        },
        completed_sort_idx: function (val) {
            this.currentpage = 0;
            this.get_db_search();
        },
        sort_selected_idx: function () {
            this.currentpage = 0;
            this.get_search();
        },
        str_lowcredit: function (val) {
            if (val != lowcred) {
                this.credit_input_low = 1;
            }
            else this.credit_input_low = 0;
            this.update_facets_count();
        },
        str_highcredit: function (val) {
            if (val != highcred) {
                this.credit_input_high = 1;
            }
            else this.credit_input_high = 0;
            this.update_facets_count();
        }

    },
    ready: function () {
        this.identify_mode_to_view();
        //this.get_user_subscription();
        console.log(this.mode_to_view);
        //  console.log(this.is_user_logged);
        //this.selectedbundle.push('CPExpress');
        // this.get_search();
    }

});

//function view syllabus
function getSyllabus(courseguid) {

}

// collapse functionality in lieu of less
function collapseDiv(div_id, btn_id) {
    $(div_id).toggle();
    if ($(btn_id).toggleClass("collapsed"));
}


//reset functionality with no-ui-slider as well
function reset_all_facets() {
    vm.removeallfacets();
    slider.noUiSlider.reset();
    vm.str_lowcredit = lowcred;
    vm.str_highcredit = highcred;
    //vm.str_query='';
}
function tgbtn(el) {
    var idx = '';
    if (el.id.toString().indexOf('title_') != -1)
        idx = el.id.toString().substring(6);
    else idx = el.id.toString().substring(7);
    //console.log(idx);
    var bundle_div = document.getElementById('dropdwn' + idx);
    var bundle_div_class = bundle_div.getAttribute("class");
    var btn = document.getElementById('dropbtn' + idx);
    var aria_expanded = btn.getAttribute('aria-expanded');

    if (bundle_div_class == 'dropdown') {
        // console.log('trying to open dropdown');
        bundle_div.setAttribute('class', 'dropdown open');
    }
    else {
        bundle_div.setAttribute('class', 'dropdown');
    }
    if (aria_expanded == 'false') {
        btn.setAttribute('aria-expanded', 'true');
    }
    else {
        btn.setAttribute('aria-expanded', 'false');
    }

}
$(window).scroll(function () {
    $('#content .widget-box .widget-content p.description').expander({
        slicePoint: 250, //It is the number of characters at which the contents will be sliced into two parts.
        widow: 2,
        expandSpeed: 0, // It is the time in second to show and hide the content.
        userCollapseText: 'Read Less <i class="fa fa-angle-up"></i>' // Specify your desired word default is Less.
    });
    //console.log('i am finsihsed window on load');
    $('#content .widget-box .widget-content p.description').expander();
});

$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('#go-to-top').css({
            bottom: "25px"
        });
    } else {
        $('#go-to-top').css({
            bottom: "-100px"
        });
    }
});

$('#go-to-top').click(function () {
    $('html, body').animate({
        scrollTop: '0px'
    }, 800);
    $('#go-to-top').css({
        bottom: "25px"
    });
    //return false;
});






