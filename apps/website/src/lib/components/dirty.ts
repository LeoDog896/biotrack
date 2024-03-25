/**
 * A dirty signal that can be emitted and listened to.
 */
export interface Dirty {
	/**
	 * Emits a signal, triggering all listeners.
	 */
	emit(): void;
	/**
	 * Waits for the signal to be emitted. Single-use.
	 */
	signal(): Promise<void>;
}

/**
 * A signal that waits for it to be marked as dirty, where
 * the promise will complete.
 * 
 * This is the underlying system powering the rest
 * of this library.
 * 
 * @example
 * Appropriate usage; one may also await the signal.
 * ```
 * const marker = dirty();
 * 
 * marker.signal().then(() => {
 * 	console.log("I'm dirty!");
 * });
 * 
 * marker.emit();
 * ```
 * 
 * @example
 * Signals are not received if the emit request is made before;
 * if this behavior is desired, use {@link event} instead.
 * ```
 * const marker = dirty();
 * 
 * marker.emit();
 * 
 * await marker.signal(); // This will not resolve.
 * ```
 */
export function dirty() {
	// our queue of resolvers.
	// we store these as to resolve them when `emit` is called
	// so that we can notify all listeners.
	const resolveQueue: (() => void)[] = [];

	return {
		emit() {
			// preserve FILO order
			while (resolveQueue.length > 0) {
				resolveQueue.shift()!();
			}
		},
		signal() {
			return new Promise<void>((resolve) => {
				resolveQueue.push(resolve);
			});
		},
	};
}
