use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::env;
use surrealdb::opt::RecordId;
use surrealdb::Surreal;
use surrealdb::{
    engine::local::{Db, File},
    opt::Config,
};
use tokio::signal;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // initialize tracing
    tracing_subscriber::fmt::init();

    println!("Setting up database...");

    // setup db
    let config = Config::default().strict();
    let path = env::current_dir()?.join("database");
    println!("Database path: {:?}", path);
    let schema = if path.exists() {
        None
    } else {
        // import the schema
        Some(include_str!("../schema.surql"))
    };

    let db = Surreal::new::<File>(("C:\\Users\\LeoDo\\Documents\\GitHub\\biotrack\\database", config)).await?;
    if let Some(schema) = schema {
        db.query(schema).await?;
    }
    db.use_ns("data").use_db("data").await?;

    println!("Connected to database! Listening at http://localhost:3000");

    let app = Router::new()
        .route("/users", post(create_user))
        .route("/users", get(get_users))
        .route("/users/:id", get(get_user))
        .with_state(db);

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }

    println!("Shutting down...");
}

async fn create_user(
    State(db): State<Surreal<Db>>,
    Json(payload): Json<User>,
) -> axum::response::Result<(StatusCode, Json<Vec<User>>), (StatusCode, String)> {
    // make a user
    let created: Vec<User> = db
        .create("user")
        .content(User {
            first_name: payload.first_name,
            last_name: payload.last_name,
            sessions: vec![],
        })
        .await
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, format!("{}", err)))?;

    Ok((StatusCode::CREATED, Json(created)))
}

async fn get_users(
    State(db): State<Surreal<Db>>,
) -> axum::response::Result<Json<Vec<User>>, (StatusCode, String)> {
    // get all users
    let users: Vec<User> = db
        .select("user")
        .await
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, format!("{}", err)))?;

    Ok(Json(users))
}

async fn get_user(
    Path(id): Path<String>,
    State(db): State<Surreal<Db>>,
) -> axum::response::Result<Json<Option<User>>, (StatusCode, String)> {
    // get a user
    let response: Option<User> = db
        .select(("user", id))
        .await
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, format!("{}", err)))?;

    Ok(Json(response))
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct User {
    first_name: String,
    last_name: String,
    sessions: Vec<RecordId>,
}
