<!-- Test PR CI -->

# OSDev Tools

OSDev Tools is an **offline-ready**, **responsive** and **data-driven** PWA featuring a collection of interactive web-based tools designed to assist hobbyist kernel developers and low-level programmers in decoding complex hardware structures, registers and error codes.

> Try it [here](https://rickyadastra.github.io/osdev-tools/)!

## Tools
Currently, it features the following tools:
- **x86 Address Converter** to translate a virtual address to its paging components and viceversa
- **x86 Exception Error Analyzer** to break down an exception-generated error code via an interactive and responsive bitfield viewer
- **x86 Page Table Entry Visualizer** to check entry flags, available bits and the physical frame number

## Contributing
Contributions, suggestions and additions are welcome! Check out [`src`](src) and [`src/modules`](src/modules) subdirectories to get an idea on the design to follow when implementing a new tool. The [`src/modules/common`](src/modules/common) subdirectory provides useful functions and classes to reuse. 
In short, every tool must:
- be in its own module subdirectory
- have a JavaScript exporting
    - a `content` constant containing the tool body, and
    - an `init(container)` function to be called by the app loader
- declared in [modules.js](src/modules/modules.js) with a unique ID, a title and a description
