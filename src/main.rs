use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Client;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    // initialize tracing
    tracing_subscriber::fmt::init();

    // setup db
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    // Signin as a namespace, database, or root user
    db.signin(Root {
        username: "root",
        password: "root",
    })
    .await?;

    db.use_ns("data").use_db("data").await?;

    let app = Router::new()
        .route("/users", post(create_user))
        .route("/users", get(get_users))
        .with_state(db);

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

async fn create_user(
    State(db): State<Surreal<Client>>,
    Json(payload): Json<User>,
) -> axum::response::Result<(StatusCode, Json<Vec<User>>), StatusCode> {
    // make a user
    let created: Vec<User> = db
        .create("user")
        .content(User {
            first_name: payload.first_name,
            last_name: payload.last_name,
        })
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(created)))
}

async fn get_users(State(db): State<Surreal<Client>>) -> axum::response::Result<Json<Vec<User>>> {
    // get all users
    let users: Vec<User> = db
        .select("user")
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(users))
}

#[derive(Serialize, Deserialize, Debug)]
struct User {
    first_name: String,
    last_name: String,
}
