# biotrack

simple game tracking service for different players & games.

## API

### GET `/<id>/queue`

Stream of player join events for a game. Returns a stream of JSON objects,
each with a `player` and `time` field.

### GET `/<id>/queue/all`

Returns a list of all join events for a game. Useful if your
client doesn't support streaming.

### POST `/<id>/join`

Join a game with a `player` uuid.

### GET `/<id>/active`

Check if a game is active. Returns a boolean.

### POST `/<id>/ack`

Acknowledge a join event. Requires a list of `player` uuids to acknowledge.
Returns a session id.

### POST `/<id>/finish`

Finish a session with a `score` and `data` as a String.
If `continue` is true, a score block will still be created,
but the session will not be marked as finished.
