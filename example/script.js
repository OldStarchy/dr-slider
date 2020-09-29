//@ts-check
/// <reference path="../lib/slider.d.ts" />

$(function() {
	$('.slider').slider({
		autoplay: true,
		autoplayDwell: 8000,
		responsive: [
			{
				maxWidth: 500,
				options: {
					autoplay: false,
				},
			},
			{
				maxWidth: 600,
				options: {
					autoplayDwell: 2000,
				},
			},
		],
	});

	window.s = $('.slider').slider('data');
});
