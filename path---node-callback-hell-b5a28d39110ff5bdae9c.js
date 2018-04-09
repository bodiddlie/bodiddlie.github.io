webpackJsonp([0xa3bad26fec2d],{336:function(n,s){n.exports={data:{site:{siteMetadata:{url:"https://bodiddlie.github.io"}},markdownRemark:{html:'<p>I\'ve been playing around with creating a simple web API using <a href="http://nodejs.org">NodeJS</a> and\n<a href="http://expressjs.org">Express</a> recently. I\'ve found it to be a lot of fun to work with, however,\nI\'m still fairly new to Node. In particular, I\'m still trying to figure out how best to structure\nmy code. This has led to some seriously ugly and over-indented code.</p>\n<p>I\'ve been working on a simple login endpoint for the API that would return a JWT for a valid user.\nI\'ve been refactoring this piece of code for quite a bit today, and I think finally have it\nwhere I\'m happy with it. I\'d like to run through some of the iterations, so you could see\nthe process of improving this code.</p>\n<p>So first up is the ugly version:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">//login-controller.js</span>\n\nmodule<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>User<span class="token punctuation">,</span> secret<span class="token punctuation">,</span> jwt<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    login<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span>email<span class="token punctuation">,</span> password<span class="token punctuation">,</span> cb<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      User<span class="token punctuation">.</span><span class="token function">findOne</span><span class="token punctuation">(</span><span class="token punctuation">{</span> email<span class="token punctuation">:</span> email <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>user<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          user<span class="token punctuation">.</span><span class="token function">comparePassword</span><span class="token punctuation">(</span>password<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> isMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">if</span> <span class="token punctuation">(</span>isMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              <span class="token keyword">var</span> payload <span class="token operator">=</span> <span class="token punctuation">{</span>\n                email<span class="token punctuation">:</span> email<span class="token punctuation">,</span>\n                userid<span class="token punctuation">:</span> user<span class="token punctuation">.</span>_id<span class="token punctuation">,</span>\n              <span class="token punctuation">}</span><span class="token punctuation">;</span>\n              <span class="token keyword">var</span> token <span class="token operator">=</span> jwt<span class="token punctuation">.</span><span class="token function">sign</span><span class="token punctuation">(</span>payload<span class="token punctuation">,</span> secret<span class="token punctuation">)</span><span class="token punctuation">;</span>\n              <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> token<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n            <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>A brief explanation of the above code. I\'m using the pattern above to inject dependencies into\nthe module to facilitate testing (something I\'m also still trying to figure out the best way\nto do). Beyond that it\'s pretty straight-foward:</p>\n<ol>\n<li>Try to find a user with a given email</li>\n<li>If we find one, check the validity of the password</li>\n<li>If the password is valid, create and return a JWT</li>\n</ol>\n<p>Like I said, straight-forward.....but ugly as all hell. There are so many levels of indentation\nin that code, that I guarantee if I left this code for a month and came back, I would have a\nhell of a time figuring it out again. So, how do I make it better?</p>\n<p>After <a href="http://www.google.com">wracking my brain</a> for a while, I realized that I could flatten\nthis out by declaring each of the callbacks as discrete, named functions. So I gave that a try.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">//login-controller.js Part Deux</span>\n\nmodule<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>User<span class="token punctuation">,</span> secret<span class="token punctuation">,</span> jwt<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    login<span class="token punctuation">:</span> login<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">login</span><span class="token punctuation">(</span>email<span class="token punctuation">,</span> password<span class="token punctuation">,</span> cb<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    User<span class="token punctuation">.</span><span class="token function">findOne</span><span class="token punctuation">(</span><span class="token punctuation">{</span> email<span class="token punctuation">:</span> email <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token function">make_handleFindUser</span><span class="token punctuation">(</span>cb<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">make_handleFindUser</span><span class="token punctuation">(</span>cb<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>user<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        user<span class="token punctuation">.</span><span class="token function">comparePassword</span><span class="token punctuation">(</span>password<span class="token punctuation">,</span> <span class="token function">make_handleCompare</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">make_handleCompare</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> cb<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> isMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>isMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">var</span> payload <span class="token operator">=</span> <span class="token punctuation">{</span>\n          email<span class="token punctuation">:</span> user<span class="token punctuation">.</span>email<span class="token punctuation">,</span>\n          userid<span class="token punctuation">:</span> user<span class="token punctuation">.</span>_id<span class="token punctuation">,</span>\n        <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">var</span> token <span class="token operator">=</span> jwt<span class="token punctuation">.</span><span class="token function">sign</span><span class="token punctuation">(</span>payload<span class="token punctuation">,</span> secret<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> token<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>This cuts the max level of indentation almost in half. It does look better and is easier to follow,\nbut it also added an extra 10 lines of code. This module also handles registering a new user, so\nI wasn\'t happy with the longer code. Something also rubbed me the wrong way about having functions\njust to generate callback functions.</p>\n<p>It was about this time that I started having some issues with testing. One big thing I\'m trying\nto avoid is actually hitting the database during tests. This means mocking out models and\ninjecting them into the controller. That\'s when I realized that the problem wasn\'t in the\nstructure of the code in the controller. It was in my user model.</p>\n<p>My user model was responsible for way too much. In particular, it was responsible for checking\nif the password was valid. So I took that logic out of the model and moved it into a separate\nmodule for security (along with the JWT creation). I switched to using the synchronous version\nof compare in <a href="https://github.com/ncb000gt/node.bcrypt.js">bcrypt</a>, which isn\'t recommended,\nbut cleaned the code up for this simple instance. I might change it later. I also created a module for generating a generic repository based off a\n<a href="http://mongoosejs.com">Mongoose</a> model.</p>\n<p>With all that in place, I was able to refactor the controller to the current version:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">//login-controller.js - Return of the Callback</span>\n\nmodule<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>UserRepository<span class="token punctuation">,</span> security<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    login<span class="token punctuation">:</span> login<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">login</span><span class="token punctuation">(</span>email<span class="token punctuation">,</span> password<span class="token punctuation">,</span> cb<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    UserRepository<span class="token punctuation">.</span><span class="token function">findOne</span><span class="token punctuation">(</span><span class="token punctuation">{</span> email<span class="token punctuation">:</span> email <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> user<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>user <span class="token operator">&amp;&amp;</span> security<span class="token punctuation">.</span><span class="token function">isValidPassword</span><span class="token punctuation">(</span>password<span class="token punctuation">,</span> user<span class="token punctuation">.</span>password<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span>\n          <span class="token keyword">null</span><span class="token punctuation">,</span>\n          security<span class="token punctuation">.</span><span class="token function">makeJwt</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n            email<span class="token punctuation">:</span> user<span class="token punctuation">.</span>email<span class="token punctuation">,</span>\n            userid<span class="token punctuation">:</span> user<span class="token punctuation">.</span>_id<span class="token punctuation">,</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">return</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>Much easier to follow, and shorter! I\'m still not convinced it\'s the best way to do it. I\'m\ncontemplating adding a <code class="language-text">findValidUser</code> method to the UserRepository, thus offloading the\nchecking from the controller altogether, but for now this seems to work.</p>\n<h3>Moral of the Story</h3>\n<hr>\n<p>Again, I\'m new to Node, so don\'t take this example as something <em>you</em> should do. There is a\nlesson you can learn from all this, though. When you have code smell, make sure you look at\nall the pieces that affect the problematic code. The biggest cause of the problem might very\nwell be poor design in another piece of code.</p>',frontmatter:{title:"Adventures with Node Callback Hell",date:"Feb 07, 2016"},fields:{slug:"/node-callback-hell/"}}},pathContext:{slug:"/node-callback-hell/"}}}});
//# sourceMappingURL=path---node-callback-hell-b5a28d39110ff5bdae9c.js.map