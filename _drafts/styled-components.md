---
layout: post
title: "Managing Styling in React with Styled-Components 💅"
date: 2017-07-19 19:00:00 -0700
categories: [javascript, css, react, styled-compoents, web, programming]
comments: true
---
With React we have a ton of options at our disposal for handling styling: plain CSS,
SASS/LESS, CSS Modules, CSS-in-JS, just to name a few. I've played around with many of 
these options and have really grown to love CSS-in-JS using 
[Styled-Components](https://www.styled-components.com). It's the first thing I install
in a new app.

### Why I Chose Styled-Components
---
When I started using React, I was using SASS to handle my styles. It worked, but getting 
webpack to do what I wanted with React was often finicky enough, let alone throwing more
loaders for styles in the mix. When [create-react-app]() came out, I loved the simplicity
of development and build process that it brought, but doing SASS without ejecting meant
running a separate Gulp task for building styles.

Eventually, I grew tired of having styles in a separate file from the components they were
styling. Even if I kept the component definition and styles in the same location, it was
cumbersome for my workflow to switch back and forth. Plus, even with a proper linter,
`className` was something I would forget with disturbing regularity. This led me to try
inline-styling using plain javascript objects. This works, but I lose auto-prefixing (no 
way I'll remember to add them) and I don't like the camelCased syntax for properties (see 
`className`). Aphrodite, Glamour, etc all felt the same to me, and didn't always have
easy support for things like `:hover`.

[Sytled-Components](https://www.styled-components.com) fit for me right away. I can have my
styling right along with my component. Using template strings means that I'm writing actual
CSS properties and not camelCased javascript. It supports *all* of CSS as well, so no weird
handling of psuedo-classes. It does everything that I want it to do.

### Simple Example
---
Card Grid

### More Advanced Example
---
Button changing color

### Final Thoughts
---
