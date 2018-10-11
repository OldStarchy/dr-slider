export abstract class Sequencer {
	public abstract getNext(current: number, length: number): number;
	public abstract getPrev(current: number, length: number): number;

	public getOffset(current: number, offset: number, legnth: number): number {
		if (offset > 0) {
			while (offset-- > 0) {
				current = this.getNext(current, length);
			}
		} else {
			while (offset++ < 0) {
				current = this.getPrev(current, length);
			}
		}

		return current;
	}
}

import './Sequencer/LoopSequencer';
import './Sequencer/PingPongSequencer';
