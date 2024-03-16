<nav>
	<a href="/" class="title"><img src="/logo.svg" alt="biotrack" /> biotrack</a>
	<div class="links">
		<a href="/dashboard">dashboard</a>
		<a href="/player">players</a>
		<a href="/game">games</a>
		<a href="/scanner">check-in</a>
	</div>
</nav>

<main>
	<slot />
</main>

<footer>
	<div>
		having issues? <a href="/ping">ping everyone</a> or
		<a href="https://github.com/LeoDog896/biotrack/issues/new">report it on the bug tracker</a>
	</div>
</footer>

<style lang="scss">
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 2px solid black;
		height: 4rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			width: 2rem;
			height: 2rem;
		}
	}

	.links {
		display: flex;
		gap: 1rem;
	}

	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1rem;
		height: calc(100vh - 4rem - 4rem);
	}

	footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: center;
		padding: 1rem;
		height: 4rem;
		border-top: 2px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		z-index: 1;
	}

	:global(button) {
		cursor: pointer;
		border: 1px solid black;
		border-radius: 0;
		background-color: white;
		text-align: center;

		&:hover {
			background-color: var(--color);
			color: white;
		}
	}
</style>
