import React, { useEffect, useRef, useState } from 'react';
import styles from './Terminal.module.scss';

const Terminal = React.memo(({ children, isAnimated = false, onComplete, qPrefix = 'root@kali:~#' }) => {
	const terminalContentRef = useRef(null);
	const intervalRef = useRef(null);
	const cursorRef = useRef(null);
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		console.log('Rendering Terminal');
		const animateWrite = async (children) => {
			if (!children || children.length === 0) return;
			for (const element of children) {
				const outputType = element.props['data-output-type'];
				const text = element.props.children;

				if (outputType === 'q') {
					await typeText(qPrefix + ' ', text);
				} else if (outputType === 'a') {
					printText(text);
				}

				// Delay of 1 second between elements
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
			setIsComplete(true);
		};

		const typeText = (prefix, text) => {
			return new Promise((resolve) => {
				let index = 0;
				const contentEl = terminalContentRef.current;
				const prefixSpan = document.createElement('span');
				prefixSpan.textContent = prefix;
				if (contentEl) contentEl.appendChild(prefixSpan);
				updateCursorPosition(prefixSpan);
				scrollToBottom();
				intervalRef.current = setInterval(() => {
					if (contentEl && text) {
						if (index < text.length) {
							const span = document.createElement('span');
							span.textContent = text[index];
							contentEl.appendChild(span);
							index++;
							updateCursorPosition(span);
							scrollToBottom();
						} else {
							clearInterval(intervalRef.current);
							const br = document.createElement('br');
							contentEl.appendChild(br);
							updateCursorPosition(br);
							scrollToBottom();
							resolve();
						}
					} else {
						clearInterval(intervalRef.current);
						resolve();
					}
				}, 50);
			});
		};

		const printText = (text) => {
			if (terminalContentRef.current && text) {
				const lines = text.split('\n');
				lines.forEach((line, index) => {
					const span = document.createElement('span');
					span.textContent = line;
					terminalContentRef.current.appendChild(span);
					if (index < lines.length - 1) {
						const br = document.createElement('br');
						terminalContentRef.current.appendChild(br);
					}
				});
				updateCursorPosition();
				scrollToBottom();
			}
		};

		const updateCursorPosition = (lastElement) => {
			const contentEl = terminalContentRef.current;
			const cursorEl = cursorRef.current;
			if (contentEl && cursorEl) {
				if (lastElement) {
					lastElement.appendChild(cursorEl);
				} else {
					contentEl.appendChild(cursorEl);
				}
			}
		};

		const scrollToBottom = () => {
			const contentEl = terminalContentRef.current;
			if (contentEl) {
				contentEl.scrollTop = contentEl.scrollHeight;
			}
		};

		// Get children from JSX fragment
		const elements = children.props?.children;
		terminalContentRef.current.innerHTML = '';

		if (isAnimated) {
			animateWrite(elements).then(() => {
				onComplete();
			});
		} else {
			printText(elements.map((element) => element.props.children).join(''));
			setIsComplete(true);
			onComplete();
		}

		return () => {
			clearInterval(intervalRef.current);
		};
	}, [children, isAnimated, qPrefix, onComplete]);

	return (
		<div className={`${styles.terminal}`}>
			<div className={`${styles.terminalContent}`} ref={terminalContentRef}></div>
			<span className={!isComplete ? styles.typedCursor : ''} ref={cursorRef}></span>
		</div>
	);
});

Terminal.displayName = 'Terminal';

export default Terminal;
