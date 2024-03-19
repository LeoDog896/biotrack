<script lang="ts">
	export let data;
</script>

<main>
	<form action="?/login" method="POST">
		<h1><img src="/logo.svg" alt="biotrack" /> Log In</h1>
		<input type="text" name="username" placeholder="Username" required />
		<input type="password" name="password" placeholder="Password" required />
		<button type="submit">Log In</button>
		<p>having trouble logging in? contact an admin.</p>
		<p class="grey">biotrack</p>
		{#if data.local}
			<p>You are on the <u>local computer</u>. Perhaps, you would like to <a href="/orchestrator">manage officers</a>?</p>
		{/if}
	</form>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	form {
		border: 2px solid black;
		padding: 20px;
		width: 300px;
		text-align: center;
		display: flex;
		flex-direction: column;
	}

	input {
		display: block;
		margin: 10px 0;
		margin-top: 0;
	}

	p.grey {
		margin: 0;
		color: grey;
	}

	img {
		width: 2rem;
		height: 2rem;
	}

	h1 {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	button {
		margin-top: 1rem;
		background-color: white;
		border: 2px solid black;
		width: 100%;

		&:hover {
			background-color: var(--color);
			color: white;
		}
	}
</style>
