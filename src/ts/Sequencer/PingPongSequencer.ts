import { Sequencer } from '../Sequencer';

export namespace Slider {
	export class PingPongSequencer extends Sequencer {
		public forward = true;

		public getNext(current: number, length: number) {
			return (current + 1) % length;
		}

		public getPrev(current: number, length: number) {
			return (current - 1 + length) % length;
		}
	}
}
