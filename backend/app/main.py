import urllib

from fastapi import FastAPI, Depends, HTTPException, status, Body, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from . import neo4j_driver
import os
import uuid

from .neo4j_driver import driver
from .recommendation.content_based import get_content_recommendations

app = FastAPI(
    title="Movie Recs API (FastAPI + Neo4j)",
    description="This API provides movie recommendations based on actors, genre, and content.",
    version="1.0.0",
    docs_url="/swagger",     # Change Swagger UI path
    redoc_url="/redoc-ui"   # Change ReDoc path
)

FRONTEND = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", summary="Health Check", response_description="Returns API status")
def health_check():
    """
    Checks if the API is running and Neo4j is reachable.

    Returns:
        dict: {"status": "ok"} if successful.
    """
    try:
        with driver.session() as session:
            session.run("RETURN 1")
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# search by names
@app.post("/movies/", summary="Movie Details", response_description="Movie Details")
def movie_details(movie_name: str = Form(...)):
    query = """
    MATCH (m:Movie {title: $movie_name})
    RETURN m
    """
    with driver.session() as session:
        result = session.run(query, movie_name=movie_name)
        record = result.single()
        if record:
            return record["m"]
        else:
            return {"error": "Movie not found"}

# return all movies
@app.get("/movies/", summary="All Movies", response_description="List of all movies")
def get_all_movies():
    query = """
    MATCH (m:Movie)
    RETURN m
    ORDER BY m.title
    LIMIT 10
    """
    movies_list = []
    with driver.session() as session:
        result = session.run(query)
        for record in result:
            m = record["m"]
            imdb_id = m.get("imdb_id")
            movies_list.append({
                "imdb_id": imdb_id,
                "title": m.get("title"),
                "year": m.get("year"),
                "runtime": m.get("runtime"),
                "rating": m.get("rating"),
                "votes": m.get("votes"),
                "plot": m.get("plot"),
                "imdb_url": f"https://www.imdb.com/title/{urllib.parse.quote(imdb_id)}/" if imdb_id else None
            })
    return movies_list

# return a movie details
@app.get("/movies/id/{imdb_id}", summary="Get Movie by IMDb ID", response_description="Movie Details with Relations")
def get_movie_by_id(imdb_id: str):
    query = """
    MATCH (m:Movie {imdb_id: $imdb_id})
    OPTIONAL MATCH (m)<-[:ACTED_IN]-(a:Actor)
    OPTIONAL MATCH (m)<-[:DIRECTED]-(d:Director)
    OPTIONAL MATCH (m)-[:BELONGS_TO_MOVIE]->(g:Genre)
    OPTIONAL MATCH (m)-[:HAS_KEYWORD]->(k:Keyword)
    RETURN m, 
           collect(DISTINCT a.name) AS actors, 
           collect(DISTINCT d.name) AS directors, 
           collect(DISTINCT g.name) AS genres, 
           collect(DISTINCT k.name) AS keywords
    """
    with driver.session() as session:
        result = session.run(query, imdb_id=imdb_id)
        record = result.single()
        if record:
            m = record["m"]
            return {
                "imdb_id": m.get("imdb_id"),
                "title": m.get("title"),
                "year": m.get("year"),
                "runtime": m.get("runtime"),
                "rating": m.get("rating"),
                "votes": m.get("votes"),
                "plot": m.get("plot"),
                "imdb_url": f"https://www.imdb.com/title/{urllib.parse.quote(m.get('imdb_id'))}/" if m.get("imdb_id") else None,
                "actors": record["actors"],
                "directors": record["directors"],
                "genres": record["genres"],
                "keywords": record["keywords"]
            }
        else:
            return {"error": "Movie not found"}

# view movie details on IMDB
@app.get("/movies/imdb/{imdb_id}", summary="View Movie on IMDb", response_description="IMDb URL")
def view_movie_on_imdb(imdb_id: str):
    if not imdb_id:
        return {"error": "Invalid IMDb ID"}

    imdb_url = f"https://www.imdb.com/title/{urllib.parse.quote(imdb_id)}/"
    return {"imdb_id": imdb_id, "imdb_url": imdb_url}

# search movie by keyword
@app.get("/movies/search/", summary="Search Movies by Keyword", response_description="List of Movies")
def search_movies_by_keyword(keyword: str = Query(..., description="Keyword to search for")):
    query = """
    MATCH (m:Movie)-[:HAS_KEYWORD]->(k:Keyword)
    WHERE toLower(k.name) CONTAINS toLower($keyword)
    OPTIONAL MATCH (m)<-[:ACTED_IN]-(a:Actor)
    OPTIONAL MATCH (m)<-[:DIRECTED]-(d:Director)
    OPTIONAL MATCH (m)-[:BELONGS_TO_MOVIE]->(g:Genre)
    OPTIONAL MATCH (m)-[:HAS_KEYWORD]->(kw:Keyword)
    RETURN m,
           collect(DISTINCT a.name) AS actors,
           collect(DISTINCT d.name) AS directors,
           collect(DISTINCT g.name) AS genres,
           collect(DISTINCT kw.name) AS keywords
    LIMIT 20
    """
    movies = []
    with driver.session() as session:
        result = session.run(query, keyword=keyword)
        for record in result:
            m = record["m"]
            movies.append({
                "imdb_id": m.get("imdb_id"),
                "title": m.get("title"),
                "year": m.get("year"),
                "runtime": m.get("runtime"),
                "rating": m.get("rating"),
                "votes": m.get("votes"),
                "plot": m.get("plot"),
                "imdb_url": f"https://www.imdb.com/title/{urllib.parse.quote(m.get('imdb_id'))}/" if m.get("imdb_id") else None,
                "actors": record["actors"],
                "directors": record["directors"],
                "genres": record["genres"],
                "keywords": record["keywords"]
            })
    if movies:
        return movies
    else:
        return {"error": "No movies found for this keyword"}

# recommend by actor
@app.get("/MoviesRecommendByActor", summary="Movie Recommendation based on Actors", response_description="Movie Recommendations")
def movie_recommend_by_actor(movie_name: str = Form(...)):
    query = """
    MATCH (m:Movie {title: $movie_title})<-[:ACTED_IN]-(a:Actor)-[:ACTED_IN]->(rec:Movie)
    WHERE m <> rec
    WITH rec, COUNT(a) AS shared_actors
    RETURN rec.title AS RecommendedMovie,
           rec.rating AS Rating,
           rec.year AS Year,
           shared_actors
    ORDER BY shared_actors DESC, rec.rating DESC
    LIMIT 20
    """
    with driver.session() as session:
        result = session.run(query, movie_title=movie_name)
        recommendations = []
        for record in result:
            recommendations.append({
                "title": record["RecommendedMovie"],
                "rating": record["Rating"],
                "year": record["Year"],
                "shared_actors": record["shared_actors"]
            })

    if recommendations:
        return {"movie": movie_name, "recommendations": recommendations}
    else:
        return {"error": "No recommendations found for this movie"}

# recommend by genre
@app.get("/MoviesRecommendByGenre", summary="Movie Recommendation based on Genre", response_description="Movie Recommendations")
def movie_recommend_by_genre(movie_name: str = Form(...)):
    query = """
    MATCH (m:Movie {title: $movie_title})-[:BELONGS_TO_MOVIE]->(g:Genre)<-[:BELONGS_TO_MOVIE]-(rec:Movie)
    WHERE m <> rec
    WITH rec, COUNT(g) AS shared_genres
    RETURN rec.title AS RecommendedMovie,
           rec.rating AS Rating,
           rec.year AS Year,
           shared_genres
    ORDER BY shared_genres DESC, rec.rating DESC
    LIMIT 20
    """
    with driver.session() as session:
        result = session.run(query, movie_title=movie_name)
        recommendations = []
        for record in result:
            recommendations.append({
                "title": record["RecommendedMovie"],
                "rating": record["Rating"],
                "year": record["Year"],
                "shared_genres": record["shared_genres"]
            })

    if recommendations:
        return {"movie": movie_name, "recommendations": recommendations}
    else:
        return {"error": "No recommendations found for this movie"}

# recommend by content
@app.get("/recommend/content-based")
def content_based(movie_title: str, top_n: int = 5):
    """
    Content-based movie recommendation endpoint.
    """
    results = get_content_recommendations(movie_title, driver, top_n)

    if results is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    return {
        "movie": movie_title,
        "recommendations": results
    }