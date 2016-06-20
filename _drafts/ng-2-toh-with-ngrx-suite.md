---
layout: post
title: "Angular 2 Tour of Heroes Tutoial With the NGRX Suite"
categories: [javascript, typescript, web, programming, angular2, redux, ngrx]
date: 2016-06-20 11:22:00 -0700
comments: true
---
I recently was tasked with starting a brand new project at work that would be used for taking
some simple internal surveys. Something like SurveyMonkey was overkill for what we're looking for,
but using the built-in survey features in SharePoint (I know, I know, ugh) weren't going to be
powerful enough. I originally planned on writing the application in Angular 1, but after going
to a local Angular user group meeting, I decided to try writing it with Angular 2.

###Redux-like Concepts
---
I've been playing around a bit with React/Redux on the side, and the patterns that emerge from
that combination appeal to me. Using pure functions as reducers make testing so simple. Not mutating
state makes debugging much easier to reason about, not to mention the possiblity of time-travel/undo
that it affords. 

Ngrx/store is a Redux inspired library for Angular 2. It operates on many of the same concepts: actions, 
reducers, and a single store. The unique part here is that the DNA of ngrx/store is all about RXJS. Observables
are at the heart of what makes ngrx/store tick. Check out the Comperhensive Overview of ngrx/store and 
Lukas Ruebbelke's great intro to ngrx for an overview.

The one problem I've always had with the Redux pattern is that it seems like a lot of 
boilerplate and abstractions to jump through to get to a functional state. You've got actions, 
reducers, the store, and then somewhere in there async data from a server needs to fit in 
somehow. There are tons of tutorials out there that go over the basics of using Redux, but
it's hard to find a lot of info on fitting it all together. Even once your figure out how they all fit 
together, it can seem like a lot of extra work with little benefit.

My hope with this post is to convey that "Aha!" moment I had where the benefit became clear to me, and I made up
my mind that this was a really great way to architect an application. I thought that rewriting the Angular 2
Tour of Heroes example application with the ngrx suite, would be a great way to show these concepts.

###A brief word on setup
---
Before we get started, I wanted to go over some of the infrastructure details of the example. You can see the 
complete example app at github.

I'm using webpack as my module loader/build tool. While webpack is not required for using any of the libraries
discussed, my use of it makes a couple minor differences in code. Any component templates and styles are `required`
and placed into the `template` and `styles` properties in the `@Component` decorator as opposed to using their
related URL siblings. Everything else should be interchangable with SystemJS (don't quote me on that, though).
For a great intro to using webpack with Angular 2, check out the docs.

One other quick difference from the Tour of Heroes tutorial is that for my backend http calls, I'm using 
the node package `json-server`. By using this in conjunction with a webpack-dev-server configuration, I can
proxy all calls to `/api/*` to the `json-server` instance. This serves up data from a simple JSON file. I found
this method to be great in the project I've been working on as I can mockout my backend API without having to
spin up IIS express (the backend is a ASP.NET Web API project).

###Taking Action
---
At the heart of ngrx/store is the Action. By dispatching actions to the store, the state of our application is
updated. There are any number of ways to construct actions and dispatch them; they are, after all, just simple
objects with a `type` and a `payload` property. The ngrx example app uses a structure that may seem verbose,
but I feel is very extensible and easy to maintain. Here's the contents of our Tour of Heroes actions:

{% highlight javascript linenos %}
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import {Hero} from '../models';

@Injectable()
export class HeroActions {
    static LOAD_HEROES = '[Hero] Load Heroes';
    loadHeroes(): Action {
        return {
            type: HeroActions.LOAD_HEROES
        };
    }

    static LOAD_HEROES_SUCCESS = '[Hero] Load Heroes Success';
    loadHeroesSuccess(heroes): Action {
        return {
            type: HeroActions.LOAD_HEROES_SUCCESS,
            payload: heroes
        };
    }

    static GET_HERO = '[Hero] Get Hero';
    getHero(id): Action {
        return {
            type: HeroActions.GET_HERO,
            payload: id
        };
    }

    static GET_HERO_SUCCESS = '[Hero] Get Hero Success';
    getHeroSuccess(hero): Action {
        return {
            type: HeroActions.GET_HERO_SUCCESS,
            payload: hero
        };
    }

    static RESET_BLANK_HERO = '[Hero] Reset Blank Hero';
    resetBlankHero(): Action {
        return {
            type: HeroActions.RESET_BLANK_HERO
        };
    }

    static SAVE_HERO = '[Hero] Save Hero';
    saveHero(hero): Action {
        return {
            type: HeroActions.SAVE_HERO,
            payload: hero
        };
    }

    static SAVE_HERO_SUCCESS = '[Hero] Save Hero Success';
    saveHeroSuccess(hero): Action {
        return {
            type: HeroActions.SAVE_HERO_SUCCESS,
            payload: hero
        };
    }

    static ADD_HERO = '[Hero] Add Hero';
    addHero(hero): Action {
        return {
            type: HeroActions.ADD_HERO,
            payload: hero
        };
    }

    static ADD_HERO_SUCCESS = '[Hero] Add Hero Success';
    addHeroSuccess(hero): Action {
        return {
            type: HeroActions.ADD_HERO_SUCCESS,
            payload: hero
        };
    }

    static DELETE_HERO = '[Hero] Delete Hero';
    deleteHero(hero): Action {
        return {
            type: HeroActions.DELETE_HERO,
            payload: hero
        };
    }

    static DELETE_HERO_SUCCESS = '[Hero] Delete Hero Success';
    deleteHeroSuccess(hero): Action {
        return {
            type: HeroActions.DELETE_HERO_SUCCESS,
            payload: hero
        };
    }
}
{% endhighlight %}

I won't spend a lot of time on this file as it is fairly simple and can seem almost repetitive. I'll just
highlight a few key points. We start with our imports. Using `@Injectable` allows this to be injected by 
the Angular 2 dependency injector. `Action` is a simple interface that ngrx/store provides and since we're
using Typescript we might as well have all the type checking we can get. The `Hero` model is no different
from what is used in the official tutorial.

{% highlight javascript %}
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import {Hero} from '../models';
{% endhighlight %}

Next we have our class that defines our actions. Since an action type is just a unique string, I include all
the action types as static properties on the class. This makes them easy to use and alleviates the problem
of having a typo in a magic string somewhere in the app. You'll see a pattern here for most of the actions
wher I have a initial action and a success action. This maps out to any asynchronous actions we might take.
The initial action kicks off a chain of events, and the success action is what notifies the application
that the state has been successfully updated. In a real world application, you would also want to have 
separate error actions for handling unsuccessful calls.

Sometimes an action does not include a payload, like in the `LOAD_HEROES` action. This action doesn't need
to convey any information other than notifying that it is being dispatched. It's subsequent success action
has a payload that contains all the loaded heroes. The `SAVE_HERO` action does include a payload, which is the
hero we wish to save. It's success action also includes the saved hero as a payload. You'll see why all of 
this is important in the next section on reducers.

{%highlight javascript %}
...
export class HeroActions {
    static LOAD_HEROES = '[Hero] Load Heroes';
    loadHeroes(): Action {
        return {
            type: HeroActions.LOAD_HEROES
        };
    }

    static LOAD_HEROES_SUCCESS = '[Hero] Load Heroes Success';
    loadHeroesSuccess(heroes): Action {
        return {
            type: HeroActions.LOAD_HEROES_SUCCESS,
            payload: heroes
        };
    }

    static SAVE_HERO = '[Hero] Save Hero';
    saveHero(hero): Action {
        return {
            type: HeroActions.SAVE_HERO,
            payload: hero
        };
    }

    static SAVE_HERO_SUCCESS = '[Hero] Save Hero Success';
    saveHeroSuccess(hero): Action {
        return {
            type: HeroActions.SAVE_HERO_SUCCESS,
            payload: hero
        };
    }
    ...
}
{% endhighlight %}

Having the actions setup in this way makes it very convienient when we are later building our components. By
being able to inject them, we can have access to those actions whereever we need them, and can then quickly
and easily dispatch them to the store.

{% highlight javascript %}
@Component({
    ...
})
export class SomeComponent implments OnInit {
    constructor(
        private heroActions: HeroActions,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.store.dispatch(this.heroActions.loadHeroes());
    }
}
{% endhighlight %}

You'll see how this all ties together later.

###A Fine Wine Reduction
---
Ah reducers. The deceptively simple functions that end up being the representation of your application's state.
For me, this was one of the concepts that I had a hard time wrapping my head around. Not how the functions work,
but in how they are actually consumed and mapped out to the rest of the application. 

The concept of a reducer is very simple. It's a pure function (meaning that it produces no side effects), that
given a state, and an action, will return a new state, based on it's inputs. That textbook definition is all
well and good, but what does it mean to us in practice? 

In ngrx/store, each reducer function is used to represent some branch of our application state. Let's look
at the Tour of Heroes reducers as an example. We'll start with the index file that builds out the final
state represenation, and then show each individual reducer.

{% highlight javascript %}
//app/reducers/index.ts
//imports snipped for brevity

import heroListReducer, * as fromHeroList from './hero-list';
import heroReducer, * as fromHero from './hero';

export interface AppState {
    heroes: fromHeroList.HeroListState;
    hero: fromHero.HeroState;
};

export default compose(combineReducers)({
    heroes: heroListReducer,
    hero: heroReducer
});
{% endhighlight %}

After importing all our library stuff, we bring in the reducer functions themselves, as well as any other
exports from those files. The other exports in this case are simple interfaces representing the state of
that reducer. The nice thing about this, is that each reducer is only given the state that is relevant to it.
In our application, the heroListReducer only cares about the list of heroes and not a single selected hero. 
This separation makes the logic much easier to reason about, albeit it took me some time to figure out exactly
how the state moved around the application.

The `AppState` interface is just a simple final representation of the state for the entire app. We'll use this
later when we are grabbing a reference to the store and selecting data from it.

The default export for this module is the combination of all the reducers into one final state. `compose` and 
`combineReducers` come from the ngrx suite. You don't have to do it this way, but it seems to be the most 
convienient to me.

Now let's take a look at the hero-list reducer:

{% highlight javascript %}
//app/reducers/hero-list.ts
//imports snipped for brevity

export type HeroListState = Hero[];

const initialState: HeroListState = [];
{% endhighlight %}

`HeroListState` is the representation of the shape of the state that this reducer will produce. In this instance
it's just an array of `Hero` objects. In the real world, you would probably include some other info in this such
as if the list is currently loading or not, so you can display a spinner or something. We then setup an initial
state of an empty array. We use this below as a default parameter to the function, so that we always have a 
valid state coming in to the function.

{% highlight javascript %}
export default function (state = initialState, action: Action): HeroListState {
    switch (action.type) {
        ...
    }
}
{% endhighlight %}

The basic reducer signature is a function that takes in a state and an action, and returns a new state. Here
we are giving a default value of the `initialState` so we at least always have a valid empty array. We are
returning a `HeroListState` which again is just an array of `Hero` objects. We do a `switch` on the type of
action, and then do whatever we need to generate a new state.

{% highlight javascript %}
case HeroActions.LOAD_HEROES_SUCCESS: {
    return action.payload;
}
{% endhighlight %}

When we have successfully retrieved the heroes from the server, we just want to return the payload, which
will be an array of `Hero` objects. Simple.

{% highlight javascript %}
case HeroActions.ADD_HERO_SUCCESS: {
    return [...state, action.payload];
}
{% endhighlight %}

After successfully adding a brand new hero, we just need to add it to the array. However, since reducers
should not modify existing state, but rather return a new state, we compose a new array using the spread
operator from ES6.

{% highlight javascript %}
case HeroActions.SAVE_HERO_SUCCESS: {
    let index = _.findIndex(state, {id: action.payload.id});
    if (index >= 0) {
        return state
            .slice(0, index)
            .concat([action.payload])
            .concat(state.slice(index + 1));
    }
    return state;
}
{% endhighlight %}

Saving an existing hero requires building out a new array with the old hero replaced by the new one. I'm using
lodash here to quickly find the index of the old hero and doing `slice` and `concat` to build out the new array.

{% highlight javascript %}
case HeroActions.DELETE_HERO_SUCCESS: {
    return state.filter(hero => {
        return hero.id !== action.payload.id;
    });
}
{% endhighlight %}

Deleting a hero is as simple as returning a new array that no longer contains the old hero. `filter` is perfect
for that.

{% highlight javascript %}
default: {
    return state;
}
{% endhighlight %}

Earlier I said that only the relevant state gets passed to a reducer. It does however, get sent every single
action that is dispatched to the store. This makes sense, but could easily be forgotten as often the actions
and state map neatly together (although not always). Since a reducer needs to always return a valid state,
if we get an action we don't care about (or is invalid), we just return the state we were given.

The really nice thing about reducers is that they are easily testable without having to jump through a bunch
of Angular 2 test setup hoops. It's just a function that doesn't care about anything else and produces no 
side effects. The definition of highly testable code.

{% highlight javascript %}
describe('HeroList', () => {
    it('should return an array with the new hero added to it', () => {
        const oldState = [{id: 1, name: 'First'}, {id: 2, name: 'Second'}];
        const newHero = {id: 3, name: 'New Guy'};
        const newState = heroReducer(oldState, {type: HeroActions.ADD_HERO_SUCCESS, payload: newHero});
        expect(newState.length).toBe(3);
    });
});
{% endhighlight %}

By carefully thinking about the shape and structure of the state of your application, and building your reducers
properly, you can remove a lot of logic from your components into these little bits that much more easily tested.
That's probably one of the biggest benefits in my mind!

###Effects
---
Okay, simple pure functions, neat self-describable action classes. That's great Nick. Fantastic. Now where the
hell is all the data coming from? You haven't used `http` at all anywhere yet. What good is an application
that doesn't communicate to a server in someway?

This was something that I struggled with when playing around with React/Redux and in initially looking at
ngrx/store. Most of the examples out there are trivial and work with state that exists only within the
client side code. It wasn't until I found the ngrx example app and spent a few days really understanding it
that I was able to wrap my head around this.

But first to get data we need to call out to the server, and what better place to do that than in a service?

{% highlight javascript %}
// /app/services/hero.ts
...
@Injectable()
export class HeroService {
    constructor(private http: Http) {}

    getHeroes(): Observable<Hero[]> {
        return this.http.get('/api/heroes')
        .map(res => res.json());
    }

    getHero(id): Observable<Hero> {
        return this.http.get('/api/heroes/' + id)
        .map(res => res.json());
    }

    saveHero(hero) {
        if (hero.id === 0) {
            return this.http.post('/api/heroes', hero)
            .map(res => res.json());
        } else {
            return this.http.put('/api/heroes/' + hero.id, hero)
            .map(res => res.json());
        }
    }

    deleteHero(hero) {
        return this.http.delete('/api/heroes/' + hero.id)
        map(res => hero);
    }
}
{% endhighlight %}

This is all pretty standard Angular 2 stuff. Notice that we're returning Observables. The only other thing
to point out here is in the `deleteHero` method, in the `map` we're returning the passed in hero. The 
`DELETE` call doesn't return any response body, but our effect and subsequent action will need to know
what hero to act on. We'll see that later.

###Children Should be Contained and Displayed
---

###Wrap Up
---