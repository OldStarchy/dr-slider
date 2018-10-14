import { Slider } from './Slider';

export abstract class SliderPlugin {
	public constructor(protected slider: Slider, protected options: SliderOptionSet) {}
	public init?(): void;
}
