---
layout: post
title: "Thinking Critically About Redux In Your Application"
categories: [javascript, react, redux, web, programming]
date: 2016-12-05 12:00:00 -0700
comments: false
---
When someone new to React asks online how to handle state or passing of props in 
their application, the answer often includes learning and including Redux. While I
think that Redux is a fantastic library and I personally love using it, I wanted to
write this post to illustrate why it isn't always necessary or even a good idea.

### React !== Redux
---
When I first started learning React, nearly every blog post, article, or tutorial I read
also included Redux. Many places refer to the two as React/Redux, as if they are somehow
inseparable or part of one larger framework. This is unfortunate, as React itself presents
enough challenges to learning for beginners without the complexities of Redux thrown in.

Redux is a tool that you can add to an application, not a necessary part of React. React
isn't even necessary to use Redux, that's just where it is used most. Dan Abramov, the 
creator of Redux, wrote a [great post](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367#.u4inwzlbh) 
about Redux being completely unnecessary for most applications. In it, he describes how
the simple concept of state in components is *perfectly fine* for most applications. 

### Do you even lift?
---
Fully grokking the concept of state and how it differs from props takes a little
time when first coming to React. Adding Redux to the mix doesn't alleviate the need to
understand these concepts, and just serves to add more complex concepts that you need to
understand. Once you do wrap your head around how state works, it's actually really 
simple and very useful.

The most common use case for Redux that I see is for managing shared state. You have two
separate components that need to somehow reflect the same data. Loading that data in each
component's `componentDidMount` is bad, so you need some way to load it in one place and 
then share out to each component. Redux may seem like a perfect fit, but local state
might be an even better fit for most situations.

The main concept to understand in using local state is to *lift* that state to a common
ancestor. So if you have a `<Widget />` and a `<Doodad />` that need to share a list of
**Whatchamacallits**, you would need to look up the component hierarchy for a common 
ancestor. For example, if these two components are contained in a `<Panel />`,
it might make sense to have the **Panel** be responsible for loading the data and then
passing it down via props. The React docs even have 
[a page specifically about this concept](https://facebook.github.io/react/docs/lifting-state-up.html).

Where this can become tedious is if you have multiple levels of components through which
you then have to pass props. If that is the case then my first suggestion would be to 
take a good, hard look at how your component hierarchy is structured. Are those levels
of components really providing a value? If not, it's time for a refactor. If they are 
necessary you may be already typing `yarn add redux` (because [yarn is awesome](https://yarnpkg.com)),
but wait....

### Providing a little context
---


### Stop.....Hammer time
---

### Conclusion
---
