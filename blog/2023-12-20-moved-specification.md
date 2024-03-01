---
title: Moved specification
date: 2023-12-20 00:00:00
authors: [nsc-de, shakelang]
tags: [shake, shakelang, specification, library, api]
---

We moved the specification to [specification.shakelang.com](https://specification.shakelang.com). The old specification url [shakelang.com/specification](https://shakelang.com/specification) will redirect to the new url.
We now use a separate repository and a separate docusaurus instance for the specification. This allows us to have a better overview of the specification and to have a better structure. We plan on making it much more detailed.

Besides the specification of the language, we are also writing specification for the packages we built as part of the shake project. This includes out `parseutils`, `common-io`, `primitives`, `shason` and many more utility packages.
They might be useful for other projects as well, so we decided to write specification and tutorials for them.

At the moment we only have a specification for the `shason` package, but we plan on adding more in the future.

As part of this restructuring, we also moved the dokka documentation of the shake project to a separate repository and
subdomain.

The dokka documentation is now moved to [dokka.shakelang.com](https://dokka.shakelang.com). (again, [shakelang.com/dokka](https://shakelang.com/dokka) will redirect to the new url

The reason for all these restructuring are smaller and more maintainable repositories as well as better performance in the builds.

We hope you like the new specification and the new dokka documentation. If you have any questions, feel free to ask them in our [discord server](https://discord.gg/kXjgJ4gV9K).
