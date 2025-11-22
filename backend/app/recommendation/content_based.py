import re
import nltk
import pandas as pd
from neo4j import GraphDatabase
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# -----------------------------
# NLTK SETUP
# -----------------------------
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
stop_words = set(stopwords.words("english"))
# -----------------------------
# TEXT PREPROCESSING
# -----------------------------
def preprocess_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

# -----------------------------
# JACCARD SIMILARITY
# -----------------------------
def jaccard_similarity(list1, list2) -> float:
    set1, set2 = set(list1 or []), set(list2 or [])
    if not set1 or not set2:
        return 0.0
    return len(set1 & set2) / len(set1 | set2)

# -----------------------------
# FETCH MOVIE DATA FROM NEO4J
# -----------------------------
def fetch_movies(driver) -> pd.DataFrame:
    def run_query(query, expected_cols):
        with driver.session() as session:
            result = session.run(query)
            df = pd.DataFrame([dict(r) for r in result])
            # Ensure expected columns exist
            for col in expected_cols:
                if col not in df.columns:
                    df[col] = None
            return df

    plots_df = run_query(
        "MATCH (m:Movie) RETURN m.imdb_id AS imdb_id, m.title AS title, m.plot AS plot",
        ["imdb_id", "title", "plot"]
    )

    genres_df = run_query(
        "MATCH (m:Movie)-[:BELONGS_TO_MOVIE]->(g:Genre) "
        "RETURN m.imdb_id AS imdb_id, collect(g.name) AS genres",
        ["imdb_id", "genres"]
    )

    actors_df = run_query(
        "MATCH (m:Movie)<-[:ACTED_IN]-(a:Actor) "
        "RETURN m.imdb_id AS imdb_id, collect(a.name) AS actors",
        ["imdb_id", "actors"]
    )

    directors_df = run_query(
        "MATCH (m:Movie)<-[:DIRECTED]-(d:Director) "
        "RETURN m.imdb_id AS imdb_id, collect(d.name) AS directors",
        ["imdb_id", "directors"]
    )

    keywords_df = run_query(
        "MATCH (m:Movie)-[:HAS_KEYWORD]->(k:Keyword) "
        "RETURN m.imdb_id AS imdb_id, collect(k.name) AS keywords",
        ["imdb_id", "keywords"]
    )

    # Merge all attributes safely
    df = plots_df.merge(genres_df, on="imdb_id", how="left") \
                 .merge(actors_df, on="imdb_id", how="left") \
                 .merge(directors_df, on="imdb_id", how="left") \
                 .merge(keywords_df, on="imdb_id", how="left")

    # Fill empty lists
    for col in ["genres", "actors", "directors", "keywords"]:
        df[col] = df[col].apply(lambda x: x if isinstance(x, list) else [])

    df["plot"] = df["plot"].fillna("")
    df["processed_plot"] = df["plot"].apply(preprocess_text)

    return df

# -----------------------------
# MAIN CONTENT-BASED RECOMMENDER
# -----------------------------
def get_content_recommendations(movie_title: str, driver, top_n: int = 5):
    movies_df = fetch_movies(driver)
    if movies_df.empty:
        return []

    # Build TF-IDF matrix
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(movies_df["processed_plot"])

    # Locate movie
    idx_list = movies_df.index[movies_df["title"].str.lower() == movie_title.lower()]
    if len(idx_list) == 0:
        return []

    idx = idx_list[0]
    target_row = movies_df.iloc[idx]

    # Plot similarity
    movies_df["plot_similarity"] = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()

    # Categorical similarities
    movies_df["genre_similarity"]    = movies_df["genres"].apply(lambda x: jaccard_similarity(target_row["genres"], x))
    movies_df["actor_similarity"]    = movies_df["actors"].apply(lambda x: jaccard_similarity(target_row["actors"], x))
    movies_df["director_similarity"] = movies_df["directors"].apply(lambda x: jaccard_similarity(target_row["directors"], x))
    movies_df["keyword_similarity"]  = movies_df["keywords"].apply(lambda x: jaccard_similarity(target_row["keywords"], x))

    # Weighted sum
    movies_df["overall_similarity"] = (
        0.4 * movies_df["plot_similarity"] +
        0.2 * movies_df["genre_similarity"] +
        0.2 * movies_df["actor_similarity"] +
        0.1 * movies_df["director_similarity"] +
        0.1 * movies_df["keyword_similarity"]
    )

    # Exclude target movie and return top N
    recommendations = (
        movies_df[movies_df.index != idx]
        .sort_values(by="overall_similarity", ascending=False)
        .head(top_n)
        [["title", "overall_similarity"]]
    )

    return recommendations.to_dict(orient="records")
