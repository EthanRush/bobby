import { PER_PAGE } from './stories/page/[page]'
import PaginatedBlog from '@components/PaginatedBlog'
import Pagination from '@components/Pagination'
import Link from "next/link";

import PageBanner from "@components/PageBanner";
import SubscribeSection from "@components/sections/Subscribe";
import Layouts from "@layouts/Layouts";

import { getPaginatedPostsData, getFeaturedPostsData } from "@library/posts";


export default function Blog ( { posts, totalPosts, currentPage } )  {
  return (
    <Layouts>
      <PageBanner pageTitle={"All Stories"} breadTitle={"Stories"} anchorLabel={"Publications"} anchorLink={"#blog"} paddingBottom={0} />
      {/* blog */}
      <section> 
        <div className="container mil-mt-suptitle-offset">
          
          <div className="row">
              <PaginatedBlog
                items={posts}
              />
              
              <Pagination
                currentPage={currentPage}
                totalItems={totalPosts}
                perPage={PER_PAGE}
                renderPageLink={(page) => `/stories/page/${page}`}
              />
          </div>
        </div>
      </section>
      {/* blog end */}

      <br></br>
    </Layouts>
  );
};

export async function getStaticProps() {
  const { posts, total } = await getPaginatedPostsData( PER_PAGE, 1 );

  return {
    props: {
      posts: posts,
      totalPosts: total,
      currentPage: 1,
    }
  }
}