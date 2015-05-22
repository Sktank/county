$(document).ready(function(){
	var header = "#about-dropdown";

	function hideDropdown(name) {
		//console.log(name);
		$(name + ' .dropdown-menu').first().css('display', 'none');
	}

	function showDropdown(name) {
		//console.log(name);
		$(name + ' .dropdown-menu').first().css('display', 'inline');
	}

	function configDropdown(name) {
		//console.log (name);
		$(name)
		  .mouseover(function() {showDropdown(name)})
		  .mouseout(function() {hideDropdown(name)})
		  .focusin(function() {showDropdown(name)})
		  .focusout(function() {hideDropdown(name)});
	}


	function hideDropdownSide(name) {
		//console.log(name);
		$(name + ' .dropdown-menu').first().css('display', 'none');
		$("#borrower-application-popout").removeClass("active");
	}

	function showDropdownSide(name) {
		//console.log(name);
		$(name + ' .dropdown-menu').first().css('display', 'inline');
		$("#borrower-application-popout").addClass("active");
	}

	function configSidedown(name) {
		//console.log (name);
		$(name)
		  .mouseover(function() {showDropdownSide(name+"-side")})
		  .mouseout(function() {hideDropdownSide(name+"-side")})
		  .focusin(function() {showDropdown(name+"-side")})
		  .focusout(function() {hideDropdown(name+"-side")});
	}

	var header = "#about-dropdown";
	configDropdown(header);
	header = "#borrowers-dropdown";
	configDropdown(header);
	header = "#brokers-dropdown";
	configDropdown(header);
	header = "#resources-dropdown";
	configDropdown(header);
	header = "#application-resources-dropdown";
	configSidedown(header);
});