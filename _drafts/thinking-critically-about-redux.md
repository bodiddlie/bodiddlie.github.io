---
layout: post
title: "Thinking Critically About Redux In Your Application"
categories: [javascript, react, redux, web, programming]
date: 2016-12-05 12:00:00 -0700
comments: false
---
When someone new to React asks online how to handle state or passing of props in 
their application, the answer often includes learning and including Redux. While I
think that Redux is a fantastic library and personally love using it, I wanted to
write this post to illustrate why it isn't always necessary or even a good idea.

### Hammer Time.....Stop
---
When I first started learning React, nearly every blog post, article, or tutorial I read
also included Redux. Many places refer to the two as React/Redux, as if they are somehow
inseparable or part of one larger framework. This is unfortunate, as React itself presents
beginners with enough challenges to learning without the complexities of Redux thrown in.
It also turns into the old problem of if the only tool you have is a hammer, everything
begins to look like a nail.

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
of components really providing a value? If not, it's time for a refactor. Also, all those levels
might not be necessary. Dan Abramov once again has some great [insight into this](https://www.reddit.com/r/reactjs/comments/5lbp9a/how_to_update_state_in_parents_parent/dbur5os/).
If they are necessary you may be already typing `yarn add redux` (because [yarn is awesome](https://yarnpkg.com)),
but wait....

### Providing a little context
---
If the shared state you're dealing with is small and isn't going to change a lot, there
is a mechanism built in to React that might be a good fit: context. The React docs 
have a lot of [scary things to say](https://facebook.github.io/react/docs/context.html)
about using context, but it is a perfectly viable solution if you pay attention and use
it correctly and carefully. In fact, context is how [React-Redux](https://github.com/reactjs/react-redux)
is able to connect the store to your components. It's just all abstracted away inside of 
a Higher Order Component.

In an app I've been working on, the only real piece of shared state is the current user.
Several components need the id of the current user in order to load data from the server.
Passing it down via props is possible, but a pain, so I actually provide the id in context
from the `<App />` component. Now any component under `<App />` can get that id from context
should it be needed. 

The key here is that what you pass around via context should be minimized. The official docs
warn that this is an experimental API and could undergo breaking changes at any time. So many
critical libraries are using context right now that I don't think the React team is likely to 
actually make such changes, but the language is there for a reason. As long as you keep the use
to a minimum, you minimize the risks that your app might break in the future.

### We're gonna need a bigger boat
---
If you're sharing a lot of data or data that changes frequently and your component
hierarchy requires multiple levels such that passing via props doesn't work, then it 
probably is time to consider something like Redux or Mobx. At this point your application
is sufficiently complex that the addition of these libraries would likely be a major 
benefit. 

The important point here is that many apps don't need the added complexity of working
with Redux. Applying some careful analysis to how your app is structured and what it is
supposed to do will probably reveal whether or not you need to add Redux at all. One of 
React's greatest selling points in my mind is that you only have to bring in what you
need. See if you can build something with just React, and if you can't, then reach for
Redux.