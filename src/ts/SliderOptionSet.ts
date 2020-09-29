import { Slider } from './Slider';
import { SliderPlugin } from './SliderPlugin';

export type SliderPluginConstructor = new (slider: Slider, options: any) => SliderPlugin<any>;

/**
 * The core set of options for a slider.
 */
export interface SliderCoreOptionSet {
	/**
	 * The selector used to find slides within a slider. Defaults to '> *'
	 */
	slideSelector: string;
	/**
	 * A prefix for all dynamic classes added to elements. Defaults to 'slider-'
	 */
	classPrefix: string;
	/**
	 * The direction of the slider, either 'horizontal' or 'vertical'. Defaults to 'horizontal'
	 */
	direction: 'horizontal' | 'vertical';
	/**
	 * A function to transition between two slides. It is called with the arguments (from: number, to: number, step:number)
	 * from is the index of the initial slide.
	 * to is the index of the new slide.
	 * step is a number between 0 and 1 indicating how far through the transition the animation should be.
	 *
	 * This property is currently not implemented
	 * TODO: this
	 */
	transition: (this: Slider, from: number, to: number, step: number) => void;
	/**
	 * The first slide to show.
	 */
	startIndex: number;
	/**
	 * An array of plugins to use for this slider.
	 * The default is any plugins that have currently been added to the default list with $.slider(pluginType);
	 */
	plugins: SliderPluginConstructor[];

	responsive?: Array<{
		maxWidth: number;
		options: SliderOptionsNoResponsive;
	}>;
}

export type SliderOptionsNoResponsive = Pick<SliderOptions, Exclude<keyof SliderOptions, 'responsive'>>;
declare global {
	/**
	 * The full set of options available for a slider. This interface is merged when other plugins are included in the project.
	 */
	interface SliderOptionSet extends SliderCoreOptionSet {}

	type SliderOptions = Partial<SliderOptionSet>;
}

// Options copied from slick

// accessibility: boolean;
// adaptiveHeight: boolean;
// appendArrows: JQuery;
// appendDots: JQuery;
// arrows: boolean;
// asNavFor: null;
// prevArrow: string;
// nextArrow: string;
// centerMode: boolean;
// centerPadding: string;
// cssEase: string;
// customPaging: (slider: Slider, i: number) => string;
// dots: boolean;
// dotsClass: string;
// draggable: boolean;
// easing: string;
// edgeFriction: number;
// fade: boolean;
// focusOnSelect: boolean;
// focusOnChange: boolean;
// infinite: boolean;
// initialSlide: number;
// lazyLoad: string;
// mobileFirst: boolean;
// pauseOnHover: boolean;
// pauseOnFocus: boolean;
// pauseOnDotsHover: boolean;
// respondTo: string;
// responsive: null | Array<{ breakpoint: number; settings: SliderOptions }>;
// rows: number;
// rtl: boolean;
// slide: string;
// slidesPerRow: number;
// slidesToShow: number;
// slidesToScroll: number;
// speed: number;
// swipe: boolean;
// swipeToSlide: boolean;
// touchMove: boolean;
// touchThreshold: number;
// useCSS: boolean;
// useTransform: boolean;
// variableWidth: boolean;
// vertical: boolean;
// verticalSwiping: boolean;
// waitForAnimate: boolean;
// zIndex: number;
// }
