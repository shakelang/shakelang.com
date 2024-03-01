---
title: Moved Utility Packages
date: 2023-12-25 00:00:00
authors: [nsc-de, shakelang]
tags:
  [
    shake,
    shakelang,
    library,
    api,
    util,
    utilities,
    com.shakelang.shake.util,
    com.shakelang.util,
  ]
---

We've decided, to move our utility packages from group `com.shakelang.shake.util` to `com.shakelang.util`. We've wanted to do this change
for a longer time now and decided that it is better to do such things in early development. Nevertheless this was a big refactoring change
including more than 400 files. Additionally we've also moved all packages from `com.shakelang.shake.util` to `com.shakelang.util`.

**THIS IS A BREAKING CHANGE. WE'VE DECIDED NOT TO INCREMENT THE MAJOR, AS WE ARE STILL IN A BETA PHASE FOR ALL THE AFFECTED PACKAGES**

Here is a list of all affected packages:

- changelog (now `com.shakelang.util.changelog`)
- colorlib (now `com.shakelang.util.colorlib`)
- common-io (now `com.shakelang.util.common-io`)
- environment (now `com.shakelang.util.environment`)
- jvmlib (now `com.shakelang.util.jvmlib`) _(unreleased)_
- logger (now `com.shakelang.util.logger`)
- markdown (now `com.shakelang.util.markdown`)
- parseutils (now `com.shakelang.util.parseutils`)
- pointers (now `com.shakelang.util.pointers`)
- primitives (now `com.shakelang.util.primitives`)
- sarifmerge (now `com.shakelang.util.sarifmerge`)
- shason (now `com.shakelang.util.shason`)
- testlib (now `com.shakelang.util.testlib`)
