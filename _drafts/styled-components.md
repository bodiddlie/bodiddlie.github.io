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
I started working on my [headache diary](https://github.com/bodiddlie/headache-diary) project. One of the components I was building for
this project was scale for the user to record the level of pain they had experienced for
that day. At the time, I was unsure what the scale would be, and was thinking it might need
to be dynamic depending on what the user wanted to track. The color would range from green
to red, with an unknown number of segments. 

Doing this in SASS or straight CSS would have been hard as I wanted smooth color transitions
between the segments. I initially was using style props to generate the segments, but then I 
ran into the problem of not being able to use the `:hover` pseudo-class. This led me down the path
of creating a HOC to handle hover. Not long after that I thought that there must be a better way.
That's when I found [this wonderful talk](https://www.youtube.com/watch?v=19gqsBc_Cx0) by Max Stoiber introducing styled-components. 

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
I can evangelize for styled-components until the heat death of the sun, but a simple example will
tell you more about the library than I can. To demonstrate the basics of styled-components, let's build
a simple app that will render a grid of cards. Each card will change it's color based on the number
of times it has been clicked. This is obviously an overly simple and contrived example, but it will work 
for showing the basic features.

To start our grid, let's use the awesome new CSS Grid feature. It doesn't have [full browser support](http://caniuse.com/#search=grid) yet,
but it will soon. To start we need to import the library:

{%highlight javascript linenos %}
import styled from 'styled-components';
{%endhighlight%}

Here's our `Grid` styled-component: 

{%highlight javascript linenos %}
const Grid = styled.div`
  display: grid;
  width: 90%;
  height: 500px;
  border: solid 1px black;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1r;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  margin: 0 auto;
`;
{% endhighlight %}

Styled-components use [tagged template literals](https://www.styled-components.com/docs/advanced#tagged-template-literals)
to create the components. `styled.div` is actually a function in the library. The template string you use to write your styles
gets passed to the function as an argument, which styled-components then parses and turns into a CSS class. It injects the
class into a style tag in the head of your html page with the class name being a hash of the styles. You don't need to know
this hash, as you'll using the named component you just created, but it's good to know what's happening.

Next we need a card to use for rendering in our grid. This card needs to change its color based on how many times it has 
been clicked. Let's use flexbox to layout the card, since CSS Grid and flexbox make for a wonderful pairing when creating
layouts. We'll also use hsl for our color because [hsl is awesome](http://mothereffinghsl.com/).

{%highlight javascript linenos %}
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(${props => (props.val * 10) % 255}, 50%, 50%);
  border: 1px solid blue;
  font-size: 10rem;
`;
{%endhighlight%}

The box will have it's content centered vertically and horizontally thanks to flexbox, and styled-components will auto-prefix
the css for us so we can be comfortable it will work in browsers. The really interesting part of this example is when we set
our color. Since we're using tagged template literals, this allows us to dynamically generate styles using props that get
passed to the component. Here we're using a prop called `val` that will be how many times the box has been clicked. This
then gets modded by 255 to determine our hsl color.

We're using CSS Grid, so let's *actually* use some of that cool functionality. Let's make a special card that is taller than
the others, but still behaves in the same way. We could create a whole new component and copy/paste the styles, but 
styled-components gives us a way to do this in the `extend` function.

{%highlight javascript linenos %}
const TallCard = Card.extend`
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
`;
{%endhighlight%}

Using `extend` allows us to essentially make a copy of the `Card` component and then apply some additional styling to it.
This comes in really handy if you are building a UI component library as you can create a simple child component and then 
apply other styles on top of that (e.g. a base button and then styled primary, warning, danger buttons). 

So now we can put this all together into a functioning app. You can see the result below in the [Code Sandbox](http://codesandbox.io). 

{% include sandbox.html id="MjAgQ88oR" %}

### Features Not Even Metioned
---
Styled-components doesn't stop there. There are a ton of other features that I haven't even touched on in this simple example.
One feature that I use quite regularly is [styling existing components](https://www.styled-components.com/docs/basics#styling-any-components). 
My primary use for this is styling the `Link` component from React Router. 

{%highlight javascript linenos %}
export const StyledLink = styled(({ active, children, ...rest }) => <Link {...rest}>{children}</Link>)`
  text-decoration: none;
  color: ${props => (props.active ? '#ffb700' : '#cdcdcd')};
  padding: 0.5rem 0.5rem;

  &:hover {
    color: #ffb700;
  }
`;
{%endhighlight%}

Here I'm using the `Link` component from React Router and passing it via a stateless functional component to `styled`. This allows
me to do some custom styling to the link based on whether it is active or not. 

Styled-components also supports generating keyframes for animation, all the psuedo-class selectors, media-queries for responsive
design, and even theming. These all are beyond the scope of this basic introduction, but go take a look at the [official docs](https://www.styled-components.com/docs)
and see what all it can do. 

One last feature that I think is great is testing. When you use styled-components with Jest and [jest-styled-components](https://github.com/styled-components/jest-styled-components), you can
actually do snapshot testing of your styles. You can even query your styled components to make sure that they have the correct
styles based on props. I have found that using this gives a wonderful level of regression coverage.

### Final Thoughts
---
Choosing a CSS-in-JS library ultimately is a matter of personal preference. Deciding to use one library over another isn't like 
picking a hammer when what you needed was a screwdriver. The more apt analogy would be picking a brand of screwdriver. Ultimately,
you should pick the one that you are comfortable with. You don't even need to use one at all! CSS-in-JS is just a new way of writing
the same old styling code. 

For me, styled-components provides the best developer experience. I can still write regular CSS as a part of it, all while keeping
my styles right there with the logic of my components. I don't have to switch back and forth between javascript and css files to
make changes. In my opinion, bringing these pieces together makes working with React code so much simpler and more enjoyable. 