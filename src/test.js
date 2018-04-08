
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