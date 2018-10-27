import { LoopSequencer } from './Sequencer/LoopSequencer';
import { SliderPluginConstructor } from './SliderOptionSet';
import { SliderPlugin } from './SliderPlugin';

interface SliderChangeEventData {
	newIndex: number;
	previousIndex: number;
}
export class Slider {
	public static defaultOptions: SliderCoreOptionSet = {
		classPrefix: 'slider-',
		direction: 'horizontal',
		plugins: [],
		sequencer: new LoopSequencer(),
		slideSelector: '> *',
		transition(this: Slider, from: number, to: number, step: number) {
			this.$children.first().css('margin-left', step);
		},
	};

	public static defaultPlugins: SliderPluginConstructor[] = [];

	private static instanceUID = 0;

	public readonly instanceUID: number;
	private effectiveOptionsIndex = -2;
	private readonly $element: JQuery<HTMLElement>;
	private readonly $children: JQuery<HTMLElement>;
	private $tracks?: JQuery<HTMLElement>;

	private options: SliderCoreOptionSet & SliderOptions;
	private effectiveOptions!: Pick<SliderCoreOptionSet & SliderOptions, Exclude<keyof SliderOptions, 'responsive'>>;

	private lastIndex: number = 0;
	private currentLeft: number = 0;

	private plugins: Array<SliderPlugin<any>> = [];

	public constructor(element: HTMLElement, options?: SliderOptions) {
		// TODO: Do we need this instance ID?
		this.instanceUID = Slider.instanceUID++;

		if (!options) {
			options = {};
		}

		if (options.sequencer === undefined) {
			options.sequencer = new LoopSequencer();
		}

		this.options = $.extend({}, Slider.defaultOptions, options);

		this.updateEffectiveOptions();

		this.lastIndex = this.options.sequencer.index;

		this.$element = $(element);
		this.$children = this.$element.find(this.options.slideSelector);

		for (const pluginConstructor of Slider.defaultPlugins) {
			this.plugins.push(new pluginConstructor(this, this.effectiveOptions));
		}

		for (const pluginConstructor of this.options.plugins) {
			this.plugins.push(new pluginConstructor(this, this.effectiveOptions));
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

	public removePlugin(plugin: SliderPlugin<any>) {
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
		const currentIndex = this.lastIndex;
		this.lastIndex = index;

		this.getSlide(currentIndex).removeClass(this.options.classPrefix + 'current');

		// TODO: Pass next index into event
		$(this).trigger('slider.change.before', {
			newIndex: index,
			previousIndex: currentIndex,
		});

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
						previousIndex: currentIndex,
					});
				},
			},
		);
	}

	public setOptions(options: SliderOptions) {
		this.options = $.extend({}, this.options, options);

		this.effectiveOptionsChanged();
	}

	public setOption<T extends keyof SliderOptionSet>(option: T, value: SliderOptionSet[T]) {
		this.options[option] = value;

		this.effectiveOptionsChanged();
	}

	public getSlide(index?: number) {
		if (index === undefined) {
			index = this.options.sequencer.index;
		}

		return $(this.$children.get(index));
	}

	public gotoNext() {
		this.gotoSlide(this.options.sequencer.moveNext(this.$children.length));
	}

	public gotoPrev() {
		this.gotoSlide(this.options.sequencer.movePrev(this.$children.length));
	}

	public gotoOffset(offset: number) {
		this.gotoSlide(this.options.sequencer.moveOffset(offset, this.$children.length));
	}

	public getSlideIndex(offset?: number) {
		if (offset === undefined) {
			return this.options.sequencer.index;
		}

		return this.options.sequencer.peekOffset(offset, this.$children.length);
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

	private effectiveOptionsChanged() {
		this.foreachPlugin(plugin => plugin.optionsUpdated(this.effectiveOptions));
	}

	private foreachPlugin(callback: (plugin: SliderPlugin<any>) => void): void {
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
		$(window).on('resize', () => {
			this.updateEffectiveOptions();
		});
	}

	private updateEffectiveOptions() {
		const width = $(window).width();
		if (width === undefined) {
			return;
		}

		if (this.options.responsive) {
			for (let i = 0; i < this.options.responsive.length; i++) {
				const responsive = this.options.responsive[i];

				if (width <= responsive.maxWidth) {
					if (this.effectiveOptionsIndex !== i) {
						this.effectiveOptions = $.extend({}, Slider.defaultOptions, this.options, responsive.options);
						this.effectiveOptionsChanged();
						this.effectiveOptionsIndex = i;
					}
					return;
				}
			}
		}
		if (this.effectiveOptionsIndex !== -1) {
			this.effectiveOptions = $.extend({}, Slider.defaultOptions, this.options);
			this.effectiveOptionsChanged();
			this.effectiveOptionsIndex = -1;
		}
	}

	private attachClasses(attach: boolean) {
		this.$element.toggleClass(this.options.classPrefix + 'slider', attach);
		this.$children.toggleClass(this.options.classPrefix + 'slide', attach);
	}
}
