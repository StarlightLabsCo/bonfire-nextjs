export class RingBuffer {
  buffer: Float32Array;
  writePointer: number;
  readPointer: number;
  availableData: number;

  constructor(length: number) {
    this.buffer = new Float32Array(length);
    this.writePointer = 0;
    this.readPointer = 0;
    this.availableData = 0;
  }

  push(data: Float32Array) {
    for (let i = 0; i < data.length; i++) {
      let sample = data[i];
      if (this.availableData >= this.buffer.length) return; // Buffer full
      this.buffer[this.writePointer] = sample;
      this.writePointer = (this.writePointer + 1) % this.buffer.length;
      this.availableData++;
    }
  }

  pull(amount: number) {
    let output = new Float32Array(amount);
    for (let i = 0; i < amount; i++) {
      if (this.availableData <= 0) {
        output.set(new Float32Array(amount - i), i); // Fill the rest with zeros
        break;
      }
      output[i] = this.buffer[this.readPointer];
      this.readPointer = (this.readPointer + 1) % this.buffer.length;
      this.availableData--;
    }
    return output;
  }
}
