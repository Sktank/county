$(document).ready(function(){
	var header = "#about-dropdown";

	function hideDropdown(name) {
		$(name + ' .dropdown-menu').css('display', 'none');
	}

	function showDropdown(name) {
		$(name + ' .dropdown-menu').css('display', 'inline');
	}

	function configDropdown(name) {
		console.log (name);
		$(name)
		  .mouseover(function() {showDropdown(name)})
		  .mouseout(function() {hideDropdown(name)});
	}

	var header = "#about-dropdown";
	configDropdown(header);
	header = "#borrowers-dropdown";
	configDropdown(header);
	header = "#brokers-dropdown";
	configDropdown(header);
	header = "#resources-dropdown";
	configDropdown(header);

});