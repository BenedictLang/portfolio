import React, { createContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import sounds from './AudioManager';
import { Howler } from 'howler';

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	Howler.autoUnlock = false;
	const soundIds = useRef({});
	const soundPlayingStates = useRef(
		Object.keys(sounds).reduce((acc, key) => {
			acc[key] = false;
			return acc;
		}, {}),
	);
	const pausedSounds = useRef({}); // Stores the paused ID and original volume

	const [isPlaying, setIsPlaying] = useState(false);
	const isMutedByUser = useRef(false);

	const updateIsPlaying = useCallback(() => {
		setIsPlaying(Object.values(soundPlayingStates.current).some(Boolean));
	}, []);

	const playSound = useCallback(
		(soundKey) => {
			if (!soundPlayingStates.current[soundKey] && !isMutedByUser.current) {
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
		[updateIsPlaying, isMutedByUser],
	);

	const pauseSound = useCallback(
		(soundKey) => {
			const id = soundIds.current[soundKey];
			if (id !== undefined) {
				sounds[soundKey].pause(id);
				pausedSounds.current[soundKey] = {
					id,
					volume: sounds[soundKey].volume(),
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

	const resumeAllPausedAudio = useCallback(() => {
		if (!isMutedByUser.current) {
			const newSoundIds = {};

			Object.keys(pausedSounds.current).forEach((soundKey) => {
				const { id, volume } = pausedSounds.current[soundKey];
				sounds[soundKey].play(id);
				sounds[soundKey].fade(0, volume, 1000, id);
				soundPlayingStates.current[soundKey] = true;
				newSoundIds[soundKey] = id;
				delete pausedSounds.current[soundKey];
			});

			soundIds.current = { ...soundIds.current, ...newSoundIds };
			updateIsPlaying();
		}
	}, [updateIsPlaying, isMutedByUser]);

	const fadeInBackgroundMusicAndResumeOthers = useCallback(() => {
		if (!isMutedByUser.current) {
			resumeAllPausedAudio();

			if (!sounds.backgroundMusic.playing(soundIds.current.backgroundMusic)) {
				const id = sounds.backgroundMusic.play(undefined, true);
				sounds.backgroundMusic.fade(0, sounds.backgroundMusic.volume(), 1000, id);
				soundPlayingStates.current.backgroundMusic = true;
				soundIds.current.backgroundMusic = id;
			}

			updateIsPlaying();
		}
	}, [resumeAllPausedAudio, updateIsPlaying, isMutedByUser]);

	const pauseAllPlayingAudio = useCallback(() => {
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

	const mute = useCallback(
		(shouldMute) => {
			isMutedByUser.current = shouldMute;
			if (shouldMute) {
				pauseAllPlayingAudio();
			} else {
				fadeInBackgroundMusicAndResumeOthers();
			}
		},
		[pauseAllPlayingAudio, fadeInBackgroundMusicAndResumeOthers],
	);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				pauseAllPlayingAudio();
			} else {
				if (!isMutedByUser) {
					resumeAllPausedAudio();
				}
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [pauseAllPlayingAudio, resumeAllPausedAudio, isMutedByUser]);

	const value = useMemo(
		() => ({
			isPlaying,
			mute,
			playSound,
			pauseSound,
			stopSound,
			fadeInBackgroundMusicAndResumeOthers,
			fadeOutAllPlayingSounds: pauseAllPlayingAudio,
		}),
		[isPlaying, mute, playSound, pauseSound, stopSound, fadeInBackgroundMusicAndResumeOthers, pauseAllPlayingAudio],
	);

	return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
