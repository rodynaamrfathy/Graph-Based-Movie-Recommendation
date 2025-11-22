

# Graph-Based Movie Recommendation System

A **graph-based movie recommendation system** built with **Neo4j**, **FastAPI**, and **Python**, providing **content-based recommendations** based on movie plots, genres, actors, directors, and keywords.

---

## Features

* **Content-Based Recommendations**: Suggests movies similar to a given title.
* **Graph Database**: Utilizes **Neo4j** to store movies, genres, actors, directors, and keywords as nodes and relationships.
* **Text Preprocessing**: Cleans movie plots, removes stopwords, and tokenizes text for similarity calculations.
* **Similarity Calculation**:

  * TF-IDF for plot similarity
  * Jaccard similarity for categorical attributes (genres, actors, directors, keywords)
* **REST API**: Built with **FastAPI**, providing endpoints to fetch recommendations.

---

## Tech Stack

* **Backend**: Python 3.11, FastAPI
* **Database**: Neo4j (graph database)
* **Data Processing**: pandas, NLTK, scikit-learn
* **Machine Learning**: TF-IDF vectorization and cosine similarity

---

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/rodynaamrfathy/Graph-Based-Movie-Recommendation.git
cd Graph-Based-Movie-Recommendation
```

2. **Create and activate a virtual environment**:

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Install and run Neo4j**:

* Download Neo4j Desktop or use **Neo4j Aura**.
* Create a database and set your `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` as environment variables.

---

## Usage

1. **Start FastAPI server**:

```bash
uvicorn backend.app.main:app --reload
```

2. **Access API docs**:
   Open in browser: `http://127.0.0.1:8000/docs`

3. **Get content-based recommendations**:

```http
GET /recommend/content-based?movie_title=<MOVIE_NAME>&top_n=<NUMBER>
```

Example:

```
GET http://127.0.0.1:8000/recommend/content-based?movie_title=3%20Idiots&top_n=5
```

Response:

```json
[
  {"title": "Taare Zameen Par", "overall_similarity": 0.82},
  {"title": "Chhichhore", "overall_similarity": 0.75},
  ...
]
```

---

## Project Structure

```
Graph-Based-Movie-Recommendation/
├─ backend/
│  ├─ app/
│  │  ├─ main.py            # FastAPI entrypoint
│  │  ├─ neo4j_driver.py    # Neo4j connection setup
│  │  ├─ recommendation/
│  │  │  ├─ content_based.py
│  │  │  └─ ...
├─ data/                     # CSV datasets (movies, genres, actors, keywords)
├─ requirements.txt
├─ README.md
```

---

## NLTK Setup

The project uses **NLTK** for text preprocessing. Ensure the following resources are downloaded:

```python
import nltk
nltk.download("stopwords")
nltk.download("punkt")
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/my-feature`)
5. Open a Pull Request

