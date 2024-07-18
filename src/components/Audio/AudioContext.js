import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import sounds from './AudioManager';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const [soundIds, setSoundIds] = useState({});
	const soundKeys = Object.keys(sounds);
	const initialSoundPlayingStates = soundKeys.reduce((acc, key) => {
		acc[key] = false;
		return acc;
	}, {});
	const [soundPlayingStates, setSoundPlayingStates] = useState(initialSoundPlayingStates);

	useEffect(() => {
		console.log('Rendering AudioProvider');
	}, []);

	const playSound = useCallback(
		(soundKey) => {
			if (!soundPlayingStates[soundKey]) {
				const id = sounds[soundKey].play();
				setSoundIds((prev) => ({ ...prev, [soundKey]: id }));
				setSoundPlayingStates((prev) => ({ ...prev, [soundKey]: true }));
			}
		},
		[soundPlayingStates],
	);

	const pauseSound = useCallback(
		(soundKey) => {
			sounds[soundKey].pause(soundIds[soundKey]);
			setSoundPlayingStates((prev) => ({ ...prev, [soundKey]: false }));
		},
		[soundIds],
	);

	const stopSound = useCallback(
		(soundKey) => {
			sounds[soundKey].stop(soundIds[soundKey]);
			setSoundPlayingStates((prev) => ({ ...prev, [soundKey]: false }));
		},
		[soundIds],
	);

	const fadeInBackgroundMusicAndResumeOthers = useCallback(() => {
		const newSoundIds = {};
		Object.keys(soundPlayingStates).forEach((soundKey) => {
			if (soundKey === 'backgroundMusic') {
				const id = sounds.backgroundMusic.play();
				sounds.backgroundMusic.fade(0, sounds.backgroundMusic.volume(), 1000, id);
				newSoundIds.backgroundMusic = id;
			} else if (soundPlayingStates[soundKey]) {
				const id = sounds[soundKey].play();
				sounds[soundKey].fade(0, sounds[soundKey].volume(), 1000, id);
				newSoundIds[soundKey] = id;
			}
		});
		setSoundIds((prev) => ({ ...prev, ...newSoundIds }));
		setSoundPlayingStates((prev) => ({
			...prev,
			backgroundMusic: true,
			...Object.fromEntries(
				Object.keys(soundPlayingStates)
					.filter((key) => key !== 'backgroundMusic' && prev[key])
					.map((key) => [key, true]),
			),
		}));
	}, [soundPlayingStates]);

	const fadeOutAllPlayingSounds = useCallback(() => {
		Object.keys(soundPlayingStates).forEach((soundKey) => {
			if (soundPlayingStates[soundKey]) {
				const id = soundIds[soundKey];
				if (id !== undefined) {
					sounds[soundKey].fade(sounds[soundKey].volume(id), 0, 1000, id);
					setTimeout(() => sounds[soundKey].pause(id), 1000);
				}
			}
		});
		setSoundPlayingStates((prev) => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
	}, [soundPlayingStates, soundIds]);

	const value = useMemo(
		() => ({
			isPlaying: Object.values(soundPlayingStates).some(Boolean),
			playSound,
			pauseSound,
			stopSound,
			fadeInBackgroundMusicAndResumeOthers,
			fadeOutAllPlayingSounds,
		}),
		[
			soundPlayingStates,
			playSound,
			pauseSound,
			stopSound,
			fadeInBackgroundMusicAndResumeOthers,
			fadeOutAllPlayingSounds,
		],
	);

	return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
