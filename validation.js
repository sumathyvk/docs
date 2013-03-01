//validation for numbers only it should accept only number in the field
//validation for divphoto with grayout functionality

function acceptnumbersonly(e, decimal) {
  var key;
	var keychar;
	if (window.event) {
	   key = window.event.keyCode;
	}
	else if (e) {
	   key = e.which;
	}
	else {
	   return true;
	}
	keychar = String.fromCharCode(key);

	if ((key==null) || (key==0) || (key==8) ||  (key==9) || (key==13) || (key==27) ) {
	   return true;
	}
	else if ((("0123456789").indexOf(keychar) > -1)) {
	   return true;
	}
	else if (decimal && (keychar == ".")) {	
	  return true;
	}
	else
	   return false;
}

function zoomDivPhoto(imgsrc,imgwidth,imgheight)
{
	document.getElementById("zoomDiv").style.display ="block";
	document.getElementById("zoomDiv").imgwidth=width;
	document.getElementById("zoomDiv").imgheight=height;
	document.getElementById("zoomSrc").imgsrc=src;
	//gray out
	grayOut(true,{'opacity':'45'});
	
	centerZoomPopup('zoomDivPhoto',450,28,imgheight,imgwidth);
}

function closePhotoZoomDiv()
{
	document.getElementById("zoomDivPhoto").style.display ="none";
	document.getElementById("zoomSrc").imgsrc="/images/pixel.gif";
	grayOut(false);
}

function centerProfilePopup(divID){
		
		alert("center" +divID);
		//request data for centering
		var windowWidth =  $(window.parent.document.body).width();
		if (navigator.userAgent.indexOf("Firefox")!=-1)
	  	 var windowHeight =  $(window.parent.document.body).height() ;
		else
		   var windowHeight =  $(window.parent.document.body).height(); //for IE
		var popupHeight = 587; //205
		var popupWidth = $("#contentPage").width();
		//centering
		 $("#" +divID, parent.document.body).css({
			"position": "absolute",
			"top": windowHeight/2-popupHeight/2-100,
			"left": windowWidth/2-popupWidth/2-300
		});
			
	}
