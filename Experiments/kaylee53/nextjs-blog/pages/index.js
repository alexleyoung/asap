import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className="text-cyan-400">Hi, I am Kaylee!!</p>
        <p>
          (Lets go to my <a href="posts/first-post">first post</a>!)
        </p>
      </section>
    </Layout>
  );
}
