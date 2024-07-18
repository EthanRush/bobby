import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/data/posts");

// Your Google Sheets API key
var apiKey = "AIzaSyCu_BIeMbIZkhCK0jVLYZXbtGD0oXmGLTY";

// Your Google Sheets ID
var spreadsheetId = "1FWtzW59KP_GQPwRKtSl6C_H7yTCxr_NU2wsYjRPhFvU";
var spreadsheetRange = "'Form Responses 1'!A2:H";

var spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${spreadsheetRange}?key=${apiKey}`;

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.values) {
    console.log("No data found.");
    return;
  }

  const rows = data.values;

  const markdownData = rows.map((row) => {
    return `
        ---
        #preview
        title: '${row[0]}'
        date: '${row[1]}'
        image: "${row[2]}"
        category:
            - ${row[3]}
        categories:
            - ${row[3]}
        short: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius sequi commodi dignissimos.

        #full details
        introTitle: ${row[0]}<br> <span class="mil-thin">Marketing</span> Plan

        author:
            name: "Author Name"

        gallery:
            enabled: 1
            items:
                - image: /img/blog/4.jpg
                  alt: "image"

                - image: /img/blog/7.jpg
                  alt: "image"

        additional:
            enabled: 1
            content: "
                <h5>Voluptatem odit ullam veritatis</h5>
                <p>Modi sint reprehenderit vitae officiis pariatur, ab debitis voluptate ea eius assumenda beatae, tempora, dolores deserunt, ipsam ipsum! Quod ipsam consequuntur distinctio velit sed ipsum quisquam, itaque placeat error non animi quam aut similique nulla ab. Quaerat dicta, dolores veritatis magnam quae aut omnis in porro.</p>
            "
        ---

        Gutem temporibus quae facilis totam, dolorem laborum optio laudantium explicabo quia ea. Officia beatae excepturi adipisci? Nobis consequatur ullam officiis adipisci assumenda, voluptas optio, commodi, soluta itaque error consectetur cupiditate vero voluptatem architecto blanditiis quidem amet. Quod ipsam consequuntur distinctio velit sed ipsum quisquam, itaque placeat error non animi quam aut similique nulla ab. Quaerat dicta, dolores veritatis magnam quae aut omnis in porro.

        ###### Voluptatem odit ullam veritatis

        Omnis consectetur in libero! Quo animi minus sunt, excepturi inventore! Recusandae enim fugit saepe mollitia laboriosam minima sapiente laborum aspernatur ut! Voluptatibus tempora cupiditate nulla cum dicta odit unde eius sit molestias corrupti pariatur illum aspernatur blanditiis, dolor earum quidem incidunt eligendi magnam obcaecati iure quis corporis. Perspiciatis rem provident aliquid iusto temporibus, exercitationem voluptatibus accusamus amet ratione atque, dolor vel necessitatibus illo ipsa officia, sunt quia magni saepe velit ipsum sapiente blanditiis minima.

        - Voluptate aspernatur
        - Fugiat asperiores
        - Doloremque quidem porro
        - Numquam porro sequi
        - Laudantium quis

        Voluptatem odit ullam veritatis corrupti officia non aperiam eius vero amet, sed porro blanditiis, harum, quo fugit cupiditate. Maxime quaerat ratione
        `;
  });
  return markdownData;
}

export function getSortedPostsData() {
  var rows = fetchData(spreadsheetUrl);

  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  var allPostsData = fileNames
    .filter((fileName) => fileName.includes(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getCategoryPosts(cat_id) {
  // Get file names under /posts
  const allData = [];
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.includes(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      const cats = matterResult.data.categories;

      if (cats != undefined) {
        // Check current category
        if (cats.includes(cat_id)) {
          // Combine the data with the id
          allData.push({
            id,
            ...matterResult.data,
          });
        }
      }
    });
  // Sort posts by date
  return allData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPaginatedPostsData(limit, page) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.includes(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });
  // Sort posts by date
  allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  const paginatedPosts = allPostsData.slice((page - 1) * limit, page * limit);
  return { posts: paginatedPosts, total: allPostsData.length };
}

export function getFeaturedPostsData(ids) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allData = [];
  fileNames
    .filter((fileName) => fileName.includes(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      if (ids.includes(id)) {
        // Combine the data with the id
        allData.push({
          id,
          ...matterResult.data,
        });
      }
    });

  // Sort posts by date
  return allData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getRelatedPosts(current_id) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allData = [];

  fileNames
    .filter((fileName) => fileName.includes(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Exclude current id from result

      if (id != current_id) {
        // Combine the data with the id
        allData.push({
          id,
          ...matterResult.data,
        });
      }
    });

  // Sort posts by date
  return allData.sort((a, b) => {
    if (a.category > b.category) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostsIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.includes(".md"))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ""),
        },
      };
    });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

