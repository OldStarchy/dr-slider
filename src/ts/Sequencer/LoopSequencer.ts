import { Sequencer } from '../Sequencer';

export class LoopSequencer extends Sequencer {
	public peekNext(length: number) {
		return (this.index + 1) % length;
	}

	public peekPrev(length: number) {
		return (this.index - 1 + length) % length;
	}

	public peekOffset(offset: number, length: number) {
		return (((this.index + offset) % length) + length) % length;
	}
}
