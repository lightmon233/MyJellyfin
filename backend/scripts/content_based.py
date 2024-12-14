import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_similar_movies_by_id(movie_id, csv_path="Movies_Dataset.csv", top_n=5):
    """
    Find similar movies based on the overview content of a given movie.

    Args:
        movie_id (int): The ID of the input movie.
        csv_path (str): Path to the movie dataset CSV file.
        top_n (int): Number of similar movies to recommend.

    Returns:
        dict: A dictionary with the following keys:
              - "input_movie": Details of the input movie.
              - "recommendations": List of recommended movies (ID and title).
    """
    # Load movie dataset
    try:
        movies_df = pd.read_csv(csv_path)
    except FileNotFoundError:
        return {"error": f"File not found: {csv_path}"}

    # Ensure required columns are present
    required_columns = {'id', 'overview', 'title', 'vote_count', 'vote_average'}
    if not required_columns.issubset(movies_df.columns):
        return {"error": "CSV file must contain 'id', 'overview', 'title', 'vote_count', and 'vote_average' columns."}

    # Check if the input movie exists
    if movie_id not in movies_df['id'].values:
        return {"error": f"Movie ID {movie_id} not found in the dataset."}

    # Extract details of the input movie
    input_movie = movies_df[movies_df['id'] == movie_id]

    if input_movie.empty:
        return {"error": f"No data found for Movie ID {movie_id}."}

    min_vote_average = input_movie['vote_average'].values[0] * 0.8
    min_vote_count = input_movie['vote_count'].values[0] * 0.5

    # Filter movies based on vote_count and vote_average
    filtered_movies_df = movies_df[(movies_df['vote_count'] >= min_vote_count) & 
                                   (movies_df['vote_average'] >= min_vote_average)].copy()

    # Handle missing overviews and ensure they are strings
    filtered_movies_df['overview'] = filtered_movies_df['overview'].fillna('').astype(str)

    # Add the input movie to the temporary dataset for comparison
    temp_movies_df = pd.concat([filtered_movies_df, input_movie], ignore_index=True)

    # Use TF-IDF to vectorize the overviews
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(temp_movies_df['overview'])

    # Initialize KNN model
    knn = NearestNeighbors(n_neighbors=top_n + 1, metric='cosine')
    knn.fit(tfidf_matrix)

    # Find nearest neighbors for the input movie (last row)
    distances, indices = knn.kneighbors(tfidf_matrix[-1], n_neighbors=top_n + 2)

    # Exclude the input movie itself (distance = 0)
    similar_indices = indices[0][2:]

    # Prepare the recommendations
    recommendations = temp_movies_df.iloc[similar_indices][['id', 'title', 'release_date', 'poster_path', 'overview', 'vote_average']].to_dict(orient='records')

    # Return a structured response
    return {
        "input_movie": {
            "id": int(input_movie['id'].values[0]),
            "title": input_movie['title'].values[0],
            "vote_count": int(input_movie['vote_count'].values[0]),
            "vote_average": float(input_movie['vote_average'].values[0])
        },
        "recommendations": recommendations
    }

# Example usage
if __name__ == "__main__":
    # Parse arguments from command line
    if len(sys.argv) < 2:
        print("Usage: python script.py <movie_id> [csv_path]")
        sys.exit(1)

    input_movie_id = int(sys.argv[1])
    csv_file_path = sys.argv[2] if len(sys.argv) > 2 else "datasets/Movies_Dataset.csv"

    # Get recommendations
    result = find_similar_movies_by_id(input_movie_id, csv_path=csv_file_path, top_n=5)

    # Output result as JSON
    print(json.dumps(result, ensure_ascii=False, indent=4))

