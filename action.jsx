import axios from 'axios';
import { EPC_URL, parseResponseData, parseResponseError } from '../../redux/util';
import { showNotification } from '../../util/helpers';
import {api_epc_constants} from '../../constants/epc.js';

/*
dashboard_type = 1 for particular site
dashboard_type = 2 for particular account
dashboard_type = 3 for all accounts
*/
export const getDashboardInfo = (dispatch=null, dashboard_type=null, enterpriseName=null, epcName=null, loading=false) => {
	if (loading) dispatch(stratusLoadingBar(true));
	authValidate(dispatch);
	return {
		type: api_epc_constants.GET_DASHBOARD_DETAILS,
		payload: new Promise((resolve, reject) => {
			let url = `${api_epc_constants.API_ENTERPRISE}/`;
			if (enterpriseName && epcName) {
				url += `${enterpriseName}/site/${epcName.SiteUUID}?detailed=true`;
			} else if (enterpriseName) {
				url += `${enterpriseName}?detailed=true`;
			} else if (!enterpriseName && isAllowed('access_enterprise_page')) {
				url += '?detailed=true';	
			} else {
				reject(null);	
				return;
			}

			//console.log('getDashboardData detailed get url is ', url, ', getUserObj: ', getUserObj());
			axios.get(url)
			  .then((response) => {
				if (loading) dispatch(stratusLoadingBar(false));
				var data = parseResponseData(response);
				//console.log('getDashboardDetails data is ', data);
				let obj = {};
				obj[dashboard_type] = data;
				resolve(obj);
			  })
			  .catch((error) => {
				errorHandling(dispatch, error, 'getDashboardDetails', url, loading);
				let obj = {};
				obj[dashboard_type] = null;
				reject(obj);
			  });
		})
	};
};


export const getUserAvailAction = (dispatch, EnterpriseName, UserName, UserRole=null, callback=null, loading=false) => {
	if (loading) dispatch(stratusLoadingBar(true));
	authValidate(dispatch);
	return {
		type: api_epc_constants.GET_USER_AVAIL,
		payload: new Promise((resolve, reject) => {
			var url = `${api_epc_constants.API_ENTERPRISE}/${EnterpriseName}/user/${UserName}/availability`;
			let uObj = getUserObj();
			if (uObj.UserRole === 'superadmin' && !EnterpriseName && UserRole === 'superadmin') {
				url = `${api_epc_constants.API_SUPERADMIN}/${UserName}/availability`;
			}
			//console.log('user get url is ', url);
			axios.get(url)
			  .then((response) => {
				if (loading) dispatch(stratusLoadingBar(false));
				var data = parseResponseData(response);
				if (callback) callback(data, false);
				resolve(data);
			  })
			  .catch((error) => {
				if (callback) callback(error.response.data, true);
				reject(null);
			  });			  
		})
	};
};
