import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Howl } from 'howler';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [soundId, setSoundId] = useState(null);
	const maxVolume = 0.015;

	const sound = useMemo(
		() =>
			new Howl({
				src: ['/audio/ClearSkies.mp3'],
				loop: true,
				volume: maxVolume,
			}),
		[],
	);

	useEffect(() => {
		// Set the overall volume to 50%
		sound.volume(maxVolume);
	}, [sound]);

	const toggleAudio = () => {
		setIsPlaying((prev) => !prev);
	};

	useEffect(() => {
		if (isPlaying) {
			if (soundId === null) {
				const id = sound.play(undefined, true);
				sound.fade(0, maxVolume, 1000, id);
				setSoundId(id);
			} else {
				sound.fade(0, maxVolume, 1000, soundId);
				sound.play(soundId, true);
			}
		} else {
			sound.fade(maxVolume, 0, 1000, soundId);
			setTimeout(() => {
				sound.pause(soundId);
			}, 1000);
		}
	}, [isPlaying, sound, soundId]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				sound.fade(maxVolume, 0, 1000, soundId);
				setTimeout(() => {
					sound.pause(soundId);
				}, 1000);
			} else if (isPlaying) {
				sound.play(soundId, true);
				sound.fade(0, maxVolume, 1000, soundId);
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isPlaying, sound, soundId]);

	return <AudioContext.Provider value={{ isPlaying, toggleAudio }}>{children}</AudioContext.Provider>;
};
