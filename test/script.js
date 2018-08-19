/// <reference path="../lib/slider.d.ts" />

$(function() {
	$('.slider').slider();
	var slider = $('.slider').slider('data');

	slider.test();
});
