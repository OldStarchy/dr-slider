import { Slider } from './Slider';
import { SliderOptions } from './SliderOptionSet';

interface JQuerySliderPlugin {
	slider(optionsOrData: SliderOptions | 'data'): JQuery | Slider;
}

interface JQueryStaticSliderPlugin {

	/**
	 * Set default settings used by new slider instances
	 * @param defaults
	 */
	slider(defaults: SliderOptions): void;
}

declare global {
	interface JQuery extends JQuerySliderPlugin {}
	interface JQueryStatic extends JQueryStaticSliderPlugin {}
	interface Window {
		Slider: typeof Slider;
	}
}

const jqueryPlugin: JQuerySliderPlugin = {
	slider(
		this: JQuery<HTMLElement>,
		optionsOrData: SliderOptions | 'data'
	): JQuery | Slider {
		if (optionsOrData == 'data') return this.data('slider');

		this.each(function() {
			$(this).data('slider', new Slider(this, optionsOrData));
		});

		return this;
	},
};

const jqueryStaticPlugin: JQueryStaticSliderPlugin = {
	slider(defaults: SliderOptions) {
		$.extend(Slider.defaultOptions, defaults);
	},
};

$.fn.extend(jqueryPlugin);
$.extend($, jqueryStaticPlugin);


window.Slider = Slider;
