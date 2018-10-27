export abstract class Sequencer {
	public index: number = 0;

	public Sequencer(startIndex?: number) {
		if (startIndex !== undefined) {
			this.index = startIndex;
		}
	}

	public abstract peekNext(length: number): number;
	public moveNext(length: number): number {
		return (this.index = this.peekNext(length));
	}

	public abstract peekPrev(length: number): number;
	public movePrev(length: number): number {
		return (this.index = this.peekPrev(length));
	}

	public abstract peekOffset(offset: number, length: number): number;
	public moveOffset(offset: number, length: number): number {
		return (this.index = this.peekOffset(offset, length));
	}
}
