import React, { createContext, useState, useMemo, useCallback, useRef } from 'react';
import sounds from './AudioManager';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const soundIds = useRef({});
	const soundPlayingStates = useRef(
		Object.keys(sounds).reduce((acc, key) => {
			acc[key] = false;
			return acc;
		}, {}),
	);
	const pausedSounds = useRef({}); // To store both the paused ID and original volume

	const [isPlaying, setIsPlaying] = useState(false);

	const updateIsPlaying = useCallback(() => {
		setIsPlaying(Object.values(soundPlayingStates.current).some(Boolean));
	}, []);

	const playSound = useCallback(
		(soundKey) => {
			if (!soundPlayingStates.current[soundKey]) {
				const id = sounds[soundKey].play();
				if (!sounds[soundKey]._loop) {
					sounds[soundKey].once('end', () => {
						soundPlayingStates.current[soundKey] = false;
						updateIsPlaying();
					});
				}
				soundIds.current[soundKey] = id;
				soundPlayingStates.current[soundKey] = true;
				updateIsPlaying();
			}
		},
		[updateIsPlaying],
	);

	const pauseSound = useCallback(
		(soundKey) => {
			const id = soundIds.current[soundKey];
			if (id !== undefined) {
				sounds[soundKey].pause(id);
				pausedSounds.current[soundKey] = {
					id,
					volume: sounds[soundKey].volume(), // Save the original volume
				};
				soundPlayingStates.current[soundKey] = false;
				updateIsPlaying();
			}
		},
		[updateIsPlaying],
	);

	const stopSound = useCallback(
		(soundKey) => {
			const id = soundIds.current[soundKey];
			if (id !== undefined) {
				sounds[soundKey].stop(id);
				delete pausedSounds.current[soundKey];
				soundPlayingStates.current[soundKey] = false;
				updateIsPlaying();
			}
		},
		[updateIsPlaying],
	);

	const fadeInBackgroundMusicAndResumeOthers = useCallback(() => {
		const newSoundIds = {};
		let anySoundPaused = false;

		Object.keys(pausedSounds.current).forEach((soundKey) => {
			const { id, volume } = pausedSounds.current[soundKey];
			sounds[soundKey].play(id);
			sounds[soundKey].fade(0, volume, 1000, id); // Restore original volume
			soundPlayingStates.current[soundKey] = true;
			newSoundIds[soundKey] = id;
			delete pausedSounds.current[soundKey]; // Clean up paused sounds
			anySoundPaused = true;
		});

		if (!anySoundPaused) {
			const id = sounds.backgroundMusic.play(undefined, true);
			sounds.backgroundMusic.fade(0, sounds.backgroundMusic.volume(), 1000, id);
			soundPlayingStates.current.backgroundMusic = true;
			newSoundIds.backgroundMusic = id;
		}

		soundIds.current = { ...soundIds.current, ...newSoundIds };
		updateIsPlaying();
	}, [updateIsPlaying]);

	const fadeOutAllPlayingSounds = useCallback(() => {
		Object.keys(soundPlayingStates.current).forEach((soundKey) => {
			if (soundPlayingStates.current[soundKey]) {
				const id = soundIds.current[soundKey];
				if (id !== undefined) {
					const time = 1000;
					sounds[soundKey].fade(sounds[soundKey].volume(id), 0, time, id);
					setTimeout(() => {
						sounds[soundKey].pause(id);
						pausedSounds.current[soundKey] = {
							id,
							volume: sounds[soundKey].volume(), // Save the volume at the time of pausing
						};
					}, time);
				}
			}
		});
		Object.keys(soundPlayingStates.current).forEach((key) => {
			soundPlayingStates.current[key] = false;
		});
		updateIsPlaying();
	}, [updateIsPlaying]);

	const value = useMemo(
		() => ({
			isPlaying,
			playSound,
			pauseSound,
			stopSound,
			fadeInBackgroundMusicAndResumeOthers,
			fadeOutAllPlayingSounds,
		}),
		[isPlaying, playSound, pauseSound, stopSound, fadeInBackgroundMusicAndResumeOthers, fadeOutAllPlayingSounds],
	);

	return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
