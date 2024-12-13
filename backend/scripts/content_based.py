import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import sys
import io

def find_similar_movies(title, overview, csv_path="Movies_Dataset.csv", top_n=5):
    # 加载电影数据库
    try:
        movies_df = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"错误：未找到文件 {csv_path}。")
        sys.exit(1)

    # 确保 CSV 文件中包含必要的列
    if 'title' not in movies_df.columns or 'overview' not in movies_df.columns:
        print("错误：CSV 文件必须包含 'title' 和 'overview' 列。")
        sys.exit(1)

    # 创建独立的数据副本以避免修改原始数据
    temp_movies_df = movies_df.copy()

    # 处理缺失的简介内容并确保数据类型为字符串
    temp_movies_df['overview'] = temp_movies_df['overview'].fillna('').astype(str)

    # 将输入的电影信息添加到临时数据集中以进行比较
    input_movie = {'title': title, 'overview': overview}
    temp_movies_df = pd.concat([temp_movies_df, pd.DataFrame([input_movie])], ignore_index=True)

    # 使用 TF-IDF 对简介进行向量化
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(temp_movies_df['overview'])

    # 初始化 KNN 模型
    knn = NearestNeighbors(n_neighbors=top_n + 1, metric='cosine')
    knn.fit(tfidf_matrix)

    # 找到输入电影（最后一条）的最近邻
    distances, indices = knn.kneighbors(tfidf_matrix[-1], n_neighbors=top_n + 1)

    # 排除输入电影本身（距离为 0）
    similar_indices = indices[0][1:]

    # 获取 top_n 相似电影
    similar_movies = temp_movies_df.iloc[similar_indices][['title', 'overview']]

    # 将结果返回为字典列表
    return similar_movies.to_dict(orient='records')

# 示例用法
if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    # 输入示例
    input_title = "Inception"
    input_overview = "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."

    # 电影数据库 CSV 文件路径
    csv_file_path = "datasets/Movies_Dataset.csv"

    # 查找并打印相似电影
    recommendations = find_similar_movies(input_title, input_overview, csv_path=csv_file_path, top_n=5)

    for movie in recommendations:
        print(f"{movie['title']} {movie['overview'][:100]}...")

