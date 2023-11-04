import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Logo from "@site/static/img/logo.svg";
import styles from "./index.module.css";
import { TryShake } from "../components/TryShake/intex";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          Shake is a high level, object-oriented, multi-targeting, modern
          programming language.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/reference"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Rster us a framework for building your restful backend api. Take a look at the rster documentation <head />"
    >
      <HomepageHeader />
      <main>
        <TryShake />

        <HomepageFeatures />
        <div className={styles.logo_container}>
          <Logo className={styles.logo}></Logo>
        </div>
      </main>
    </Layout>
  );
}
