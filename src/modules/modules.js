import * as x86PagingTool from './x86-paging/x86-paging.js';
import * as x86PageFaultTool from './x86-page-fault/x86-page-fault.js';

export const toolsRegistry = [
    {
        id: 'x86-paging',
        tags: ['x86', 'paging'],
        title: 'Address Converter',
        description: 'Visualize memory management concepts and address translation on x86 CPUs. \
        Input a virtual address to see its breakdown into paging table indices or adjust individual \
        indices to observe the resulting address.',
        module: x86PagingTool
    },
    {
        id: 'x86-page-fault',
        tags: ['x86', 'paging', 'exception'],
        title: 'Page Fault Error Analyzer',
        description: 'This tool provides an interactive way to understand what the code pushed on the \
        stack by a page fault means. Also remember that the CR2 register contains the virtual address \
        which caused the page fault.',
        module: x86PageFaultTool
    }
]