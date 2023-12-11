---
title: Working on new Bytecode-Based interpreter
date: 2023-12-12 00:00:00
authors: [nsc-de, shakelang]
tags: [shake, shakelang, shake-lang, build, website]
---

Our main goal at the moment is to make a new working build of shake using the actual codebase. 

We habe decided to not update the `interpreter` package, which interprets the code on the old demo builds, further with the main 
codebase. At the moment it is still codebase, but ignored in the build process (as it is not up-to-date with breaking changes to the 
parser). 

The reason for this decision is that we want to migrate to an instruction based bytecode interpreter as shake interpreter. If you want to know more about this topic and why we made that decision you can read it [here](#technical-considerations).

Because of that reason we have to rewrite the whole interpreter codebase as well as a generator to generate the required bytecode
instructions. Also the instructions will be generated from the output of the shake processor, so for a working build we have to
make the processor ready as well. The processor is in a mostly working state at the moment, but it is not well tested, so there might
be a lot of bugs. 

All of these chages are quite a lot to handle and will need some time. But, they are our main focus point.
When we are ready for alpha builds of the new bytecode-based interpreter, we will also release them to the demo on the website.

Overall we decided to not maintain the old interpreter anymore, because it becomes obsolete as soon as the new interpreter is ready, so
we are better of focussing our limited work-capacity on the new interpreter.

## Technical considerations

When compiling code we need to generate an abstract syntax tree (AST). You can imagine an AST like a mindmap of your whole programm. 
A generator generates something new out of that AST. 

Our old interpreter was basically a visitor of an AST, so we have an add node with two values, we generate just the result. There are a 
few problems with this aproach. The biggest problem is, that we have to work with  the whole AST the whole time. So we need to store such 
a mind-map of the whole programm in memory while it is executing. 
This drastically slows down our programm and generates a lot of unnescessary junk stored in the memory. 

The new apporach is to create a list of (which is basically just a big byte array and a pointer index). This is much cleaner and faster. 
We can also decide to compile the code to bytecode (while building the code) for even better performance (especially when starting the 
programm) (e.g. java does this when compiling `.java` files to `.class` files). 

An advanced benefit is that we have controll over the amount of instructions we want to visit at all time. On the website-demo for 
example, the whole website is paused while the code is running (because javascript is a single-threaded language). If you are just doing 
small calculations (like 10000 steps) this is no problem, but by inserting some bigger loop structure (or non-deterministic loop) you can 
crash the website. If we limit the amount of "ticks" (one tick refers to one visited operation) to 10000/s, the website would run just 
fine, even if we input a non-deterministic loop. For such cases we can then add a terminate button.
