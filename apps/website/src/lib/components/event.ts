import { dirty } from "./dirty.js";

export interface QueueEvent<T> {
	readonly iterator: AsyncGenerator<T>;
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
	const items: T[] = [];
	// notifies the iterator that there are new items
	const marker = dirty();

	const iterator = async function* () {
		while (true) {
			// empty the queue
			while (items.length > 0) {
				yield items.shift()!;
			}

			// wait for changes
			await marker.signal();
		}
	};

	return {
		iterator: iterator(),
		async enqueue(item: T) {
			items.push(item);
			marker.emit();
		},
	};
}
