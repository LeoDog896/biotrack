# API

If you're looking for a more convenient way to access the API,
see the [bindings](./bindings.md).

```mermaid
sequenceDiagram
    Card Scanner->>Server: Join <id>
    Server->>Game: Client requested join
    Game->>Server: Acknowledge
    Server->>Card Scanner: Notify Game Start
    Game->>Server: Finish Game
    Server->>Card Scanner: Notify Finish Game
```

## GET `/game/<id>/queue`

Stream of player join events for a game. Returns a stream of JSON objects,
each with a `player` and `time` field.

## GET `/game/<id>/queue/all`

Returns a list of all join events for a game. Useful if your
client doesn't support streaming.

## POST `/game/<id>/join`

Join a game with a `player` uuid.
This does not guarantee that the player _joins_ the game;
rather, the player sends a request to join.

## GET `/game/<id>/session`

Returns a game's active session, if any.

## POST `/game/<id>/ack`

Acknowledge a join event. Requires a list of `joinRequest` uuids to acknowledge.
Returns a session id.

## POST `/game/<id>/finish`

Finish a session with a `score` and `data` as a String.
If `continue` is true, a score block will still be created,
but the session will not be marked as finished.

## POST `/player/<id>/create`

Create a player with a `name`.
