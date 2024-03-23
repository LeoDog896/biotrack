<script lang="ts">
	import { MathQuill } from 'svelte-mathquill';
	import { ComputeEngine, type BoxedExpression } from '@cortex-js/compute-engine';

	const engine = new ComputeEngine();

	export let error: string | null = null;

	let latex = '';

	function safeParse(latex: string): BoxedExpression | null {
		try {
			return engine.parse(latex);
		} catch (e) {
			error = 'invalid expression';
			return null;
		}
	}

	function safeEvaluate(json: BoxedExpression) {
		try {
			return json.evaluate();
		} catch (e) {
			error = 'could not evaluate';
			return null;
		}
	}

	$: json = safeParse(latex);
	$: boxedResult = json ? safeEvaluate(json) : null;

	export let result: number | null = null;
	$: if (boxedResult) {
		const expr = boxedResult.valueOf();
		if (typeof expr === 'number') {
			result = expr;
			error = null;
		} else {
			error = 'could not evaluate';
			result = null;
		}
	}
</script>

<MathQuill bind:latex />
