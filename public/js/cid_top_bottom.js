// JavaScript Document
$(document).ready(function(){	
	
	$(".mob-menu").click(function() {
	  $("#menu").addClass("open");
	});
	
	$(".close").click(function() {
	  $("#menu").removeClass("open");
	});
	
	$(".mob-menu").click(function () {
	    $("#menu,.page_cover,html").addClass("open");
	    window.location.hash = "#open"; 
	});
	
	window.onhashchange = function () {
	    if (location.hash != "#open") { 
	        $("#menu,.page_cover,html").removeClass("open");
	    }
	};
	
});


$(document).ready(function(){
	
	$("#tab-menu2-contents").hide();
	$(".tab-menu1").addClass("tab-menu-select");
	
	$(".tab-menu1").click(function() {
		$(".tab-menu1").addClass("tab-menu-select");
		$(".tab-menu2").removeClass("tab-menu-select");
		$("#tab-menu1-contents").show();
		$("#tab-menu2-contents").hide();
	});

	$(".tab-menu2").click(function() {
		$(".tab-menu1").removeClass("tab-menu-select");
		$(".tab-menu2").addClass("tab-menu-select");
		$("#tab-menu2-contents").show();
		$("#tab-menu1-contents").hide();
	});

});

/*
$(document).ready(function(){
    $(".contents_menu").click(function(){
        $(".contents_sub_menu").slideToggle();
    });
});
*/