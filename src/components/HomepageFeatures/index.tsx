import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import undraw_portfolio_update from "@site/static/img/undraw_portfolio_update.svg";
import undraw_note_list from "@site/static/img/undraw_note_list.svg";
import undraw_product_iteration from "@site/static/img/undraw_product_iteration.svg";
import undraw_warning_re_eoyh from "@site/static/img/undraw_warning_re_eoyh.svg";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    Svg: undraw_portfolio_update,
    description: (
      <>
        Shake is a multiplattform compatible programming language. It is easy to
        learn and use. It combines the best parts of kotlin, typescript and
        java.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    Svg: undraw_note_list,
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </>
    ),
  },
  {
    title: "Flexible",
    Svg: undraw_product_iteration,
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </>
    ),
  },
  {
    title: "WARNING",
    Svg: undraw_warning_re_eoyh,
    description: (
      <>
        Shake is still in early development. It is not ready for production. At
        the moment I (the creator) am the only one working on it. If you want to
        help and contribute, please contact me.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
