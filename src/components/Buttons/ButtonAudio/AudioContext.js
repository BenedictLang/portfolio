import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Howl } from 'howler';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [backgroundMusicId, setBackgroundMusicId] = useState(null);
	const [keyboardSoundId, setKeyboardSoundId] = useState(null);
	const [codeSoundId, setCodeSoundId] = useState(null);
	const backgroundMusicRef = useRef(null);
	const maxVolume = 0.003;
	const musicVolume = 0.008;
	const keysVolume = 0.006;
	const codeVolume = 0.0025;

	useEffect(() => {
		// Initialize Howler instance for background music
		backgroundMusicRef.current = new Howl({
			src: ['/audio/Explora - Benedict Lang.mp3'],
			loop: true,
			volume: 0.5,
		});

		return () => {
			// Clean up Howler instance
			backgroundMusicRef.current?.unload();
		};
	}, []);

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
			}),
		[keysVolume],
	);

	const codeSound = useMemo(
		() =>
			new Howl({
				src: ['/audio/binary-code-interface.mp3'],
				volume: codeVolume,
			}),
		[codeVolume],
	);

	const fadeIn = useCallback(
		(sound, volume, id) => {
			if (isPlaying && sound && id !== null) {
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

	const stopKeySound = useCallback(() => {
		if (keyboardSoundId !== null) {
			fadeOut(keyboardSound, keysVolume, keyboardSoundId);
			keyboardSound.stop(keyboardSoundId, false);
			setKeyboardSoundId(null);
		}
	}, [fadeOut, keyboardSound, keyboardSoundId]);

	const stopCodeSound = useCallback(() => {
		if (codeSoundId !== null) {
			fadeOut(codeSound, codeVolume, codeSoundId);
			codeSound.stop(codeSoundId, false);
			setCodeSoundId(null);
		}
	}, [codeSound, codeSoundId, fadeOut]);

	useEffect(() => {
		backgroundMusicRef.current.volume(musicVolume);
	}, [musicVolume]);

	const toggleAudio = useCallback(() => {
		setIsPlaying((prev) => !prev);
	}, []);

	const playClickSound = useCallback(() => {
		if (isPlaying) {
			clickSound.play(undefined, true);
		}
	}, [isPlaying, clickSound]);

	const playKeySound = useCallback(() => {
		if (isPlaying) {
			if (keyboardSoundId == null) {
				setKeyboardSoundId(keyboardSound.play(undefined, true));
			} else {
				keyboardSound.stop(keyboardSoundId, true);
				keyboardSound.play(keyboardSoundId, true);
			}
		}
	}, [isPlaying, keyboardSound, keyboardSoundId]);

	const playCodeSound = useCallback(() => {
		if (isPlaying) {
			if (codeSoundId == null) {
				setCodeSoundId(codeSound.play(undefined, true));
			} else {
				codeSound.stop(codeSoundId, true);
				codeSound.play(codeSoundId, true);
			}
		}
	}, [isPlaying, codeSound, codeSoundId]);

	const playSound = useCallback(() => {
		if (backgroundMusicId == null && !backgroundMusicRef.current.playing(backgroundMusicId)) {
			// Initialize background music on first execution
			setBackgroundMusicId(backgroundMusicRef.current.play(undefined, true));
		} else {
			if (!backgroundMusicRef.current.playing(backgroundMusicId)) {
				fadeIn(backgroundMusicRef.current, musicVolume, backgroundMusicId);
			}
		}

		if (keyboardSoundId) fadeIn(keyboardSound, keysVolume, keyboardSoundId);
		if (codeSoundId) fadeIn(codeSound, codeVolume, codeSoundId);
	}, [backgroundMusicId, keyboardSoundId, fadeIn, keyboardSound, codeSoundId, codeSound]);

	const pauseSound = useCallback(() => {
		fadeOut(backgroundMusicRef.current, musicVolume, backgroundMusicId);
		fadeOut(keyboardSound, keysVolume, keyboardSoundId);
		fadeOut(codeSound, codeVolume, codeSoundId);
	}, [
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
		<AudioContext.Provider
			value={{ isPlaying, toggleAudio, playClickSound, playKeySound, playCodeSound, stopKeySound, stopCodeSound }}
		>
			{children}
		</AudioContext.Provider>
	);
};
