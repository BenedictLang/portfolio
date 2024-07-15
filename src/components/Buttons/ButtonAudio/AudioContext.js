import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Howl } from 'howler';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [backgroundMusicId, setBackgroundMusicId] = useState(null);
	const [keyboardSoundId, setKeyboardSoundId] = useState(null);
	const [codeSoundId, setCodeSoundId] = useState(null);
	const maxVolume = 0.003;
	const musicVolume = 0.008;
	const keysVolume = 0.006;
	const codeVolume = 0.002;

	const backgroundMusic = useMemo(
		() =>
			new Howl({
				src: ['/audio/Explora - Benedict Lang.mp3'],
				loop: true,
				volume: musicVolume,
			}),
		[musicVolume],
	);

	const clickSound = useMemo(
		() =>
			new Howl({
				src: ['/audio/click-button.mp3'],
				volume: maxVolume,
			}),
		[maxVolume],
	);

	const keyboardSound = useMemo(
		() =>
			new Howl({
				src: ['/audio/keyboard.mp3'],
				volume: keysVolume,
				onend: function () {
					setKeyboardSoundId(null);
				},
			}),
		[keysVolume],
	);

	const codeSound = useMemo(
		() =>
			new Howl({
				src: ['/audio/binary-code-interface.mp3'],
				volume: codeVolume,
				onend: function () {
					setCodeSoundId(null);
				},
			}),
		[codeVolume],
	);

	useEffect(() => {
		backgroundMusic.volume(musicVolume);
	}, [backgroundMusic, musicVolume]);

	const toggleAudio = () => {
		setIsPlaying((prev) => !prev);
	};

	const playClickSound = useCallback(() => {
		if (isPlaying) {
			clickSound.play(undefined, true);
		}
	}, [isPlaying, clickSound]);

	const playKeyboardSound = useCallback(() => {
		if (isPlaying && keyboardSoundId == null) {
			setKeyboardSoundId(keyboardSound.play(undefined, true));
		}
	}, [isPlaying, keyboardSound, keyboardSoundId]);

	const playCodeSound = useCallback(() => {
		if (isPlaying && codeSoundId == null) {
			setCodeSoundId(codeSound.play(undefined, true));
		}
	}, [isPlaying, codeSound, codeSoundId]);

	const fadeIn = useCallback(
		(sound, volume, id) => {
			if (sound && isPlaying && id !== null) {
				if (!sound.playing(id)) {
					sound.play(id, true);
					sound.fade(0, volume, 1000, id);
				}
			}
		},
		[isPlaying],
	);

	const fadeOut = useCallback((sound, volume, id) => {
		if (sound && id !== null) {
			sound.fade(volume, 0, 1000, id);
			setTimeout(() => {
				sound.pause(id);
			}, 1000);
		}
	}, []);

	const playSound = useCallback(() => {
		if (backgroundMusicId == null && !backgroundMusic.playing(backgroundMusicId)) {
			console.log('Init BG');
			// Initialize background music on first execution
			setBackgroundMusicId(backgroundMusic.play(undefined, true));
		} else {
			if (!backgroundMusic.playing(backgroundMusicId)) fadeIn(backgroundMusic, musicVolume, backgroundMusicId);
		}

		if (keyboardSoundId) fadeIn(keyboardSound, keysVolume, keyboardSoundId);
		if (codeSoundId) fadeIn(codeSound, codeVolume, codeSoundId);
	}, [
		backgroundMusic,
		musicVolume,
		backgroundMusicId,
		keyboardSound,
		keysVolume,
		keyboardSoundId,
		codeSound,
		codeVolume,
		codeSoundId,
		fadeIn,
	]);

	const pauseSound = useCallback(() => {
		fadeOut(backgroundMusic, musicVolume, backgroundMusicId);
		fadeOut(keyboardSound, keysVolume, keyboardSoundId);
		fadeOut(codeSound, codeVolume, codeSoundId);
	}, [
		backgroundMusic,
		musicVolume,
		backgroundMusicId,
		keyboardSound,
		keysVolume,
		keyboardSoundId,
		codeSound,
		codeVolume,
		codeSoundId,
		fadeOut,
	]);

	useEffect(() => {
		if (isPlaying) {
			playSound();
		} else {
			pauseSound();
		}
	}, [isPlaying, pauseSound, playSound]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				pauseSound();
			} else if (isPlaying) {
				playSound();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isPlaying, pauseSound, playSound]);

	return (
		<AudioContext.Provider value={{ isPlaying, toggleAudio, playClickSound, playKeyboardSound, playCodeSound }}>
			{children}
		</AudioContext.Provider>
	);
};
