const processDashboardDetails = (details) => {
	if (!details) return null;
	if (!details.EPC) return null;

	let dashboard_details = [];
	//let obj = this.setObject(type, name, ip, snmp_ip, tstatus, status, xtras={});

	let epc = details.EPC;
	let obj = setObject('EPC', epc.EPCName, '', '', -1, epc.IsOnline, {mcc: epc.MCC, mnc: epc.MNC, isOnline: epc.IsOnline}, 0);
	dashboard_details.push(obj);
	if (epc.IduList && epc.IduList.length > 0) {
		let idus = epc.IduList;
		for (let i = 0; i < idus.length; i++) {
			let idu = idus[i];
			let iduModel = idu.Model;
			let iduStatus = (idu.OperationalState ? (idu.OperationalState.Code === '1' ? true : false) : -1);
			let iduTstatus = (idu.AdministrativeState ? (idu.AdministrativeState.Code === '1' && idu.OperationalState.Code ? true : false) : -1);

			//Baseband, RPAP, Pico
			let obj = setObject(iduModel, idu.IduName, idu.IduIP, '', iduTstatus, iduStatus, {connectedsince: idu.ConnectedSince, tac: idu.TAC, type: idu.Type, TransmissionStatus: idu.TransmissionStatus, isActive: (idu.OperationalState && idu.OperationalState.Code === '1')}, 1);
			dashboard_details.push(obj);
			if (idu.IruList && idu.IruList.length > 0) {
				let irus = idu.IruList;
				for (let j = 0; j < irus.length; j++) {
					let iru = irus[j];
					let obj = setObject('Radio Unit', iru.UserLabel, '', '', (iru.AdministrativeState.Code === '1' ? true : false), (iru.OperationalState.Code === '1' ? true : false), {AdministrativeState: iru.AdministrativeState, OperationalState: iru.OperationalState, ProductData: iru.ProductData, idu: idu.IduName, iru: iru.FieldReplaceableUnitId, isActive: (iru.OperationalState.Code === '1')}, 2);
					dashboard_details.push(obj);
					if (iru.RdsList && iru.RdsList.length > 0) {
						let rdslist = iru.RdsList;
						for (let k = 0; k < rdslist.length; k++) {
							let rds = rdslist[k];
							let code = rds.AvailabilityStatus.Code.trim();
							if (code !== '') {
								//continue;
							}
							let obj = setObject('Dot', rds.UserLabel, '', '', (rds.AdministrativeState.Code === '1' ? true : false), (rds.OperationalState.Code === '1' ? true : false), {AdministrativeState: rds.AdministrativeState, OperationalState: rds.OperationalState, ProductData: rds.ProductData, idu: idu.IduName, iru: iru.FieldReplaceableUnitId, rds: rds.FieldReplaceableUnitId, isActive: (rds.OperationalState.Code === '1')}, 3);
							dashboard_details.push(obj);
						}
					}//if iru.RdsList

					if (iru.ChildIruList && iru.ChildIruList.length > 0) {
						let childIru = iru.ChildIruList;
						for (let a = 0; a < childIru.length; a++) {
							let cIru = childIru[a];
							let obj = setObject('Radio Unit', cIru.UserLabel, '', '', (cIru.AdministrativeState.Code === '1' ? true : false), (cIru.OperationalState.Code === '1' ? true : false), {AdministrativeState: cIru.AdministrativeState, OperationalState: cIru.OperationalState, ProductData: cIru.ProductData, idu: idu.IduName, iru: cIru.FieldReplaceableUnitId, parentIru: iru.FieldReplaceableUnitId, isActive: (cIru.OperationalState.Code === '1')}, 3);
							dashboard_details.push(obj);
							if (cIru.RdsListUnderChildIRU && cIru.RdsListUnderChildIRU.length > 0) {
								let rdsChildlist = cIru.RdsListUnderChildIRU;
								for (let b = 0; b < rdsChildlist.length; b++) {
									let rdsChild = rdsChildlist[b];
									let code = rdsChild.AvailabilityStatus.Code.trim();
									if (code !== '') {
										//continue;
									}
									let obj = setObject('Dot', rdsChild.UserLabel, '', '', (rdsChild.AdministrativeState.Code === '1' ? true : false), (rdsChild.OperationalState.Code === '1' ? true : false), {AdministrativeState: rdsChild.AdministrativeState, OperationalState: rdsChild.OperationalState, ProductData: rdsChild.ProductData, idu: idu.IduName, iru: cIru.FieldReplaceableUnitId, parentIru: iru.FieldReplaceableUnitId, rds: rdsChild.FieldReplaceableUnitId, isActive: (rdsChild.OperationalState.Code === '1')}, 4);
									dashboard_details.push(obj);
								}
							}//end child RdsListUnderChildIRU list
						}//end for
					}//end if iru.ChildIruList

				}// for irus.length
			}//if idu.IruList
		}//for idus.length
	}//if epc.IduList

	return dashboard_details;
};
