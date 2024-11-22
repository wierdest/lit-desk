# \<lit-desk>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

Removi prettier e adicionei conformidade ao standard.

Lit-Desk é um componente para organizar cards
Lit-Desk inclui navegação entre os cards, simulando uma pilha de cards: 

![GIF mostrando um componente de input com autocomplete](./lit-desk.gif)

Lit-Desk 


## Usage

```html
<script type="module">
  import 'lit-desk/lit-desk.js';
</script>

<lit-desk></lit-desk>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
