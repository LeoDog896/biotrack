<script lang="ts" context="module">
	export const productToName: Record<number, string> = {
		0x2341: 'Arduino',
		0x0403: 'RedBoard'
	};

	export function getProductName(id: number | undefined) {
		if (id === undefined) return;
		return id in productToName ? productToName[id] : undefined;
	}

	function indexOf(haystack: number[], needle: number[]): number {
		for (let i = 0; i < haystack.length - needle.length + 1; i++) {
			let found = true;
			for (let j = 0; j < needle.length; j++) {
				if (haystack[i + j] !== needle[j]) {
					found = false;
					break;
				}
			}
			if (found) {
				return i;
			}
		}
		return -1;
	}
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { event } from './event';

	export let port: SerialPort | null = null;
	let writable: WritableStreamDefaultWriter<Uint8Array>;

	const dispatch = createEventDispatcher<{
		hasSerial: boolean;
		output: Uint8Array;
		error: unknown;
		lockRelease: void;
	}>();

	onMount(() => {
		// Check for serial support
		if ('serial' in navigator) {
			dispatch('hasSerial', true);
		}
	});

	export const encoder = new TextEncoder();
	export const decoder = new TextDecoder();

	/** Queued reader data to process in [waitForInput] */
	const eventQueue = event<number>();

	/**
	 * Write data to the serial port.
	 *
	 * @returns Whether the write was successful.
	 */
	export async function writeSerial(data: Uint8Array): Promise<boolean> {
		if (writable) {
			await writable.write(data);
			return true;
		}

		return false;
	}

	export let data: number[] = [];

	export async function writeSerialString(data: string): Promise<boolean> {
		return writeSerial(encoder.encode(data));
	}

	export function waitForInputString(
		lookFor: string
	): [controller: AbortController, promise: Promise<void>] {
		return waitForInput([...encoder.encode(lookFor)]);
	}

	export function waitForInput(
		needle: number[]
	): [controller: AbortController, promise: Promise<void>] {
		const controller = new AbortController();

		const promise = new Promise<void>(async (resolve, reject) => {
			data = [];
			const iterator = eventQueue.iterator();
			controller.signal.addEventListener('abort', () => {
				reject(new Error('Aborted'));
			});
			for await (const _ of iterator) {
				await new Promise<void>((resolve) => queueMicrotask(resolve));
				const index = indexOf(data, needle);
				if (index !== -1) {
					resolve();
					break;
				}
			}
		});

		return [controller, promise];
	}

	export async function consume(length: number): Promise<number[]> {
		const iterator = eventQueue.iterator();
		for await (const _ of iterator) {
			await new Promise<void>((resolve) => queueMicrotask(resolve));
			if (data.length >= length) {
				break;
			}
		}
		const result = data.slice(0, length);
		data = data.slice(length);
		return result;
	}

	/**
	 * Initialize the serial port and begin scanning for data.
	 */
	export const scanSerial = (filter: boolean) => async () => {
		if (filter)
			port = await navigator.serial.requestPort({
				filters: Object.keys(productToName).map((id) => ({
					usbVendorId: parseInt(id)
				}))
			});
		else port = await navigator.serial.requestPort();

		await port.open({
			baudRate: 9600
		});

		if (!port.writable) {
			throw new Error('No writable found.');
		}

		writable = port.writable.getWriter();

		while (port.readable) {
			const reader = port.readable.getReader();
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						console.log('Read done');
						break;
					}
					dispatch('output', value);
					for (const byte of value) {
						data.push(byte);
						await eventQueue.enqueue(byte);
					}
				}
			} catch (error) {
				dispatch('error', error);
			} finally {
				reader.releaseLock();
				dispatch('lockRelease');
			}
		}
	};
</script>
