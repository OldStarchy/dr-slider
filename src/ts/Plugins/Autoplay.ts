import { Slider } from '../Slider';
import { SliderPlugin } from '../SliderPlugin';

export class Autoplay extends SliderPlugin<AutoplayOptionSet> {
	private static defaultOptions: AutoplayOptionSet = {
		autoplay: false,
		autoplayDwell: 3000,
		pauseOnHover: true,
	};

	private timeoutId: number | null = null;
	private waitingForPromise: boolean = false;

	public constructor(slider: Slider, options: AutoplayOptions) {
		super(slider, $.extend({}, Autoplay.defaultOptions, options));
	}

	public init(): void {
		this.slider.getElement().on('mouseover', this.stopTimeout.bind(this));
		this.slider.getElement().on('mouseout', this.maybeStartTimeout.bind(this));
		this.slider.on('slider.change.after', this.maybeStartTimeout.bind(this));

		this.maybeStartTimeout();
	}

	public optionsUpdated(options: AutoplayOptions) {
		const oldOptions = this.options;
		super.optionsUpdated($.extend({}, Autoplay.defaultOptions, this.options, options));

		if (!oldOptions.autoplay) {
			this.maybeStartTimeout();
		}
	}

	private maybeStartTimeout() {
		if (this.options.autoplay && !this.waitingForPromise) {
			this.startTimeout();
		}
	}

	private maybeGotoNext() {
		if (this.options.autoplay) {
			this.slider.gotoNext();
		}
	}

	private stopTimeout() {
		if (this.timeoutId !== null) {
			window.clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	private startTimeout() {
		this.stopTimeout();

		const option = this.options.autoplayDwell;

		let dwellOrNull: number | null = null;

		switch (typeof option) {
			case 'number':
				dwellOrNull = option;
				break;

			case 'function':
				const index = this.slider.getSlideIndex();
				const result = option(index, this.slider.getSlide(index));

				if (typeof result === 'number') {
					dwellOrNull = result;
				} else if (result !== null) {
					this.waitingForPromise = true;
					result.then(
						() => {
							this.waitingForPromise = false;
							this.maybeGotoNext();
						},
						() => {
							this.waitingForPromise = false;
						},
					);
					dwellOrNull = null;
				}
				break;
		}

		if (dwellOrNull !== null) {
			this.timeoutId = window.setTimeout(() => {
				this.timeoutId = null;
				this.maybeGotoNext();
			}, dwellOrNull);
		}
	}
}

declare global {
	interface AutoplayOptionSet {
		/**
		 * Enable autoplay
		 */
		autoplay: boolean;
		/**
		 * Time in milliseconds before advancing
		 */
		autoplayDwell: number | ((slideIndex: number, slide: JQuery<HTMLElement>) => number | PromiseLike<any> | null);
		/**
		 * Pause the slider while the user is hovering
		 */
		pauseOnHover: boolean;
	}

	type AutoplayOptions = Partial<AutoplayOptionSet>;

	// tslint:disable-next-line
	interface SliderOptionSet extends AutoplayOptionSet {}
}
