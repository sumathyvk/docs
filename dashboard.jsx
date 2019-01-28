import React, {Component} from 'react';
import {connect} from 'react-redux';
import StratusMapBox from './dashboard/google-map-box-allaccounts.jsx';
import StratusBaiduMapBox from './dashboard/baidu-map-box-allaccounts.jsx';
import StratusContainerSCU from './dashboard/container-scu.jsx';
import Content from '../components/shared/layout/content';
import StratusDashboardListView from './dashboard/list-view.jsx';
import StratusBreadCrumbName from './breadcrumb-name.jsx';
import StratusSettingsAccounts from './settings/accounts.jsx';
import DashboardPanel from '../components/dashboard/dashboard-panel';
import DashboardPanels from '../components/dashboard/dashboard-panels';
import PageContainer from '../components/shared/layout/page-container';
import SectionContainer from '../components/shared/layout/section-container';
import StratusDashboardStats from './dashboard/dashboard-stats.jsx';
import * as epc_actions from './actions/epc-action.jsx';
import StratusContainerAc from './dashboard/container-ac.jsx';
import {dynamicSort, formatBytes, manipulatingTraffic, getNames} from './actions/general-action.jsx';
import {getReadableFileSizeString} from './common/functions.jsx';

import {
  getUserObj,
  getMapType
} from '../util/local-storage';

class StratusDashboardAc extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			fetched: false
		};
	}
	
	callFetched() {
		setTimeout(() => {console.log('fetched is false');}, 10000);
	}

	componentDidMount() {
		const {enterpriseName, epcName} = getNames();
		//console.log('dashboard-ac');
		if (!enterpriseName) {
			this.props.callDashboardData();
			this.props.callDashboardDetails();
		}
    //chatlio code added
    window._chatlio = window._chatlio||[];
    !function(){ var t=document.getElementById("chatlio-widget-embed");if(t&&window.ChatlioReact&&_chatlio.init)return void _chatlio.init(t,ChatlioReact);for(var e=function(t){return function(){ _chatlio.push([t].concat(arguments)) }},i=["configure","identify","track","show","hide","isShown","isOnline", "page", "open", "showOrHide"],a=0;a<i.length;a++)_chatlio[i[a]]||(_chatlio[i[a]]=e(i[a])); let uobj = getUserObj();  let displayName = (uobj.EnterpriseName) ? (uobj.EnterpriseName + ' ' + uobj.UserName) : (uobj.FirstName + ' ' + uobj.UserName); _chatlio.identify(uobj.UserName, {...uobj, name: displayName, email: uobj.UserName});var n=document.createElement("script"),c=document.getElementsByTagName("script")[0];n.id="chatlio-widget-embed",n.src="https://w.chatlio.com/w.chatlio-widget.js",n.async=!0,n.setAttribute("data-embed-version","2.3");
       n.setAttribute('data-widget-id','acfcd77f-2d7d-43c6-4a06-7763b7f51576');
       c.parentNode.insertBefore(n,c);
    }();
	}

	componentWillReceiveProps(nextProps) {
		//console.log('ac: ', nextProps);
		//console.log('state 3 is ', this.state);
		//console.log( ' in componentWillReceiveProps 3', nextProps);
		
		//if (nextProps.stratusEPC.dashboard[3] && nextProps.stratusEPC.dashboard_details[3]) {
			/*if (!this.state.fetched) {
				//console.log('setting again 3 ', this.state, nextProps);
				this.setState({fetched: true});
				this.props.callDashboardData();
				this.props.callDashboardDetails();
			}*/
		//}
	}
	
	
	manipulatingAccountTraffic(data) {
  
		if (!data) return null;
     
		let total = 0;
		let myArr = [];
    let myArrThroughput = [];
		for (let j in data) {
			let obj = {value: data[j].Traffic};
			obj.name = j;
			obj.bytes = parseInt(obj.value, 10);
			total = total + obj.bytes;
			myArr.push(obj);

      // top accounts by throughput
      let obj2 = data[j];
			obj2.id = j;
			obj2.name = j;
			obj2.ul = parseInt(obj2.UlThroughput, 10);
			obj2.dl = parseInt(obj2.DlThroughput, 10);
			obj2.ulDisplay = obj2.ul > 0 ? getReadableFileSizeString(obj2.ul) : obj2.ul + ' kbps';
			obj2.dlDisplay = obj2.dl > 0 ? getReadableFileSizeString(obj2.dl) : obj2.dl + ' kbps';
			myArrThroughput.push(obj2);
		}
		
		
		for (let i = 0; i < myArr.length; i++) {
			myArr[i].percent_total = Math.round(((myArr[i].bytes / total) * 100));
		}
		myArr.sort(dynamicSort('-bytes'));
    if (this.props.stratusEPC.throughputdlul) myArrThroughput.sort(dynamicSort(this.props.stratusEPC.throughputdlul));
    
    let num = 5;
		let  returnObj = {accData: myArr.splice(0,num), accTotalBytes: total, imisiThroughput: myArrThroughput.slice(0, num)};
    return returnObj;
		
	}
	
	manipulatingSiteTraffic(data) {
		if (!data) return null;
		let total = 0;
		let myArr = [];
    let myArrThroughput = [];
		for (let j in data) {
			let acc = data[j];
			for (let k in acc) {
				let obj = {Traffic: acc[k].Traffic};
				obj.parent = j;
				obj.name = acc[k].Name;
				obj.bytes = parseInt(obj.Traffic, 10);
				total = total + obj.bytes;
				myArr.push(obj);
        
        // top sites by throughput
        let obj3 = {Traffic: acc[k].Traffic};
			  obj3.parent = j;
			  obj3.name = acc[k].Name;
			  obj3.ul = parseInt(acc[k].UlThroughput, 10);
			  obj3.dl = parseInt(acc[k].DlThroughput, 10);
			  obj3.ulDisplay = obj3.ul > 0 ? getReadableFileSizeString(obj3.ul) : obj3.ul + ' kbps';
			  obj3.dlDisplay = obj3.dl > 0 ? getReadableFileSizeString(obj3.dl) : obj3.dl + ' kbps';
			  myArrThroughput.push(obj3);
        
			}
		}
		for (let i = 0; i < myArr.length; i++) {
			myArr[i].percent_total = Math.round(((myArr[i].bytes / total) * 100));
		}
		myArr.sort(dynamicSort('-bytes'));
		//return {siteData: myArr, siteTotalBytes: total};
    if (this.props.stratusEPC.throughputdlul) myArrThroughput.sort(dynamicSort(this.props.stratusEPC.throughputdlul));
    let num = 5;
		let  returnSiteObj = {siteData: myArr.splice(0,num), siteTotalBytes: total, imisiThroughput: myArrThroughput.slice(0, num)};
    return returnSiteObj;
	}

	render() {

		let TotalAPNs = 0;
		let TotalIDUs = 0;
		let TotalIMSIs = 0;
		let siteObj = null;
		let siteData = null;
		let siteTotalBytes = 0;
		let accObj = null;
		let accData = null;
		let accTotalBytes = 0;
		let imisiThroughput = null;
    	let imisiThroughputSite = null;
		let pageData = this.props.parseServerReducer.enterprise_stats; //this.props.stratusEPC.dashboard[3];
		let dashboardDetails = this.props.parseServerReducer.enterprise_list; //this.props.stratusEPC.dashboard_details[3];
		//calculating sitelist
		if (pageData) {
			
			TotalAPNs = pageData.TotalAPNs;
			TotalIDUs = pageData.TotalIDUs;
			TotalIMSIs = pageData.TotalIMSIs;
			 // top accounts by throughput
			accObj = this.manipulatingAccountTraffic(pageData.EnterprisesByTraffic);
			accData = (accObj) ? accObj.accData : null;
			accTotalBytes = (accObj) ? accObj.accTotalBytes : 0;
			imisiThroughput = (accObj) ? accObj.imisiThroughput : null;
      
      // top sites by throughput
			siteObj = this.manipulatingSiteTraffic(pageData.SitesByTraffic);
			siteData = (siteObj) ? siteObj.siteData : null;
			siteTotalBytes = (siteObj) ? siteObj.siteTotalBytes : 0;
      imisiThroughputSite = (siteObj) ? siteObj.imisiThroughput : null;
		}
		
		let mapData = [];
			
		if (dashboardDetails) {
			for (let i = 0; i < dashboardDetails.length; i++) {
				if (dashboardDetails[i].SiteList) {
					for (let j = 0; j < dashboardDetails[i].SiteList.length; j++) {
						let geo = dashboardDetails[i].SiteList[j].GpsCoordinates;
						let geoArr = [];
						if (geo) {
							let tmp = geo.split(',');
							geoArr.push(parseFloat(tmp[0]));
							geoArr.push(parseFloat(tmp[1]));
						}
						if (geoArr.length > 0) {
							mapData.push({
								...dashboardDetails[i].SiteList[j],
								latlng: geoArr,
								traffic: ''
							});
						}//end if
					}//end for
				}//end if
			}//end for
		}//end if
		
		let mapDisplay = (<StratusMapBox mapData={mapData} />);
		if (getMapType() === 'Baidu') {
			mapDisplay = (<StratusBaiduMapBox mapData={mapData} />);
		}
		
		//console.log('dashboardDetails 3: ', dashboardDetails);
		//console.log('mapData 3: ', mapData);
		return (
			<Content className="dashboard-content">
					<StratusBreadCrumbName name={this.props.topic} />
					
					{mapDisplay}
					
					<PageContainer>
						<DashboardPanels className="responsive">
						  <DashboardPanel title="Account Overview" noPadding={true} className="full-width">
							<StratusSettingsAccounts />
						  </DashboardPanel>
						</DashboardPanels>
						
					</PageContainer>
					<StratusDashboardStats TotalAPNs={TotalAPNs} TotalIDUs={TotalIDUs} TotalIMSIs={TotalIMSIs} />
					<StratusContainerAc accData={accData} accTotalBytes={accTotalBytes} siteData={siteData} siteTotalBytes={siteTotalBytes}  imisiThroughput={imisiThroughput} imisiThroughputSite={imisiThroughputSite} />
			</Content>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		stratusGeneral: state.stratusGeneral,
		stratusEPC: state.stratusEPC,
		parseServerReducer: state.parseServerReducer
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		callDashboardData: () => {
			dispatch(epc_actions.getDashboardData(dispatch, 3));
		},
		callDashboardDetails: () => {
			dispatch(epc_actions.getDashboardDetails(dispatch, 3));
		}
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(StratusDashboardAc);
