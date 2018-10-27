import { LoopSequencer } from './Sequencer/LoopSequencer';
import { PingPongSequencer } from './Sequencer/PingPongSequencer';
import { Slider } from './Slider';
import { SliderPluginConstructor } from './SliderOptionSet';
import { SliderPlugin } from './SliderPlugin';

declare global {
	interface JQuerySliderPlugin {
		slider(this: JQuery<HTMLElement>, data: 'data'): Slider | undefined;
		slider(this: JQuery<HTMLElement>, options?: SliderOptions): JQuery<HTMLElement>;
		// slider(this: JQuery<HTMLElement>, optionsOrData?: SliderOptions | 'data'): JQuery<HTMLElement> | Slider | undefined;
	}

	interface JQueryStaticSliderPlugin {
		/**
		 * Set default settings used by new slider instances
		 * @param defaults
		 */
		slider(defaults: SliderOptions): void;
		/**
		 * Adds a plugin to be used in any new sliders
		 */
		slider<T extends {}>(plugin: SliderPluginConstructor): void;
		// slider<T extends {}>(pluginOrDefaults: SliderOptions | SliderPlugin<T>): void;
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
	slider(pluginOrDefaults: SliderOptions | SliderPluginConstructor) {
		if (typeof pluginOrDefaults === 'function') {
			Slider.defaultPlugins.push(pluginOrDefaults);
		} else {
			$.extend(Slider.defaultOptions, pluginOrDefaults);
		}
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
