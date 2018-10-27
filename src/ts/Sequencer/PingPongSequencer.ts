import { Sequencer } from '../Sequencer';

export class PingPongSequencer extends Sequencer {
	public isForward = true;
	private peekIsForward = true;
	private peekIndex = 0;

	public peekNext(length: number) {
		this.peekIsForward = this.isForward;
		this.peekIndex = this.index;

		if (this.peekIsForward && this.peekIndex === length - 1) {
			this.peekIsForward = false;
		} else if (this.peekIndex === 0) {
			this.peekIsForward = true;
		}

		const offset = this.peekIsForward ? 1 : -1;
		return (this.peekIndex = (((this.peekIndex + offset) % length) + length) % length);
	}

	public moveNext(length: number) {
		this.peekNext(length);
		this.isForward = this.peekIsForward;
		return (this.index = this.peekIndex);
	}

	public peekPrev(length: number) {
		this.peekIsForward = this.isForward;
		this.peekIndex = this.index;

		if (this.peekIsForward && this.peekIndex === 0) {
			this.peekIsForward = false;
		} else if (this.peekIndex === length - 1) {
			this.peekIsForward = true;
		}

		const offset = this.peekIsForward ? -1 : 1;
		return (this.peekIndex = (((this.peekIndex + offset) % length) + length) % length);
	}

	public movePrev(length: number) {
		this.peekPrev(length);
		this.isForward = this.peekIsForward;
		return (this.index = this.peekIndex);
	}

	public peekOffset(offset: number, length: number) {
		this.peekIsForward = this.isForward;
		this.peekIndex = this.index;

		if (offset < 0) {
			this.peekIsForward = !this.peekIsForward;
			offset = -offset;
		}

		while (offset-- > 0) {
			if (this.peekIsForward && this.peekIndex === length - 1) {
				this.peekIsForward = false;
			} else if (this.peekIndex === 0) {
				this.peekIsForward = true;
			}

			const step = this.peekIsForward ? 1 : -1;
			this.peekIndex = (((this.peekIndex + step) % length) + length) % length;
		}
		return this.peekIndex;
	}

	public moveOffset(offset: number, length: number) {
		this.peekOffset(offset, length);
		this.isForward = this.peekIsForward;
		return (this.index = this.peekIndex);
	}
}
