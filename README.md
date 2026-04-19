<h1 align="center">OSDev Tools</h1>

<p align="center">
    An <b>offline-ready</b>, <b>responsive</b> and <b>data-driven</b> PWA featuring a collection of interactive web-based tools designed to assist hobbyist kernel developers and low-level programmers in decoding complex hardware structures, registers and error codes.
    <br><br>
    <a href="https://c3-lang.org/"><img alt="GitHub License" src="https://img.shields.io/github/license/rickyadastra/osdev-tools"></a>
    <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white"></a>
    <a href="https://tailwindcss.com/"><img alt="Basecoat" src="https://img.shields.io/badge/Basecoat-1447e6?logo=shadcnui&logoColor=white"></a>
    <a href="https://tailwindcss.com/"><img alt="Vite" src="https://img.shields.io/badge/Vite-9135ff?logo=vite&logoColor=white"></a>
    <br><br>
    <b><a align="center" href="https://rickyadastra.github.io/osdev-tools/">Try it here!</a></b>
</p>

## Included tools
Currently, it features the following tools:
- **x86 Address Converter** to translate a virtual address to its paging components and vice versa
- **x86 Exception Error Analyzer** to break down an exception-generated error code via an interactive and responsive bitfield viewer
- **x86 Page Table Entry Visualizer** to check entry flags, available bits and the physical frame number

## Get started
To get the project running locally:
1. Fork the repository and clone it to your local machine
2. Create a new branch from `dev` following the strategy discussed above
3. Install dependencies with `npm install --legacy-peer-deps`[^1] and start the Vite development server with `npm run dev`

[^1]: The `--legacy-peer-deps` option is required because of the `vite-plugin-pwa` dependency.

## Contributing
OSDev Tools uses a data-driven architecture.
You often just need to add your tool logic scripts and register it to the module system.
Briefly exploring [`src`](src) and [`src/modules`](src/modules) is highly recommended in order to follow a consistent style across different tools.
The [`src/modules/common`](src/modules/common) subdirectory provides useful functions and classes that you can reuse in your tool.

In short, to add a new tool:
1. Create a new subdirectory in [`src/modules`](src/modules) for your tool[^2]
2. Create a JavaScript file exporting a `content` String constant with the tool body and a `function init(container)` to be called by the app loader. Take a look at the following example:
    ```js
    // 'content' contains the HTML layout of the tool. 
    // The '?raw' suffix is required to import the whole HTML text as
    // a variable during deploy.
    import content from './content.html?raw';
    export { content }; 

    // This function is called when initializing the tool.
    export function init(container) {
        // The 'container' variable is the wrapper container hosting 
        // your 'content' HTML template.
    }
    ```
3. Add your tool to [`modules.js`](src/modules/modules.js) with a unique `id`, a `title`, a `description` and the `module` imported from the subdirectory you created earlier

[^2]: While there is not a strict naming convention, name it something like `<arch>-tool-name-separated-with-hyphens`.

See [CONTRIBUTING](CONTRIBUTING.md) for guidelines and how to submit a PR.
