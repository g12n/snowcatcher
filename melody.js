/**
 * @summary small custom element that plays a winter chimes melody
 * @cssState playing - the melody is playing
 * @tagname winter-chimes
 */

class WinterChimes extends HTMLElement {
	constructor() {
		super();
		this._internals = this.attachInternals();

		this.audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		this.masterGain = this.audioContext.createGain();
		this.masterGain.connect(this.audioContext.destination);
		this.masterGain.gain.value = 0.05;

		this.notes = [
			523.25, // C5
			587.33, // D5
			659.25, // E5
			783.99, // G5
			880.0, // A5
			1046.5, // C6
			1174.66, // D6
			1318.51, // E6
		];
		this.isPlaying = false;
		this.nextNoteTime = 0;
		this.scheduleAheadTime = 0.1;
		this.intervalId = null;
	}

	connectedCallback() {
		this.addEventListener("command", (event) => {
			if (event.command === "--start") {
				this.start();
			} else if (event.command === "--stop") {
				this.stop();
			}
		});
	}
	disconnectedCallback() {
		this.stop();
	}

	setVolume(value) {
		this.masterGain.gain.value = value;
	}

	createBellSound(frequency) {
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();
		const filter = this.audioContext.createBiquadFilter();

		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(this.masterGain);

		oscillator.type = "sine";
		oscillator.frequency.value = frequency;
		filter.type = "lowpass";
		filter.frequency.value = 300 + Math.random() * 500;

		gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(
			0.001,
			this.audioContext.currentTime + 4
		);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + 4);
	}

	playNote() {
		const randomNote =
			this.notes[Math.floor(Math.random() * this.notes.length)];
		this.createBellSound(randomNote);
	}

	scheduler() {
		while (
			this.nextNoteTime <
			this.audioContext.currentTime + this.scheduleAheadTime
		) {
			setTimeout(
				() => this.playNote(),
				(this.nextNoteTime - this.audioContext.currentTime) * 1000
			);
			this.nextNoteTime += 0.25; // Fixed interval of 0.25 seconds
		}
	}

	start() {
		if (this.isPlaying) return;
		this._internals.states.add("playing");
		this.isPlaying = true;
		this.nextNoteTime = this.audioContext.currentTime;
		this.intervalId = setInterval(() => this.scheduler(), 100);
	}

	stop() {
		this._internals.states.delete("playing");
		if (!this.isPlaying) return;
		this.isPlaying = false;
		clearInterval(this.intervalId);
	}
}

customElements.define("winter-chimes", WinterChimes);
