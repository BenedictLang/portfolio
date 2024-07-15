import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Howl } from 'howler';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [soundId, setSoundId] = useState(null);
	const maxVolumeBG = 0.008;
	const maxVolume = 0.003;

	const mainSound = useMemo(
		() =>
			new Howl({
				src: ['/audio/Explora - Benedict Lang.mp3'],
				loop: true,
				volume: maxVolumeBG,
			}),
		[],
	);

	const clickSound = useMemo(
		() =>
			new Howl({
				src: ['/audio/click-button.mp3'],
				volume: maxVolume,
			}),
		[maxVolume],
	);

	useEffect(() => {
		mainSound.volume(maxVolumeBG);
	}, [mainSound, maxVolumeBG]);

	const toggleAudio = () => {
		setIsPlaying((prev) => !prev);
	};

	const playClickSound = () => {
		if (isPlaying) {
			clickSound.play(undefined, true);
		}
	};

	useEffect(() => {
		if (isPlaying) {
			if (soundId === null) {
				const id = mainSound.play(undefined, true);
				mainSound.fade(0, maxVolumeBG, 1000, id);
				setSoundId(id);
			} else {
				mainSound.fade(0, maxVolumeBG, 1000, soundId);
				mainSound.play(soundId, true);
			}
		} else {
			mainSound.fade(maxVolumeBG, 0, 1000, soundId);
			setTimeout(() => {
				mainSound.pause(soundId);
			}, 1000);
		}
	}, [isPlaying, mainSound, soundId, maxVolumeBG]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				mainSound.fade(maxVolumeBG, 0, 1000, soundId);
				setTimeout(() => {
					mainSound.pause(soundId);
				}, 1000);
			} else if (isPlaying) {
				mainSound.play(soundId, true);
				mainSound.fade(0, maxVolumeBG, 1000, soundId);
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isPlaying, mainSound, soundId, maxVolumeBG]);

	return <AudioContext.Provider value={{ isPlaying, toggleAudio, playClickSound }}>{children}</AudioContext.Provider>;
};
