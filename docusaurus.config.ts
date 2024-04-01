import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

interface DocEntry {
  readonly label?: string;
  readonly index?: string;
  readonly id: string;
  readonly path: string;
  readonly url: string;
}

interface PackageEntry {
  readonly label?: string;
  readonly id: string;
  readonly path: string;
  readonly url: string;
}

const config: Config = {
  title: "Shake Programming Language Specification",
  tagline:
    "Shake is a statically typed, compiled, and garbage collected language",
  favicon: "img/favicon.ico",
  staticDirectories: ["static"],

  url: "https://spec.shakelang.com",

  baseUrl: "/",

  organizationName: "shakelang",
  projectName: "shake",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/shakelang/specification/tree/master/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Shake",
      logo: {
        alt: "Shake Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://specification.shakelang.com",
          label: "Specification",
          position: "right",
        },
        {
          href: "https://github.com/shakelang/shake",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/shake",
            },
            {
              label: "Discord",
              href: "https://discord.gg/kXjgJ4gV9K",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/shakelang",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/shakelang/shake",
            },
            {
              label: "Contact",
              to: "/contact",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              label: "Privacy Policy",
              href: "https://shakelang.com/privacy-policy",
            },
            {
              label: "Cookie Policy",
              href: "https://shakelang.com/cookies",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nicolas Schmidt. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["antlr4"],
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    "docusaurus-plugin-sass",
    require.resolve("docusaurus-lunr-search"),
  ],
};

export default config;
