<script lang="ts">
    // TODO: connect to game API
    let guess = 0;

    function checkGuess() {
        if (guess === data.number) {
            alert('You guessed correctly!');
        } else {
            alert(`You guessed ${guess} but the number was ${data.number}`);
        }
    }

    export let data;
</script>

<main>
    <h1>Number Guessing</h1>

    <p>Guess a number from 1-5</p>

    <input type="number" bind:value={guess} min="1" max="5" />

    <button on:click={checkGuess}>Check Guess</button>
</main>