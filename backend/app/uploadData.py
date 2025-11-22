import csv
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

# -----------------------------
# Neo4j connection
# -----------------------------
load_dotenv()
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


# -----------------------------
# Load Movies
# -----------------------------
def load_movies(tx, csv_path):
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))
        tx.run(
            """
            UNWIND $rows AS row
            MERGE (m:Movie {imdb_id: row.imdb_id})
            SET m.title = row.title,
                m.year = row.year,
                m.runtime = row.runtime,
                m.rating = toFloat(row.rating),
                m.votes = toInteger(row.votes),
                m.plot = row.plot
            """,
            rows=reader
        )


# -----------------------------
# Load Actors
# -----------------------------
def load_actors(tx, csv_path):
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = [{"imdb_id": r["imdb_id"].strip(), "actor_name": r["actor_name"].strip()} for r in csv.DictReader(f)]
        tx.run(
            """
            UNWIND $rows AS row
            MERGE (a:Actor {name: row.actor_name})
            WITH a, row
            MATCH (m:Movie {imdb_id: row.imdb_id})
            MERGE (a)-[:ACTED_IN]->(m)
            MERGE (m)-[:FEATURED_IN]->(a)
            """,
            rows=reader
        )


# -----------------------------
# Load Directors
# -----------------------------
def load_directors(tx, csv_path):
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = [{"imdb_id": r["imdb_id"].strip(), "director_name": r["director_name"].strip()} for r in csv.DictReader(f)]
        tx.run(
            """
            UNWIND $rows AS row
            MERGE (d:Director {name: row.director_name})
            WITH d, row
            MATCH (m:Movie {imdb_id: row.imdb_id})
            MERGE (d)-[:DIRECTED]->(m)
            MERGE (m)-[:CREATED_BY]->(d)
            """,
            rows=reader
        )


# -----------------------------
# Load Genres
# -----------------------------
def load_genres(tx, csv_path):
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = [{"imdb_id": r["imdb_id"].strip(), "genre": r["genre"].strip()} for r in csv.DictReader(f)]
        tx.run(
            """
            UNWIND $rows AS row
            MERGE (g:Genre {name: row.genre})
            WITH g, row
            MATCH (m:Movie {imdb_id: row.imdb_id})
            MERGE (m)-[:BELONGS_TO_MOVIE]->(g)
            MERGE (g)-[:CONTAINS_MOVIE]->(m)
            """,
            rows=reader
        )


# -----------------------------
# Load Keywords
# -----------------------------
def load_keywords(tx, csv_path):
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = [{"imdb_id": r["imdb_id"].strip(), "keyword": r["keyword"].strip()} for r in csv.DictReader(f)]
        tx.run(
            """
            UNWIND $rows AS row
            MERGE (k:Keyword {name: row.keyword})
            WITH k, row
            MATCH (m:Movie {imdb_id: row.imdb_id})
            MERGE (m)-[:HAS_KEYWORD]->(k)
            MERGE (k)-[:RELATED_TO_MOVIE]->(m)
            """,
            rows=reader
        )


# -----------------------------
# Main function
# -----------------------------
def main():
    with driver.session() as session:
        print("Loading movies...")
        session.execute_write(load_movies, "data/movies.csv")

        print("Loading actors...")
        session.execute_write(load_actors, "data/movie_actor.csv")

        print("Loading directors...")
        session.execute_write(load_directors, "data/movie_director.csv")

        print("Loading genres...")
        session.execute_write(load_genres, "data/movie_genre.csv")

        print("Loading keywords...")
        session.execute_write(load_keywords, "data/movie_keyword.csv")

    print("All data loaded successfully!")


if __name__ == "__main__":
    main()
