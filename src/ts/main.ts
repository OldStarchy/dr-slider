import { Slider } from './Slider';
import { SliderOptions } from './SliderOptionSet';

export interface JQuerySliderPlugin {
	slider(this: JQuery<HTMLElement>, data: 'data'): Slider;
	slider(this: JQuery<HTMLElement>, options?: SliderOptions): JQuery<HTMLElement>;
	slider(this: JQuery<HTMLElement>, optionsOrData?: SliderOptions | 'data'): JQuery<HTMLElement> | Slider;
}

export interface JQueryStaticSliderPlugin {
	/**
	 * Set default settings used by new slider instances
	 * @param defaults
	 */
	slider(defaults: SliderOptions): void;
}

declare global {
	/* tslint:disable:no-empty-interface */
	interface JQuery extends JQuerySliderPlugin {}
	interface JQueryStatic extends JQueryStaticSliderPlugin {}
	/* tslint:enable:no-empty-interface */
	interface Window {
		Slider: typeof Slider;
	}
}

const jqueryPlugin: JQuerySliderPlugin = {
	slider(this: JQuery<HTMLElement>, optionsOrData?: SliderOptions | 'data'): any {
		if (optionsOrData === 'data') {
			return this.data('slider') as Slider;
		}

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
