import { Slider } from './Slider';

export abstract class SliderPlugin<TPluginOptionSet extends {}> {
	public constructor(protected slider: Slider, protected options: TPluginOptionSet) {}
	public init?(): void;
	public optionsUpdated(options: TPluginOptionSet) {
		this.options = options;
	}
}
