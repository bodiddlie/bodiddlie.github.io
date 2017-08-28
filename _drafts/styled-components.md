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
When I strated using React, I was using SASS to handle my styles. That worked fine unitl
I started working on my [headache diary]() project. One of the components I was building for
this project was scale for the user to record the level of pain they had experienced for
that day. At the time, I was unsure what the scale would be, and was thinking it might need
to be dynamic depending on what the user wanted to track. The color would range from green
to red, with an unknown number of segments. 

Doing this in SASS or straight CSS would have been hard as I wanted smooth color transitions
between the segments. I initially was using style props to generate the segments, but then I 
ran into the problem of not being able to use the `:hover` pseudo-class. This led me down the path
of creating a HOC to handle hover. Not long after that I thought that there must be a better way.
That's when I found [this wonderful talk]() by Max Stoiber introducing styled-components. 

My initial thought upon seeing the comparison chart in this talk was that it was too good to be true.
However, once I downloaded the library and started using it, I found that it fit every need that I 
was looking for and ones that I didn't realize I had. Styled-components supports all CSS. I was able to
use the psuedo-classes I was looking for, media queries were dead simple, and best of all, I was able
to organize my projects in a way that made so much more sense to me.

Separation of concerns is an important concept, but in a world of components, styling is really
not a separate concern from the logic of the component. These are things that are intrinsically
tied together. That's not to say that having separate CSS files is a bad practice. Developers
should do what works best for them and makes maintaining their projects easier. For me, using
styled-components to have my styling right there with my components makes the most sense.
Plus, I was able to avoid common mistakes that were always tripping me up; like using `class` when
it should be `className` or typing `font-size` as a JS property instead of `fontSize`. 

### Simple Example
---
Card Grid
{% include sandbox.html id="MjAgQ88oR" %}

### Features Not Even Metioned
---
Theming
Styling Existing Components

### Final Thoughts
---
