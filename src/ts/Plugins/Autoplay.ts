import { Slider } from '../Slider';
import { SliderPlugin } from '../SliderPlugin';

export class Autoplay extends SliderPlugin {
	private static defaultOptions: AutoplayOptions = {
		autoplay: false,
		pauseOnHover: true,
		timeout: 3000,
	};

	private timeoutId: number | null = null;

	public constructor(slider: Slider, options: SliderOptionSet) {
		super(slider, $.extend({}, Autoplay.defaultOptions, options));
	}

	public init(): void {
		this.slider.getElement().on('mouseover', this.mouseover.bind(this));
		this.slider.getElement().on('mouseout', this.mouseout.bind(this));
		this.slider.on('slider.change.before', () => {
			if (this.options.autoplay) {
				this.startTimeout();
			}
		});

		if (this.options.autoplay) {
			this.startTimeout();
		}
	}

	private mouseover() {
		this.stopTimeout();
	}

	private mouseout() {
		if (this.options.autoplay) {
			this.startTimeout();
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

		let timeoutOrNull: number | null;

		if (typeof this.options.timeout === 'number') {
			timeoutOrNull = this.options.timeout;
		} else if (this.options.timeout) {
			timeoutOrNull = this.options.timeout(this.slider.getSlideIndex(1));
		} else {
			timeoutOrNull = null;
		}

		if (timeoutOrNull) {
			this.timeoutId = window.setTimeout(() => {
				this.timeoutId = null;
				this.slider.gotoNext();
			}, timeoutOrNull);
		}
	}
}

declare global {
	interface AutoplayOptions {
		/**
		 * Enable autoplay
		 */
		autoplay: boolean;
		/**
		 * Pause the slider while the user is hovering
		 */
		pauseOnHover: boolean;
		/**
		 * Time in milliseconds before advancing
		 */
		timeout: number | ((slideIndex: number) => number | null);
	}

	// tslint:disable-next-line
	interface SliderOptionSet extends Partial<AutoplayOptions> {}
}
