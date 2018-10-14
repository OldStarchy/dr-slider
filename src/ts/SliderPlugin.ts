import { Slider } from './Slider';

export abstract class SliderPlugin {
	public constructor(protected slider: Slider, protected options: SliderOptionSet) {}
	public init?(): void;
	public optionsUpdated(options: SliderOptionSet) {
		this.options = options;
	}
}
