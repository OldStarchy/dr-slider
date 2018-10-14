/// <reference path="../lib/slider.d.ts" />

$(function() {
	$('.slider').slider({
		autoplay: true,
		autoplayDwell: 1000,
	});

	window.s = $('.slider').slider('data');
});
