---
layout: post
title: "Announcing Fire-Fetch 🔥🐶 and Chore Tracker"
date: 2018-04-01 15:25:00 -0700
categories: [javascript, react, firebase, web, programming, family, parenting]
comments: true
---

I'm excited to announce the release of two new projects that I've been working on: [Chore Tracker](https://chore-tracker.surge.sh), a simple web application for families to use to track chores, and [Fire-Fetch](https://github.com/bodiddlie/fire-fetch), a library of declarative React components for [Firebase](https://firebase.google.com).

### Chore Tracker

---

Growing up as an only child, chores were pretty easy to keep track of. I didn't have any siblings to fight with over whose turn it was to do the dishes. Being a parent of two kids, it seems like every time the dishes need to be done it's the other kid's turn. Also, just paying a flat amount for allowance doesn't seem exactly fair when one kid might have done a lot more work than the other.

I made [Chore Tracker](https://chore-tracker.surge.sh) to help with these issues. As a parent, you sign up at the website and then create a child profile for each child. You can then create a list of chores and assign a monetary value to each chore. Your kids then sign into the app (using your login, no separate logins for kids) and can mark the chores they do as complete.

As the kids complete their chores, the app will keep track of how much money they have earned. Once they have earned enough, either parent can go into the app and close out a pay cycle, and then pay the kids what they have earned. We can also see at a glance who last completed each chore.

It's a simple app that I've build in my spare time, but I think it will be very useful for my family, and hope that others can find it useful as well.

### Fire-Fetch 🔥🐶

---

To build Chore Tracker, I used a few tools from [Firebase](https://firebase.google.com), mainly the real-time database and authentication APIs. As I first build out the app, I was directly using the Firebase APIs in my React components. This led to a whole lot of imperative code in various lifecycle methods and event handlers. I really have started to prefer the readability and ease of maintenance of more declarative code, so this started to bug me.

I refactored the app to pull all of the firebase related code into a set of declarative and reusable components. I then pulled these out into their own library and published it as [Fire-Fetch](https://github.com/boiddlie/fire-fetch). This library exposes a handful of render-prop components that will allow you to use the Firebase real-time database and authentication APIs in a much more declarative style. For example, a component that would query the database might look like this:

{%highlight javascript linenos %}
import React from 'react';
import { FirebaseQuery } from 'fire-fetch};

const Todos = () => (
  <FirebaseQuery path="todos" toArray on>
    {todos => (
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.name}</li>)}
      </ul>
    )}
  </FirebaseQuery>
)
{%endhighlight%}

The library is in an early alpha state, and doesn't yet implement all the functionality from the Firebase APIs. My goal is to add the rest of the query APIs, and then move on to adding components to support the new cloud firestore. Contributions are always appreciated, encouraged, and welcomed! Head on over to the [GitHub page](https://github.com/bodiddlie/fire-fetch) to read the docs and try out the library.
