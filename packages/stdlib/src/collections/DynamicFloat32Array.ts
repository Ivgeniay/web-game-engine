export class DynamicFloat32Array {
  private buffer: Float32Array;
  private _length: number = 0;
  private stride: number;

  constructor(stride: number, initialCapacity: number = 256) {
    this.stride = stride;
    this.buffer = new Float32Array(initialCapacity * stride);
  }

  private grow() {
    const newBuffer = new Float32Array(this.buffer.length * 2);
    newBuffer.set(this.buffer);
    this.buffer = newBuffer;
  }

  add(): number {
    if (this._length * this.stride >= this.buffer.length) {
      this.grow();
    }
    return this._length++;
  }
}
