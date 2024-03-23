<script lang="ts" context="module">
    export const productToName: Record<number, string> = {
		0x2341: "Arduino",
		0x0403: "RedBoard"
	};

	export function getProductName(id: number | undefined) {
		if (id === undefined) return;
		return id in productToName ? productToName[id] : undefined;
	}

    function concatenateUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
        const length = arrays.reduce((acc, arr) => acc + arr.length, 0);
        const result = new Uint8Array(length);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    function indexOf(haystack: Uint8Array, needle: Uint8Array): number {
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
    import { event } from 'signal-async/dist';

	export let port: SerialPort | null = null;

    const dispatch = createEventDispatcher<{
        hasSerial: boolean;
        output: Uint8Array;
        error: unknown;
        lockRelease: void;
    }>();

	onMount(() => {
		// Check for serial support
		if ("serial" in navigator) {
			dispatch("hasSerial", true);
		}
	});

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    /** Queued reader data to process in [waitForInput] */
    const eventQueue = event<Uint8Array>();
    let data = new Uint8Array();

    /**
     * Write data to the serial port.
     * 
     * @returns Whether the write was successful.
     */
    export async function writeSerial(data: Uint8Array): Promise<boolean> {
        if (port && port.writable) {
            await port.writable.getWriter().write(data);
            return true;
        }

        return false;
    }

    export async function waitForInput(
        lookFor: Uint8Array
    ): Promise<void> {
        for await (const value of eventQueue.iterator) {
            data = concatenateUint8Arrays(data, value);
            if (data.length >= lookFor.length) {
                const index = indexOf(data, lookFor);
                if (index !== -1) {
                    data = data.slice(index + lookFor.length);
                    return;
                }
            }
        }
    }

    /**
     * Initialize the serial port and begin scanning for data.
     */
	export async function scanSerial() {
		port = await navigator.serial.requestPort({
			filters: Object.keys(productToName).map((id) => ({
				usbVendorId: parseInt(id)
			}))
		});

		while (port.readable) {
			const reader = port.readable.getReader();
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						break;
					}
                    dispatch("output", value);
                    eventQueue.enqueue(value);
				}
			} catch (error) {
                dispatch("error", error);
			} finally {
				reader.releaseLock();
                dispatch("lockRelease");
			}
		}
	}
</script>
