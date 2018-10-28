import { Slider } from './Slider';
import { SliderCoreOptionSet } from './SliderOptionSet';

export abstract class SliderPlugin<TPluginOptionSet extends {}> {
	public constructor(protected slider: Slider, protected options: SliderCoreOptionSet & TPluginOptionSet) {}
	public init?(): void;
	public optionsUpdated(options: SliderCoreOptionSet & TPluginOptionSet) {
		this.options = options;
	}
}
