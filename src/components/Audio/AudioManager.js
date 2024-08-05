import { Howl } from 'howler';

const backgroundMusic = new Howl({
	src: ['/audio/Explora - Benedict Lang.mp3'],
	loop: true,
	volume: 0.006,
});

const click = new Howl({
	src: ['/audio/click-button.mp3'],
	volume: 0.003,
});

const keyboardSound = new Howl({
	src: ['/audio/keyboard.mp3'],
	loop: true,
	volume: 0.008,
});

const codeSound = new Howl({
	src: ['/audio/binary-code-interface.mp3'],
	loop: true,
	volume: 0.008,
});

const greetings = new Howl({
	src: ['/audio/hello-human.mp3'],
	volume: 0.1,
});

const sounds = {
	backgroundMusic,
	click,
	keyboardSound,
	codeSound,
	greetings,
};

export default sounds;
