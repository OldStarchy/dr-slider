import { SliderOptions, SliderOptionSet } from './SliderOptionSet';

export class Slider {
	public static defaultOptions: SliderOptionSet = {
		classPrefix: 'slider-',
		direction: 'horizontal',
		slideSelector: '> *',
		transition(this: Slider, from: number, to: number, step: number) {
			this.$children.first().css('margin-left', step);
		},
	};

	private static instanceUID = 0;

	public readonly instanceUID: number;
	private readonly $element: JQuery<HTMLElement>;
	private readonly $children: JQuery<HTMLElement>;

	private readonly options: SliderOptionSet;

	public constructor(element: HTMLElement, options?: SliderOptions) {
		// TODO: Do we need this instance ID?
		this.instanceUID = Slider.instanceUID++;

		this.options = $.extend({}, Slider.defaultOptions, options);

		this.$element = $(element);
		this.$children = this.$element.find(this.options.slideSelector);

		this.init();
	}

	public getSlideOffset(index: number) {
		const offset = $(this.$element.find(this.options.slideSelector).get(index)).offset();

		if (offset) {
			switch (this.options.direction) {
				case 'horizontal':
					return offset.left;
				case 'vertical':
					return offset.top;
			}
		}
		return undefined;
	}

	public test() {
		for (let i = 0; i < this.$children.length; i++) {
			console.log(this.getSlideOffset(i));
		}
	}

	private init() {
		const inner = $('<div>').addClass(this.options.classPrefix + 'track');
		inner.append(this.$children);
		this.$element.append(inner);
		this.attachClasses(true);
	}

	private attachClasses(attach: boolean) {
		this.$element.toggleClass(this.options.classPrefix + 'slider', attach);
		this.$children.toggleClass(this.options.classPrefix + 'slide', attach);
	}
}
