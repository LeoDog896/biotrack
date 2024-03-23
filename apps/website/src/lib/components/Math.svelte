<script lang="ts">
    import { MathQuill } from 'svelte-mathquill';
    import { ComputeEngine, type BoxedExpression } from "@cortex-js/compute-engine";

    const engine = new ComputeEngine();

    let latex = '';

    function safeParse(latex: string) {
        try {
            return engine.parse(latex);
        } catch (e) {
            return null;
        }
    }

    function safeEvaluate(json: BoxedExpression) {
        try {
            return json.evaluate();
        } catch (e) {
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
        }
    }
</script>

<MathQuill bind:latex />
