/* Validate Zip code Format 5 Digits +4 zip code  */
function validateZipcode(field,type) {
  var valid = "0123456789-";
	var hyphencount = 0;
	var error = "";
	if (field.length!=5 && field.length!=10) {
	
		 error = "Please enter your "+type+ "5 digit or 5 digit+4 zip code.";	
	}
	for (var i=0; i < field.length; i++) {
	temp = "" + field.substring(i, i+1);
	if (temp == "-") hyphencount++;
	if (valid.indexOf(temp) == "-1") {
		error = "Invalid characters in your "+type+" zip code.  Please try again.";	
	}
	if ((hyphencount > 1) || ((field.length==10) && ""+field.charAt(5)!="-")) {
		error = "The hyphen character should be used with a properly formatted 5 digit+four zip code, like '12345-6789'.   Please try again.";
	   }
	}	
	return error;
}

/*  This method is used to validate the phone no  */

function validatePhone(fld,type) {
     var error = "";
	   var stripped = fld.value.replace(/[\(\)\.\ ]/g, '');
	   if (fld.value == "") {
	        error = "Please enter "+type+"Phone Number.\n";
	        //fld.style.background = 'Yellow';
	    } else if (isNaN(parseInt(stripped)) || isNaN(fld.value) ) {
	        error = "The "+type+"phone number contains illegal characters.\n";
	       // fld.style.background = 'Yellow';
	    } else if (stripped.length <10) {
	        error = "The "+type+"phone number is the wrong length. Make sure you included an area code.\n";
	       // fld.style.background = 'Yellow';
	    }
	  
	    return error;
}
