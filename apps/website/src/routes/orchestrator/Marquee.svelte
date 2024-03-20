<script lang="ts">
	export let reverse = false;
</script>

<div aria-hidden class="marquee">
	<span class:reverse>
		{'orchestrator '.repeat(50)}
	</span>
	<span class:reverse>
		{'orchestrator '.repeat(50)}
	</span>
</div>

<style lang="scss">
	// marquee style from https://ryanmulligan.dev/blog/css-marquee/
	$gap: 1rem;

	.marquee {
		--gap: 1rem;
		display: flex;
		overflow: hidden;
		user-select: none;
		gap: $gap;
		border-top: 4px solid red;
		border-bottom: 4px solid red;
		text-transform: uppercase;
		font-weight: bold;
		color: gray;
        background-color: var(--error);

		span {
            background-color: var(--eror);
            color: yellow;
			flex-shrink: 0;
			display: flex;
			justify-content: space-around;
			min-width: 100%;
			gap: $gap;
			animation: scroll 70s linear infinite;
			font-size: 1.5rem;

			&.reverse {
				animation-direction: reverse;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee span {
			animation-play-state: paused !important;
		}
	}

	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(-100% - $gap));
		}
	}
</style>
