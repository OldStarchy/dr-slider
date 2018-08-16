import {SliderOptionSet, SliderOptions} from './SliderOptionSet';

export class Slider {
	private static instanceUID = 0;

	public readonly instanceUID: number;
	private readonly $element: JQuery<HTMLElement>;

	private readonly options: SliderOptionSet;

	public constructor(element: HTMLElement, options?: SliderOptions) {
		//TODO: Do we need this instance ID?
		this.instanceUID = Slider.instanceUID++;

		this.options = $.extend({}, Slider.defaultOptions, options);

		this.$element = $(element);

		this.init();
	}

	private init() {
		this.attachClasses(true);
	}

	private attachClasses(attach: boolean) {
		this.$element
			.toggleClass(this.options.classPrefix + 'slider', attach);
		this.$element.find(this.options.slideSelector)
			.toggleClass(this.options.classPrefix + 'slide', attach);
	}
}

export namespace Slider {
	export const defaultOptions: SliderOptionSet = {
		slideSelector: '> *',
		classPrefix: 'slider-',
	}
}