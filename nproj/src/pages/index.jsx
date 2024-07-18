import React from "react";
import Layouts from "@layouts/Layouts";
import dynamic from "next/dynamic";


import HeroOneSection from "@components/sections/HeroOne";
import LatestPostsSection from "@components/sections/LatestPosts";
import { getSortedPostsData } from "../lib/posts";


export default function Home1({ allPostsData }) {
  return (
    <Layouts>
      <HeroOneSection /> 
      <LatestPostsSection posts={allPostsData}/>
      
    </Layouts>
  );
}

/*
const Home1 = (props) => {
  return (
    <Layouts>
      <HeroOneSection />      
      <LatestPostsSection posts={props.posts}/>
    </Layouts>
  );
};
export default Home1;
*/

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}