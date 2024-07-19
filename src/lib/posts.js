import { remark } from "remark";
import html from "remark-html";

// Your Google Sheets API key
var apiKey = "AIzaSyCu_BIeMbIZkhCK0jVLYZXbtGD0oXmGLTY";

// Your Google Sheets ID
var spreadsheetId = "1jG3A3HxHDcouQfWMp93ZkWNVe43LrMdS1DIiwLQYHiQ";
var spreadsheetRange = "'Form Responses 1'!A2:H";

var spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${spreadsheetRange}?key=${apiKey}`;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.log("No data found.");
      return [];
    }

    const rows = data.values;

    const postsData = rows.map((row, index) => {
      var myDate = new Date(row[6]);
      var dateStr = myDate.getFullYear().toString().concat( "-" , myDate.getMonth().toString() , "-" , myDate.getDay().toString());

      let img_id = row[5].split("id=")[1];
      let img_link = `https://drive.google.com/thumbnail?id=${img_id}`;


      console.log(dateStr);
      return {
        id: index.toString(),
        title: row[1] || "",
        short: row[2] || "",
        link: row[4] || "",
        image: img_link || "",
        date:  myDate.toISOString() || "",
        author: row[3] || "",
      };
    });
    return postsData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function getSortedPostsData() {
  var postsData = await fetchData(spreadsheetUrl);

  return postsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getCategoryPosts(cat_id) {
  var postsData = await fetchData(spreadsheetUrl);

  const categoryPosts = postsData.filter(post => post.categories && post.categories.includes(cat_id));

  return categoryPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPaginatedPostsData(limit, page) {
  var postsData = await fetchData(spreadsheetUrl);

  postsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  const paginatedPosts = postsData.slice((page - 1) * limit, page * limit);
  return { posts: paginatedPosts, total: postsData.length };
}

export async function getFeaturedPostsData(ids) {
  var postsData = await fetchData(spreadsheetUrl);

  const featuredPosts = postsData.filter(post => ids.includes(post.id));

  return featuredPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getRelatedPosts(current_id) {
  var postsData = await fetchData(spreadsheetUrl);

  const relatedPosts = postsData.filter(post => post.id !== current_id);

  return relatedPosts.sort((a, b) => {
    if (a.category > b.category) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAllPostsIds() {
  var postsData = await fetchData(spreadsheetUrl);

  return postsData.map(post => {
    return {
      params: {
        id: post.id,
      },
    };
  });
}

export async function getPostData(id) {
  var postsData = await fetchData(spreadsheetUrl);

  const post = postsData.find(post => post.id === id);

  if (!post) {
    console.error(`Post with id ${id} not found.`);
    return null;
  }

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(post.body);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...post,
  };
}
