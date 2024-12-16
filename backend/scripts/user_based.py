import sys
import json
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity

sys.stdout.reconfigure(encoding='utf-8')
csv_path = 'datasets/Ratings_Dataset.csv'

def find_similar_movies(current_user, scraped_movies):
    try:
        # 读取数据并立即筛选
        ratings = pd.read_csv(
            csv_path, 
            usecols=['user_id', 'subject_id', 'rating'],
            dtype={
                'user_id': 'category', 
                'subject_id': 'category', 
                'rating': 'float32'
            }
        )
        
        # 按评分数量筛选top 1000个user和subject
        top_users = ratings['user_id'].value_counts().nlargest(1000).index
        top_subjects = ratings['subject_id'].value_counts().nlargest(1000).index
        
        # 过滤数据
        ratings = ratings[
            ratings['user_id'].isin(top_users) & 
            ratings['subject_id'].isin(top_subjects)
        ]
        
        # 去重
        ratings.drop_duplicates(subset=['user_id', 'subject_id'], keep='first', inplace=True)
        
        # 获取所有唯一的subject
        all_subjects = ratings['subject_id'].unique()
        
        # 创建新用户评分数据
        new_ratings = pd.DataFrame({
            'user_id': [current_user] * len(all_subjects),
            'subject_id': all_subjects,
            'rating': [10 if subject in scraped_movies else 0 for subject in all_subjects]
        })
        
        # 合并数据
        ratings = pd.concat([ratings, new_ratings], ignore_index=True)
        
        # 创建评分矩阵
        pivot_ratings = ratings.pivot_table(
            index='user_id', 
            columns='subject_id', 
            values='rating', 
            fill_value=0
        )
        
        # 转换为稀疏矩阵
        ratings_sparse = csr_matrix(pivot_ratings.values)
        
        # 计算用户相似度
        user_similarity = cosine_similarity(ratings_sparse)
        
        # 找出当前用户
        current_user_index = pivot_ratings.index.get_loc(current_user)
        
        # 获取相似用户
        similar_users_raw = user_similarity[current_user_index]
        
        # 找出相似但不完全相同的用户
        similar_users_indices = np.where(
            (similar_users_raw < 1.0) & (similar_users_raw > 0)
        )[0]
        
        # 对相似用户排序
        similar_user_scores = similar_users_raw[similar_users_indices]
        top_similar_indices = similar_user_scores.argsort()[-10:][::-1]
        
        # 获取实际的用户ID
        top_similar_users = [pivot_ratings.index[idx] for idx in similar_users_indices[top_similar_indices]]
        
        # 获取推荐作品
        similar_users_ratings = ratings[ratings['user_id'].isin(top_similar_users)]
        
        # 筛选推荐作品
        top_subjects = (
            similar_users_ratings[
                ~similar_users_ratings['subject_id'].isin(scraped_movies)
            ]
            .groupby('subject_id')['rating']
            .mean()
            .nlargest(5)
        )
        
        return {
            "similar_users": top_similar_users,
            "recommendations": top_subjects.index.tolist(),
            "subject_ratings": top_subjects.to_dict()
        }
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    args = json.loads(sys.argv[1])
    print(json.dumps(find_similar_movies("abcdefg", args)))