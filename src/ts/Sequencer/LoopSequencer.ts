import { Sequencer } from '../Sequencer';

export class LoopSequencer extends Sequencer {
	public getNext(current: number, length: number) {
		return (current + 1) % length;
	}

	public getPrev(current: number, length: number) {
		return (current - 1 + length) % length;
	}

	public getOffset(current: number, offset: number, length: number) {
		return (((current + offset) % length) + length) % length;
	}
}

declare global {
	interface Window {
		LoopSequencer: typeof LoopSequencer;
	}
}

window.LoopSequencer = LoopSequencer;
