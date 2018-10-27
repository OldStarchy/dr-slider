import { LoopSequencer } from './Sequencer/LoopSequencer';
import { PingPongSequencer } from './Sequencer/PingPongSequencer';
import { Slider } from './Slider';
import { SliderPlugin } from './SliderPlugin';

declare global {
	interface JQuerySliderPlugin {
		slider(this: JQuery<HTMLElement>, data: 'data'): Slider | undefined;
		slider(this: JQuery<HTMLElement>, options?: SliderOptions): JQuery<HTMLElement>;
		slider(this: JQuery<HTMLElement>, optionsOrData?: SliderOptions | 'data'): JQuery<HTMLElement> | Slider | undefined;
	}

	interface JQueryStaticSliderPlugin {
		/**
		 * Set default settings used by new slider instances
		 * @param defaults
		 */
		slider(defaults: SliderOptions): void;
	}

	/* tslint:disable:no-empty-interface */
	interface JQuery extends JQuerySliderPlugin {}
	interface JQueryStatic extends JQueryStaticSliderPlugin {}
	/* tslint:enable:no-empty-interface */

	interface DrSliderExports {
		LoopSequencer: typeof LoopSequencer;
		PingPongSequencer: typeof PingPongSequencer;
		Slider: typeof Slider;
		SliderPlugin: typeof SliderPlugin;
	}

	interface Window {
		DrSlider: DrSliderExports;
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

window.DrSlider = {
	LoopSequencer,
	PingPongSequencer,
	Slider,
	SliderPlugin,
};
