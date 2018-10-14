import { Sequencer } from '../Sequencer';

export class PingPongSequencer extends Sequencer {
	public forward = true;

	public getNext(current: number, length: number) {
		if (this.forward && current === length - 1) {
			this.forward = false;
		} else if (current === 0) {
			this.forward = true;
		}

		const offset = this.forward ? 1 : -1;
		return (((current + offset) % length) + length) % length;
	}

	public getPrev(current: number, length: number) {
		if (this.forward && current === 0) {
			this.forward = false;
		} else if (current === length - 1) {
			this.forward = true;
		}

		const offset = this.forward ? -1 : 1;
		return (((current + offset) % length) + length) % length;
	}
}
