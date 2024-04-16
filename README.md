# sorting-visualiser

A sorting algorithm visualiser app built with Vue and TypeScript.

[Running Example](https://sorting-algorithm-visualiser-ald.netlify.app/)

Implemented in a way to pass data between stores and components.
Just designed like this to get used to Vue stores and refs.
Used Pinia for the store.

Could have designed it in a way so the sorting algorithm performed the animation directly.
Decided to design it so when an array is defined, all sorting algorithms will perform their respective sorts.
Designed it this way to allow performance comparison on the array.

### todo

Add pseudo highlighting to show which part of the algorithm that particular step belongs to.
Add table to document the difference in performance between the algorithms.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
