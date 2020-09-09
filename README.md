## State machines - Intro

```
npm install
```

```
npm start
```

## Steps

First iteration, with React hooks (useState, useEffect):

1. Make a simple timer `10s |+|-|Start`
2. Timer should be stoppable `10s |+|-|Start|Stop`
3. Timer should be resettable `10s |+|-|Start|Stop|Reset`
4. Timer should not allow negative values and stop when reaching 0 `0s |+|-|Start|Stop|Reset`
5. Disable start, reset, inc/dec when counting `10s |(+)|(-)|(Start)|Stop|(Reset)`

Second iteration, with XState:

1. Refactor to use an XState machine and introduce finite states
2. Introduce continuous state (context) and side effects (actions and guards)
3. Introduce async side effects (activities, services)
4. State Driven UI with state matching
5. Extract parallel states to separate concerns

Final bells and whistles: a more Villoresi friendly example with an URQL query to an external service
