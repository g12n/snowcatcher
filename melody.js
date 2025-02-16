class WinterChimes {
	constructor() {
		this.audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		this.masterGain = this.audioContext.createGain();
		this.masterGain.connect(this.audioContext.destination);

		// Set initial volume to 15%
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

	setVolume(value) {
		// value should be between 0 and 1
		this.masterGain.gain.value = value;
	}

	createBellSound(frequency) {
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();
		const filter = this.audioContext.createBiquadFilter();

		// Connect the nodes - now through masterGain
		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(this.masterGain);

		// Bell-like sound settings
		oscillator.type = "sine";
		oscillator.frequency.value = frequency;

		filter.type = "lowpass";
		filter.frequency.value = 1000;

		// Reduced initial volume to 10% (0.1)
		gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(
			0.001,
			this.audioContext.currentTime + 4
		);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + 3);
	}

	playRandomNote() {
		// Randomly select 1-3 notes to play together
		const numberOfNotes = Math.floor(Math.random() * 1) + 1;
		for (let i = 0; i < numberOfNotes; i++) {
			const randomNote =
				this.notes[Math.floor(Math.random() * this.notes.length)];
			this.createBellSound(randomNote);
		}
	}

	scheduler() {
		while (
			this.nextNoteTime <
			this.audioContext.currentTime + this.scheduleAheadTime
		) {
			const randomDelay = 0.5 + Math.random() * 1.5;

			setTimeout(
				() => this.playRandomNote(),
				(this.nextNoteTime - this.audioContext.currentTime) * 1000
			);

			this.nextNoteTime += randomDelay;
		}
	}

	start() {
		if (this.isPlaying) return;

		this.isPlaying = true;
		this.nextNoteTime = this.audioContext.currentTime;
		this.intervalId = setInterval(() => this.scheduler(), 100);
	}

	stop() {
		if (!this.isPlaying) return;

		this.isPlaying = false;
		clearInterval(this.intervalId);
	}
}

// Usage example
const chimes = new WinterChimes();

// Start button event listener
document.getElementById("startButton")?.addEventListener("click", () => {
	chimes.start();
});

// Stop button event listener
document.getElementById("stopButton")?.addEventListener("click", () => {
	chimes.stop();
});

// Volume control example
document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
	chimes.setVolume(parseFloat(e.target.value));
});
