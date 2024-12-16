const getBangumiSubjectId = async (animeName: string) => {
  const apiUrl = `https://api.bgm.tv/search/subject/${encodeURIComponent(animeName)}?type=2&limit=1`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`Http error! Status: ${response.status}`);
		}

		const data = await response.json();
		if (data && data.list && data.list.length > 0) {
			return data.list[0].id.toString();
		} else {
			return "";
		}
	} catch (error) {
		console.error('Error fetching Bangumi Subject ID:', error);
	}
}

async function getAnimeNameBySubjectId(subjectId: string) {
	const apiUrl = `https://api.bgm.tv/v0/subjects/${subjectId}`;

	try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			if (data && data.name) {
					return data.name; // 返回动画名称
			} else {
					return ""; // 没有找到对应的动画名称
			}
	} catch (error) {
			console.error('Error fetching anime name by Subject ID:', error);
			return null;
	}
}

export {
	getBangumiSubjectId,
	getAnimeNameBySubjectId
}