import sys
import json
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

csv_path = 'datasets/Ratings_Dataset.csv'

def insert_user_ratings(scrape_user, scraped_movies, ratings):
    all_anime = ratings['animename'].unique()

    new_ratings = []

    for anime in all_anime:
        if anime in scraped_movies:
            new_ratings.append({
                'username': scrape_user,
                'animename': anime,
                'comment': "",
                'star': 10  # Directly using integer for simplicity
            })

    new_user_ratings = pd.DataFrame(new_ratings)
    updated_ratings = pd.concat([ratings, new_user_ratings], ignore_index=True)

    return updated_ratings

def predict_rating(username, animename, ratings_matrix, user_similarity, k=5):
    user_index = ratings_matrix.index.get_loc(username)
    item_index = ratings_matrix.columns.get_loc(animename)

    # Find the k most similar users to the target user (excluding the user itself)
    similar_users = np.argsort(user_similarity[user_index])[::-1][1:k+1]
    similar_ratings = ratings_matrix.iloc[similar_users, item_index].values

    # Only consider users who have rated this anime
    valid_ratings = similar_ratings[similar_ratings != 0]
    
    # Calculate global average rating in the function to avoid using global variables
    global_average = ratings_matrix.mean().mean()  # Mean of all ratings in the matrix
    
    # If no valid ratings, return the average rating of the anime or a default value
    if len(valid_ratings) == 0:
        return global_average if not np.isnan(global_average) else 5  # Default to 5 if global average is NaN

    user_similarity_scores = user_similarity[user_index][similar_users]
    valid_similarity_scores = user_similarity_scores[:len(valid_ratings)]

    # Predict rating, handle potential NaN by using np.nansum
    numerator = np.nansum(valid_ratings * valid_similarity_scores)
    denominator = np.nansum(np.abs(valid_similarity_scores))

    # Check if denominator is 0 to avoid division by zero
    if denominator == 0:
        return global_average if not np.isnan(global_average) else 5  # Default to 5 if global average is NaN
    
    predicted_rating = numerator / denominator
    return predicted_rating

def find_similar_movies(current_user, scraped_movies):
    try:
        ratings = pd.read_csv(csv_path)
    except FileNotFoundError:
        return {"error": f"File not found: {csv_path}"}

    ratings = insert_user_ratings(current_user, scraped_movies, ratings)

    # Convert 'star' to integer
    ratings['star'] = ratings['star'].str.extract(r'stars(\d+)', expand=False).fillna(0).astype(int)
    ratings = ratings.drop_duplicates(subset=['username', 'animename'], keep='first')

    ratings_matrix = ratings.pivot(index='username', columns='animename', values='star').fillna(0)

    # Compute user similarity
    user_similarity = cosine_similarity(ratings_matrix)

    # Get anime that the current user has not rated
    anime_not_rated_by_current = ratings_matrix.columns[~ratings_matrix.loc[current_user].astype(bool)]

    # Predict ratings for unrated anime
    predictions = []
    for animename in anime_not_rated_by_current:
        predicted_rating = predict_rating(
            username=current_user,
            animename=animename,
            ratings_matrix=ratings_matrix,
            user_similarity=user_similarity,
            k=5
        )
        predictions.append((animename, predicted_rating))

    # Sort predictions by rating score and get top 5
    top_predictions = sorted(predictions, key=lambda x: x[1] if not np.isnan(x[1]) else 0, reverse=True)[:5]

    return {
        "recommendations": [anime for anime, _ in top_predictions],
        "predicted_ratings": {anime: score for anime, score in top_predictions if not np.isnan(score)}
    }

if __name__ == '__main__':
    args = json.loads(sys.argv[1])
    print(json.dumps(find_similar_movies("scrape_user", args)))