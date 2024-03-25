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
		for (let i = 0; i < haystack.length - needle.length; i++) {
			if (haystack.slice(i, i + needle.length).every((value, index) => value === needle[index])) {
				return i;
			}
		}
		return -1;
	}
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { event } from './event';
	import Error from '../../routes/+error.svelte';

	export let port: SerialPort | null = null;
	let writable: WritableStreamDefaultWriter<Uint8Array>

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

	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	/** Queued reader data to process in [waitForInput] */
	const eventQueue = event<number>();
	let data: number[] = []

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

	export async function writeSerialString(data: string): Promise<boolean> {
		return writeSerial(encoder.encode(data));
	}

	export async function waitForInputString(lookFor: string): Promise<void> {
		await waitForInput([...encoder.encode(lookFor)]);
	}

	export async function waitForInput(lookFor: number[]): Promise<void> {
		for await (const value of eventQueue.iterator) {
			data = [...data, value];
			if (data.length >= lookFor.length) {
				const index = indexOf(data, lookFor);
				if (index !== -1) {
					data = data.slice(index + lookFor.length);
					return;
				}
			}
		}
	}
	
	export async function consume(length: number): Promise<number[]> {
		let result: number[] = [];
		while (result.length < length) {
			const value = await eventQueue.iterator.next();
			if (value.done) {
				throw new Error('Unexpected end of input');
			}
			result = [...result, value.value];
		}
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
			})
		else
			port = await navigator.serial.requestPort();

		await port.open({
			baudRate: 9600
		});

		if (!port.writable) {
			throw "No writable found.";
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
						console.log(byte);
						eventQueue.enqueue(byte);
					}
				}
			} catch (error) {
				dispatch('error', error);
			} finally {
				reader.releaseLock();
				dispatch('lockRelease');
			}
		}
	}
</script>
