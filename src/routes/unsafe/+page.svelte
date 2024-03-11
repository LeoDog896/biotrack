<div class="wrap">
	<main>
		<p><a href="/">&lt;- back home</a></p>
		<h1>Your connection is not private</h1>
		<h2>A small browser mishap</h2>
		<p>
			If your browser reports this page as unsafe, it is mistaken. While the warning is accurate
			(this page fakes an HTTPS certificate, which is unsafe, as it is not verified by a certificate
			authority), the page itself won't harm your computer, and it still remains encrypted from bad
			actors.
		</p>
		<p>
			What this means is that, as mentioned before, with no official certificate authority, this
			page is essentially acting like how a true malicious connection would act; by faking an HTTPS
			certificate, this <i>could</i> be some Man-in-the-Middle attack.
		</p>
	</main>
</div>

<style>
	.wrap {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	h1,
	h2 {
		text-align: center;
	}

	main {
		max-width: 800px;
		padding: 2rem;
	}
</style>
