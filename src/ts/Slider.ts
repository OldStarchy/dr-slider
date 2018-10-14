import { Autoplay } from './Plugins/Autoplay';
import { LoopSequencer } from './Sequencer/LoopSequencer';
import { SliderPlugin } from './SliderPlugin';

interface SliderChangeEventData {
	newIndex: number;
	previousIndex: number;
}
export class Slider {
	public static defaultOptions: SliderOptionSet = {
		classPrefix: 'slider-',
		direction: 'horizontal',
		plugins: [],
		sequencer: new LoopSequencer(),
		slideSelector: '> *',
		transition(this: Slider, from: number, to: number, step: number) {
			this.$children.first().css('margin-left', step);
		},
	};

	public static defaultPlugins: Array<new (slider: Slider, options: SliderOptionSet) => SliderPlugin> = [Autoplay];

	private static instanceUID = 0;

	public readonly instanceUID: number;
	private readonly $element: JQuery<HTMLElement>;
	private readonly $children: JQuery<HTMLElement>;
	private $tracks?: JQuery<HTMLElement>;

	private options: SliderOptionSet;

	private currentLeft: number = 0;
	private currentIndex: number = 0;

	private plugins: SliderPlugin[] = [];

	public constructor(element: HTMLElement, options?: SliderOptions) {
		// TODO: Do we need this instance ID?
		this.instanceUID = Slider.instanceUID++;

		this.options = $.extend({}, Slider.defaultOptions, options);

		this.$element = $(element);
		this.$children = this.$element.find(this.options.slideSelector);

		for (const pluginConstructor of Slider.defaultPlugins) {
			this.plugins.push(new pluginConstructor(this, this.options));
		}

		for (const pluginConstructor of this.options.plugins) {
			this.plugins.push(new pluginConstructor(this, this.options));
		}

		this.init();

		this.foreachPlugin(plugin => {
			if (plugin.init) {
				plugin.init();
			}
		});
	}

	public getElement() {
		return this.$element;
	}

	public removePlugin(plugin: SliderPlugin) {
		// TODO: this
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
		this.getSlide(this.currentIndex).removeClass(this.options.classPrefix + 'current');

		// TODO: Pass next index into event
		$(this).trigger('slider.change.before', {
			newIndex: index,
			previousIndex: this.currentIndex,
		});

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
				always() {
					this.getSlide().addClass(this.options.classPrefix + 'current');
					$(this).trigger('slider.change.after', {
						newIndex: index,
						previousIndex: this.currentIndex,
					});
				},
			},
		);
	}

	public updateOptions(options: SliderOptions) {
		this.options = $.extend({}, this.options, options);

		this.foreachPlugin(plugin => plugin.optionsUpdated(this.options));
	}

	public getSlide(index?: number) {
		if (index === undefined) {
			index = this.currentIndex;
		}

		return $(this.$children.get(index));
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

	public getSlideIndex(offset?: number) {
		if (offset === undefined) {
			return this.currentIndex;
		}

		return this.options.sequencer.getOffset(this.currentIndex, offset, this.$children.length);
	}

	public test() {
		for (let i = 0; i < this.$children.length; i++) {
			console.log(this.getSlideLeft(i));
		}
	}

	public on(
		eventType: 'slider.change.before' | 'slider.change.after',
		handler: JQuery.EventHandler<Slider, SliderChangeEventData>,
	): this;
	public on(eventType: string, handler: JQuery.EventHandler<Slider, any>): this {
		$(this).on(eventType, handler);
		return this;
	}

	public off(eventType: string, handler: JQuery.EventHandler<Slider, any>) {
		$(this).off(eventType, handler);
	}

	private foreachPlugin(callback: (plugin: SliderPlugin) => void): void {
		for (const plugin of this.plugins) {
			try {
				callback(plugin);
			} catch (error) {
				console.error('Error in slider plugin');
				console.error(error);
			}
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
