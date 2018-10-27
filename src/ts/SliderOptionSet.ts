import { Sequencer } from './Sequencer';
import { Slider } from './Slider';
import { SliderPlugin } from './SliderPlugin';

export type SliderPluginConstructor = new (slider: Slider, options: any) => SliderPlugin<any>;

declare global {
	interface SliderCoreOptionSet {
		slideSelector: string;
		classPrefix: string;
		direction: 'horizontal' | 'vertical';
		transition: (this: Slider, from: number, to: number, step: number) => void;
		sequencer: Sequencer;
		plugins: SliderPluginConstructor[];
	}

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
