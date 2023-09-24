USE NS data;
DEFINE DATABASE data;

DEFINE TABLE user SCHEMAFULL PERMISSIONS NONE;
    DEFINE FIELD firstName ON TABLE user TYPE string;
    DEFINE FIELD lastName ON TABLE user TYPE string;
    DEFINE FIELD sessions ON TABLE user TYPE array<record<session>>;

DEFINE TABLE game SCHEMAFULL PERMISSIONS NONE;
    DEFINE FIELD name ON TABLE game TYPE string;

DEFINE TABLE session SCHEMAFULL PERMISSIONS NONE;
    DEFINE FIELD game ON TABLE session TYPE record<game>;
    DEFINE FIELD points ON TABLE session TYPE int;
    DEFINE FIELD data ON TABLE session TYPE object;
    DEFINE FIELD user ON TABLE session TYPE record<user>;
