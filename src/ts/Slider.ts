import { LoopSenquencer } from './Sequencer/LoopSequencer';
import { SliderOptions, SliderOptionSet } from './SliderOptionSet';

export class Slider {
	public static defaultOptions: SliderOptionSet = {
		classPrefix: 'slider-',
		direction: 'horizontal',
		sequencer: new LoopSenquencer(),
		slideSelector: '> *',
		transition(this: Slider, from: number, to: number, step: number) {
			this.$children.first().css('margin-left', step);
		},
	};

	private static instanceUID = 0;

	public readonly instanceUID: number;
	private readonly $element: JQuery<HTMLElement>;
	private readonly $children: JQuery<HTMLElement>;
	private $tracks?: JQuery<HTMLElement>;

	private readonly options: SliderOptionSet;

	private currentLeft: number = 0;
	private currentIndex: number = 0;

	public constructor(element: HTMLElement, options?: SliderOptions) {
		// TODO: Do we need this instance ID?
		this.instanceUID = Slider.instanceUID++;

		this.options = $.extend({}, Slider.defaultOptions, options);

		this.$element = $(element);
		this.$children = this.$element.find(this.options.slideSelector);

		this.init();
	}

	public getSlideLeft(index: number) {
		if (index < this.$children.length) {
			const firstChild = $(this.$children.get(0));
			const indexChild = $(this.$children.get(index));

			return indexChild.offset()!.left - firstChild.offset()!.left + parseFloat(indexChild.css('margin-left'));
		}

		return undefined;
	}

	public gotoSlide(index: number) {
		this.currentIndex = index;
		const left = this.getSlideLeft(index);
		if (left === undefined) {
			return;
		}

		$(this).animate(
			{
				currentLeft: left,
			},
			{
				step() {
					this.$tracks!.css('transform', 'translateX(' + -this.currentLeft + 'px)');
				},
			},
		);
	}

	public gotoNext() {
		this.gotoSlide(this.options.sequencer.getNext(this.currentIndex, this.$children.length));
	}

	public gotoPrev() {
		this.gotoSlide(this.options.sequencer.getPrev(this.currentIndex, this.$children.length));
	}

	public gotoOffset(offset: number) {
		this.gotoSlide(this.options.sequencer.getOffset(this.currentIndex, offset, this.$children.length));
	}

	public test() {
		for (let i = 0; i < this.$children.length; i++) {
			console.log(this.getSlideLeft(i));
		}
	}

	private init() {
		const inner = $('<div>').addClass(this.options.classPrefix + 'track');
		inner.append(this.$children);
		this.$element.append(inner);
		this.attachClasses(true);
		this.$tracks = inner;
	}

	private attachClasses(attach: boolean) {
		this.$element.toggleClass(this.options.classPrefix + 'slider', attach);
		this.$children.toggleClass(this.options.classPrefix + 'slide', attach);
	}
}
