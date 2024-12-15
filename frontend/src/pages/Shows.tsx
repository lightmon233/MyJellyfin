import MovieGrid from '../components/MovieGrid';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Show } from '../types';

const Shows = () => {
	const [shows, setShows] = useState<Show[]>([]);
	const [filteredShows, setFilteredShows] = useState<Show[]>(shows);

	const handleSearch = async (query: string) => {
    const params: { names: string[]; first_air_date_year?: string; language?: string } = {
      names: [query],
    };

    // 使用正则表达式解析 `primary_release_year`
    const yearMatch = query.match(/y:(\d{4})/);
    if (yearMatch) {
      params.first_air_date_year = yearMatch[1];
      params.names = [params.names[0].replace(yearMatch[0], '').trim()]; // 从查询中移除 `y:2015`
    }

    // 使用正则表达式解析 `language`
    const languageMatch = query.match(/l:([a-z-]+)/i);
    if (languageMatch) {
      params.language = languageMatch[1];
      params.names = [params.names[0].replace(languageMatch[0], '').trim()]; // 从查询中移除 `l:zh-CN`
    }

    handleScrape(params);
  }

	const handleScrape = async ({
    names, first_air_date_year, language
  }: {
    names: string[];
    first_air_date_year?: string;
    language?: string;
  }) => {    
    try {
      const folderString = names.join(',,');
      console.log(folderString);

      // const params: {
      //   names: string,
      //   primary_release_year?: string,
      //   language?: string
      // } = { names: folderString };

      // if (primary_release_year) {
      //   params.primary_release_year = primary_release_year;
      // }
      // if (language) {
      //   params.language = language;
      // }

      const response = await axios.get('/api/shows/scrape', {
        params: {
          names: folderString,
          ...(first_air_date_year && { first_air_date_year }),
          ...(language && { language })
        },
        timeout: 60000
      });
      console.log("reponse:", response);
      console.log("folder's names sent to backend:", names);
      fetchShows();
    } catch (error) {
      console.error("error when sending folders' names:", error);
    }
  };

	const handleFilter = (query: string) => {
    // setFilteredMovies(movies);
    // if (query.trim() != '') {
    //   const filtered = filteredMovies.filter(movie =>
    //     movie.title.toLowerCase().includes(query.toLowerCase())
    //   );
    //   setFilteredMovies(filtered);
    // }
    // 以上代码有bug是因为 filteredMovies 的状态更新是异步的。
    // 在调用 setFilteredMovies 后，状态不会立即更新，
    // 而是会等到下一个渲染周期才生效。因此，console.log(filteredMovies) 
    // 打印出来的值还是之前的状态，而不是刚刚更新后的值。

    // 总结：如果filter自己后在赋给自己的话就会出问题，问题就是减字符的时候页面会保持不变
    // 应该是因为这样操作的话，自己就真的被filter了，每次filter都会是自己的集合缩小，
    // 所以即时再减字符也不能使得集合再变大

    if (query.trim() === '') {
      setFilteredShows(shows);
    } else {
      const filtered = shows.filter(show =>
        show.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredShows(filtered);
    }
    console.log(shows);
    console.log(filteredShows);
  }

	const fetchShows = async () => {
    try {
      const response = await axios.get('/api/shows/getinfo');
      setShows(response.data);
      setFilteredShows(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching shows:', error);
      return [];
    } finally {
      // 把callback放在finally块中，可以确保在try-catch执行后，无论是否发生异常都调用callback
    }
  };

	useEffect(() => {
		fetchShows();
	}, [])

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			<Header onSearch={handleSearch} onScrape={handleScrape} onFilter={handleFilter} page="shows"/>
			<main className="flex-1 overflow-y-auto p-6">
				<MovieGrid movies={filteredShows} />
			</main>
		</div>
	);
}

export default Shows;