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
        else:
            new_ratings.append({
                'username': scrape_user,
                'animename': anime,
                'comment': "",
                'star': 0
            })

    new_user_ratings = pd.DataFrame(new_ratings)
    updated_ratings = pd.concat([ratings, new_user_ratings], ignore_index=True)

    return updated_ratings

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

    print(ratings_matrix)

    # Compute user similarity
    user_similarity = cosine_similarity(ratings_matrix)

    # Convert similarity matrix to DataFrame for easier processing
    user_similarity_df = pd.DataFrame(user_similarity, index=ratings_matrix.index, columns=ratings_matrix.index)

    print(user_similarity_df)

    # Extract similarity scores for the current user
    if current_user not in user_similarity_df.index:
        return {"error": f"User '{current_user}' not found in the dataset."}

    current_user_similarity = user_similarity_df[current_user]

    print(current_user_similarity)

    # Sort users by similarity, exclude self (similarity = 1)
    similar_users = (
        current_user_similarity[current_user_similarity < 1]  # Exclude self
        .sort_values(ascending=False)  # Sort by similarity descending
        .head(10)  # Get top 10 users
    )

    # Convert to a list of dictionaries for output
    top_users = [{"user": user, "similarity": similarity} for user, similarity in similar_users.items()]

    return top_users
    

if __name__ == '__main__':
    args = json.loads(sys.argv[1])
    print(json.dumps(find_similar_movies("scrape_user", args)))