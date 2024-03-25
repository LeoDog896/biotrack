interface State<T> {
	waitFor(needle: T): Promise<void>;
	set(value: T): void;
}

export function state<T>(
	initial: T,
	comparison: (a: T, b: T) => boolean = Object.is
): State<T> {
	let current = initial;
	const listeners: ([needle: T, resolve: () => void])[] = [];

	return {
		waitFor(target: T) {
			if (comparison(target, current)) {
				return Promise.resolve();
			}

			return new Promise<void>((resolve) => {
				listeners.push([target, resolve]);
			});
		},
		set(newValue: T) {
			for (const [needle, resolve] of listeners) {
				if (comparison(needle, newValue)) {
					resolve();
				}
			}

			current = newValue;
		}
	}
}
