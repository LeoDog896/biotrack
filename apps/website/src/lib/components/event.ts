import { dirty } from "./dirty.js";

export interface QueueEvent<T> {
	iterator(): {
		[Symbol.asyncIterator](): AsyncGenerator<T>;
		cancel(): void;
		next(): Promise<IteratorResult<T>>;
	};
	enqueue(...item: T[]): Promise<void>;
}

/**
 * Allows appending items to a queue, where the queue
 * can be consumed as an async iterator.
 * 
 * @example
 * ```
 * const { iterator, enqueue } = event<number>();
 * 
 * enqueue(1);
 * enqueue(2);
 * 
 * for await (const item of iterator) {
 * 	console.log(item);	// 1, 2
 * }
 * ```
 */
export function event<T>(): QueueEvent<T> {
	// collecting a list of items
	let items: T[] = [];
	// notifies the iterator that there are new items
	const marker = dirty();

	const iteratorInternal = async function* (cancelSignal: AbortSignal) {
		while (true) {
			if (cancelSignal.aborted) {
				break;
			}

			// empty the queue
			yield* items;

			// clear the queue
			items = [];

			// wait for changes
			await marker.signal();
		}
	};

	const iterator = function() {
		const abortController = new AbortController();
		const generator = iteratorInternal(abortController.signal);

		return {
			[Symbol.asyncIterator]: () => generator,
			cancel() {
				abortController.abort();
			},
			next() {
				return generator.next();
			}
		};
	}

	return {
		iterator,
		async enqueue(item: T) {
			items = [...items, item];
			marker.emit();
		},
	};
}
