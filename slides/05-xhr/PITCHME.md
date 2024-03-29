## ☀️ Part 5: Control network calls

### 📚 You will learn

- how to spy / stub network calls
- how to wait for the network calls from tests
- how to use network calls in assertions

+++

- keep `todomvc` app running
- open `cypress/integration/05-xhr/spec.js`
- **note** stubbing `window.fetch` is NOT implemented yet, but will be [issue #687](https://github.com/cypress-io/cypress/issues/687)

+++

## Situation

- there is **no resetting** the state before each test
- the test passes but _something is wrong_

```javascript
it('starts with zero items', () => {
  cy.visit('/')
  cy.get('li.todo').should('have.length', 0)
})
```

![Should have failed](/slides/05-xhr/img/test-passes-but-this-is-wrong.png)

+++

## Problem

@ul

- page loads
- web application makes XHR call `GET /todos`
  - meanwhile it shows an empty list of todos
- Cypress assertion passes!
- `GET /todos` returns with 2 items
  - they are added to the DOM
  - but the test has already finished

@ulend

+++

## Waiting

```javascript
it('starts with zero items', () => {
  cy.visit('/')
  cy.wait(1000)
  cy.get('li.todo').should('have.length', 0)
})
```

![Waiting works](/slides/05-xhr/img/waiting.png)

+++

**better** to wait on a specific XHR request. Network is just observable public effect, just like DOM.

+++

### Todo

In `05-xhr/spec.js` test "starts with zero items"

@ul

- spy on specific route with `cy.intercept`
  - should we start mock server _before_ or _after_ `cy.visit`?
- spy on specific route with `cy.route`
- save as an alias
- wait for this XHR alias
  - then check the DOM

@ulend

**tips:** [`cy.intercept`]('https://on.cypress.io/intercept), [Network requests guide](https://on.cypress.io/network-requests)

+++

💡 No need to `cy.wait(...).then(...)`. All Cypress commands will be chained automatically.

```js
cy.intercept('GET', '/todos').as('todos')
cy.visit('/')
cy.wait('@todos')
// cy.get() will run AFTER cy.wait() finishes
cy.get('li.todo').should('have.length', 0)
```

Read [Introduction to Cypress](https://on.cypress.io/introduction-to-cypress) "Commands Run Serially"

+++

## Todo

add to test "starts with zero items":

- wait for the XHR alias like before
- its response body should be an empty array

![Checking response body](/slides/05-xhr/img/response-body.png)

+++

## Stub network call

Update test "starts with zero items (stubbed response)"

- instead of just spying on XHR call, let's return some mock data

```javascript
// returns an empty list
// when `GET /todos` is requested
cy.route('GET', '/todos', [])
```

+++

```javascript
it('starts with zero items (fixture)', () => {
  // start Cypress network server
  // stub `GET /todos` with fixture "empty-list"

  // visit the page
  cy.visit('/')

  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})
```
**tip:** use [`cy.fixture`](https://on.cypress.io/fixture) command

+++

```javascript
it('loads several items from a fixture', () => {
  // start Cypress network server
  // stub route `GET /todos` with data from a fixture file "two-items.json"
  // THEN visit the page
  cy.visit('/')
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
})
```

+++

### Spying on adding an item XHR

When you add an item through the DOM, the app makes `POST` XHR call.

![Post new item](/slides/05-xhr/img/post-item.png)

Note:
It is important to be able to use DevTools network tab to inspect the XHR and its request and response.

+++

**Todo 1/2**

- write a test "posts new item to the server" that confirms that new item is posted to the server

![Post new item](/slides/05-xhr/img/post-item.png)

Note:
see instructions in the `05-xhr/spec.js` for the test

+++

**Todo 2/2**

- write a test "posts new item to the server response" that confirms that RESPONSE when a new item is posted to the server

![Post new item response](/slides/05-xhr/img/post-item-response.png)

Note:
see instructions in the `05-xhr/spec.js` for the test

+++

## Bonus

Network requests guide at [https://on.cypress.io/network-requests](https://on.cypress.io/network-requests). Question: which requests do you spy on, which do you stub?

+++

## Testing Loading state

In the application we are showing (very quickly) "Loading" state

```html
<div class="loading" v-show="loading">Loading data ...</div>
```

+++

## Todo

- delay the loading XHR request
- assert the UI is showing "Loading" element
- assert the "Loading" element goes away after XHR completes

⌨️ test "shows loading element"
