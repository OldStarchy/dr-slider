import {SliderOptions, SliderOptionSet} from './SliderOptionSet';

export class Slider {
	public static defaultOptions: SliderOptionSet = {
		classPrefix: 'slider-',
		direction: 'horizontal',
		slideSelector: '> *',
		transition: function(this: Slider, from: number, to: number, step: number) {
			this.children().first().css('margin-left', step);
		}
	};

	private static instanceUID = 0;

	public readonly instanceUID: number;
	private readonly $element: JQuery<HTMLElement>;

	private readonly options: SliderOptionSet;

	public constructor(element: HTMLElement, options?: SliderOptions) {
		// TODO: Do we need this instance ID?
		this.instanceUID = Slider.instanceUID++;

		this.options = $.extend({}, Slider.defaultOptions, options);

		this.$element = $(element);

		this.init();
	}

	private init() {
		this.attachClasses(true);
	}

	private children() {
		return this.$element.find(this.options.slideSelector);
	}

	private attachClasses(attach: boolean) {
		this.$element
			.toggleClass(this.options.classPrefix + 'slider', attach);
		this.children()
			.toggleClass(this.options.classPrefix + 'slide', attach);
	}

	public getSlideOffset(index: number) {
		const offset = $(this.$element.find(this.options.slideSelector).get(index)).offset();

		if (offset) {
			switch (this.options.direction)
			{
				case "horizontal":
				return offset.left;
				case "vertical":
				return offset.top;
			}
		}
		return undefined;
	}

	public test() {
		for (let i = 0; i < this.children().length; i++)
			console.log(this.getSlideOffset(i));
	}
}
