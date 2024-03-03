// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type State =
		| ['permissionDenied', state?: never]
		| ['home', state?: never]
		| ['checkPlayer', state?: never]
		| ['writing', state: string]
		| ['newPlayer', state?: never]
		| ['findPlayer', state?: never]
		| ['initializationError', state?: never]
		| ['eraseData', state?: never];

	namespace App {
		interface PageState {
			state?: State;
		}
	}
}

export {};
