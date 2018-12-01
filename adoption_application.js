
$( document ).ready(function() {
	//jQuery time
	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches
	var firstName, lastName, email, phone, address, city, state, zipcode;
	var interviewForm, interviewDate, interviewTime;
	var reasons, questions;

	// Make sure when pressing enter key while filling the form, it won't automatically press submit button
	$(document).keypress(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13'){
	           return false;
	    }
	});

	$(".back").click(function(){
		window.location.href='./pet_profile.html';
	});
	$(".pic-scaled").click(function(){
		window.location.href='./index.html';
	});

	/* //the interface of UI is weird
	//autocomplete
    $( function() {
      
    	var stateList = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
      			   	 	 "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
      			   	 	 "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
      			   	 	 "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
      			   	 	 "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
      	//autocomplete
      	$( ".autocomplete" ).autocomplete({
      		source: stateList,
      		minLength: 0
    	});
    	$(".ui-helper-hidden-accessible").hide();

	});
*/

	/****************Reference****************
	* Phone Number - Auto Format
	* WBTraughber
	* https://codepen.io/TalonBauer/pen/lvpBI
	******************************************/
	function phone_formatting(ele,restore) {
	  var new_number,
	      selection_start = ele.selectionStart,
	      selection_end = ele.selectionEnd,
	      number = ele.value.replace(/\D/g,'');
	  
	  // automatically add dashes
	  if (number.length > 2) {
	    // matches: 123 || 123-4 || 123-45
	    new_number = number.substring(0,3) + '-';
	    if (number.length === 4 || number.length === 5) {
	      // matches: 123-4 || 123-45
	      new_number += number.substr(3);
	    }
	    else if (number.length > 5) {
	      // matches: 123-456 || 123-456-7 || 123-456-789
	      new_number += number.substring(3,6) + '-';
	    }
	    if (number.length > 6) {
	      // matches: 123-456-7 || 123-456-789 || 123-456-7890
	      new_number += number.substring(6);
	    }
	  }
	  else {
	    new_number = number;
	  }
	  
	  // if value is heigher than 12, last number is dropped
	  // if inserting a number before the last character, numbers
	  // are shifted right, only 12 characters will show
	  ele.value =  (new_number.length > 12) ? new_number.substring(0,12) : new_number;
	  
	  // restore cursor selection,
	  // prevent it from going to the end
	  // UNLESS
	  // cursor was at the end AND a dash was added
	  
	  if (new_number.slice(-1) === '-' && restore === false
	      && (new_number.length === 8 && selection_end === 7)
	          || (new_number.length === 4 && selection_end === 3)) {
	      selection_start = new_number.length;
	      selection_end = new_number.length;
	  }
	  else if (restore === 'revert') {
	    selection_start--;
	    selection_end--;
	  }
	  ele.setSelectionRange(selection_start, selection_end);
	}
	 
	function phone_number_check(field,e) {
	  var key_code = e.keyCode,
	      key_string = String.fromCharCode(key_code),
	      press_delete = false,
	      dash_key = 189,
	      delete_key = [8,46],
	      direction_key = [33,34,35,36,37,38,39,40],
	      selection_end = field.selectionEnd;
	  
	  // delete key was pressed
	  if (delete_key.indexOf(key_code) > -1) {
	    press_delete = true;
	  }
	  
	  // only force formatting is a number or delete key was pressed
	  if (key_string.match(/^\d+$/) || press_delete) {
	    phone_formatting(field,press_delete);
	  }
	  // do nothing for direction keys, keep their default actions
	  else if(direction_key.indexOf(key_code) > -1) {
	    // do nothing
	  }
	  else if(dash_key === key_code) {
	    if (selection_end === field.value.length) {
	      field.value = field.value.slice(0,-1)
	    }
	    else {
	      field.value = field.value.substring(0,(selection_end - 1)) + field.value.substr(selection_end)
	      field.selectionEnd = selection_end - 1;
	    }
	  }
	  // all other non numerical key presses, remove their value
	  else {
	    e.preventDefault();
	//    field.value = field.value.replace(/[^0-9\-]/g,'')
	    phone_formatting(field,'revert');
	  }

	}

	document.getElementById('phone').onkeyup = function(e) {
	  phone_number_check(this,e);
	}
	/****************Reference End****************/

	/****************Reference****************
	* Form Validation Using jQuery and Regular Expressions
	* http://www.designchemical.com/blog/index.php/jquery/form-validation-using-jquery-and-regular-expressions/
	******************************************/
	function checkEmail(input){
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if(input.length==0){
			$("#email").change(function () {
			    $(this).css("border", "1px solid #EF4F32");
			    $("#emailErr").html( "Email should not be empty" );
			    $("#emailErr").css("margin-bottom", "10px");
			}).trigger("change");
			return false;
		}else if(!emailReg.test(input)){
			$("#email").change(function () {
			    $(this).css("border", "1px solid #EF4F32");
			    $("#emailErr").html( "Email is invalid" );
			    $("#emailErr").css("margin-bottom", "10px");
			}).trigger("change");
			return false;
		}else {
			
			$("#email").change(function () {
				$(this).css("border", "1px solid #ccc");
				$("#emailErr").html( "" );
				$("#emailErr").css("margin-bottom", "0px");
			}).trigger("change");
		}
		return true;
	}
	/****************Reference End****************/

	function checkPhoneNumber(input){
		if(input.length==0){
			$("#phone").change(function () {
			    $(this).css("border", "1px solid #EF4F32");
			    $("#phoneNumberErr").html( "Phone number should not be empty" );
			    $("#phoneNumberErr").css("margin-bottom", "10px");
			}).trigger("change");
			return false;
		}else if(input.length!=12){
			$("#phone").change(function () {
			    $(this).css("border", "1px solid #EF4F32");
			    $("#phoneNumberErr").html( "Phone number is invalid" );
			    $("#phoneNumberErr").css("margin-bottom", "10px");
			}).trigger("change");
			return false;
		}else{
			$("#phone").change(function () {
				$(this).css("border", "1px solid #ccc");
				$("#phoneNumberErr").html( "" );
				$("#phoneNumberErr").css("margin-bottom", "0px");
			}).trigger("change");
		}
		return true;
	}

	function checkZipcode(input){
		if(input.length==0){
			$("#zipcode").change(function () {
			    $(this).css("border", "1px solid #EF4F32");
			    $("#zipcodeErr").html( "Zipcode should not be empty" );
			}).trigger("change");
			return false;
		}else if(input.length!=5){
			$("#zipcode").change(function () {
			    $(this).css("border", "1px solid #EF4F32");
			    $("#zipcodeErr").html( "Zipcode should be a 5-digit number" );
			}).trigger("change");
			return false;
		}else{
			for (var i = 0; i<input.length;i++){
			
				if(input[i]=="0"||input[i]=="1"||input[i]=="2"||input[i]=="3"||input[i]=="4"||input[i]=="5"||input[i]=="6"||input[i]=="7"||input[i]=="8"||input[i]=="9"){
					continue;
				}else{
					$("#zipcode").change(function () {
					    $(this).css("border", "1px solid #EF4F32");
					    $("#zipcodeErr").html( "Zipcode should be a 5-digit number" );
					}).trigger("change");
					return false;
				}
			}
			$("#zipcode").change(function () {
				$(this).css("border", "1px solid #ccc");
				$( "#zipcodeErr" ).html( "" );
			}).trigger("change");
		}
		return true;
	}

/****************Reference****************
* Multi Step Form with Progress Bar using jQuery and CSS3
* Atakan Goktepe
* https://codepen.io/atakan/pen/gqbIz?editors=1000
******************************************/
    //click on information page next btn
	$(".first_page").click(function(){

		var isValid = true;
		firstName = $('#firstName').val();
		if(firstName==""){
			$("#firstName").change(function () {
				    $(this).css("border", "1px solid #EF4F32");
				    $("#firstNameErr").html( "First name should not be empty" );
				    $("#firstNameErr").css("margin-bottom", "10px");
			}).trigger("change");
			isValid = false;
		}else{
			$("#firstName").change(function () {
				    $(this).css("border", "1px solid #ccc");
				    $("#firstNameErr").html( "" );
				    $("#firstNameErr").css("margin-bottom", "0px");
			}).trigger("change");
		}
		lastName = $('#lastName').val();
		if(lastName==""){
			$("#lastName").change(function () {
				    $(this).css("border", "1px solid #EF4F32");
				    $("#lastNameErr").html( "Last name should not be empty" );
				    $("#lastNameErr").css("margin-bottom", "10px");
			}).trigger("change");
			isValid = false;
		}else{
			$("#lastName").change(function () {
				    $(this).css("border", "1px solid #ccc");
				    $("#lastNameErr").html( "" );
				    $("#lastNameErr").css("margin-bottom", "0px");
			}).trigger("change");
		}

		email = $('#email').val();
		if(checkEmail(email)==false) isValid = false;

		phone = $('#phone').val();
		if(checkPhoneNumber(phone)==false) isValid = false;

		address = $('#address').val();
		if(address==""){
			$("#address").change(function () {
				    $(this).css("border", "1px solid #EF4F32");
				    $("#addressErr").html( "Address should not be empty" );
				    $("#addressErr").css("margin-bottom", "10px");
			}).trigger("change");
			isValid = false;
		}else{
			$("#address").change(function () {
				    $(this).css("border", "1px solid #ccc");
				    $("#addressErr").html( "" );
				    $("#addressErr").css("margin-bottom", "0px");
			}).trigger("change");
		}

		city = $('#city').val();
		if(city==""){
			$("#city").change(function () {
				    $(this).css("border", "1px solid #EF4F32");
				    $("#cityErr").html( "City should not be empty" );
				    $("#cityErr").css("margin-bottom", "10px");
			}).trigger("change");
			isValid = false;
		}else{
			$("#city").change(function () {
				    $(this).css("border", "1px solid #ccc");
				    $("#cityErr").html( "" );
				    $("#cityErr").css("margin-bottom", "0px");
			}).trigger("change");
		}
		state = $('#state').val();
		if(state=="") isValid = false;

		zipcode = $('#zipcode').val();
		if(checkZipcode(zipcode)==false) isValid = false;


		if (isValid==true){
			$('#Name').html(firstName+" "+lastName);
			$('#Email').html(email);
			$('#Phone').html(phone);
			$('#Address').html(address+", "+city+", "+state+", "+zipcode);

			if(animating) return false;
			animating = true;
			
			current_fs = $(this).parent();
			next_fs = $(this).parent().next();
			
			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
			//show the next fieldset
			next_fs.show(); 
			//hide the current fieldset with style
			current_fs.animate({opacity: 0}, {
				step: function(now, mx) {
					//as the opacity of current_fs reduces to 0 - stored in "now"
					//1. scale current_fs down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_fs from the right(50%)
					left = (now * 50)+"%";
					//3. increase opacity of next_fs to 1 as it moves in
					opacity = 1 - now;
					current_fs.css({
		        'transform': 'scale('+scale+')',
		        'position': 'absolute'
		      });
					next_fs.css({'left': left, 'opacity': opacity});
				}, 
				duration: 800, 
				complete: function(){
					current_fs.hide();
					animating = false;
				}, 
				//this comes from the custom easing plugin
				easing: 'easeInOutBack'
			});
		}
	});

	//click on interview page next btn
	$(".second_page").click(function(){

		var isValid = true;
		interviewForm = $( "#interviewForm option:selected" ).text();
		if(interviewForm==" -- select one -- ") isValid = false;
		interviewDate = $('#interviewDate').val();
		if(interviewDate=="") isValid = false;
		interviewTime = $( "#interviewTime option:selected" ).text();
		if(interviewTime==" -- select a time slot-- ") isValid = false;


		if (isValid==true){
			$('#Interview').html(interviewDate+"  "+interviewTime+"   "+interviewForm);

			if(animating) return false;
			animating = true;
			
			current_fs = $(this).parent();
			next_fs = $(this).parent().next();
			
			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
			//show the next fieldset
			next_fs.show(); 
			//hide the current fieldset with style
			current_fs.animate({opacity: 0}, {
				step: function(now, mx) {
					//as the opacity of current_fs reduces to 0 - stored in "now"
					//1. scale current_fs down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_fs from the right(50%)
					left = (now * 50)+"%";
					//3. increase opacity of next_fs to 1 as it moves in
					opacity = 1 - now;
					current_fs.css({
		        'transform': 'scale('+scale+')',
		        'position': 'absolute'
		      });
					next_fs.css({'left': left, 'opacity': opacity});
				}, 
				duration: 800, 
				complete: function(){
					current_fs.hide();
					animating = false;
				}, 
				//this comes from the custom easing plugin
				easing: 'easeInOutBack'
			});
		}
	});

	//click on questions page next btn
	$(".third_page").click(function(){
		var isValid = true;


		reasons = $('#reasons').val();
		if(reasons=="") isValid = false;
		questions = $('#questions').val();
		

		if(isValid==true){
			$('#Reasons').html(reasons);
			$('#Questions').html(questions);

			if(animating) return false;
			animating = true;
			
			current_fs = $(this).parent();
			next_fs = $(this).parent().next();
			
			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
			
			//show the next fieldset
			next_fs.show(); 
			//hide the current fieldset with style
			current_fs.animate({opacity: 0}, {
				step: function(now, mx) {
					//as the opacity of current_fs reduces to 0 - stored in "now"
					//1. scale current_fs down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_fs from the right(50%)
					left = (now * 50)+"%";
					//3. increase opacity of next_fs to 1 as it moves in
					opacity = 1 - now;
					current_fs.css({
		        'transform': 'scale('+scale+')',
		        'position': 'absolute'
		      });
					next_fs.css({'left': left, 'opacity': opacity});
				}, 
				duration: 800, 
				complete: function(){
					current_fs.hide();
					animating = false;
				}, 
				//this comes from the custom easing plugin
				easing: 'easeInOutBack'
			});
		}
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});
	/****************Reference End****************/

	$(".submit").click(function(){
		window.location.href='./confirmation_page.html';
		return false;
	})
});

function selectPet(petID) {
	document.getElementByID(petID).style.color = blue
	console.log("jo")
}