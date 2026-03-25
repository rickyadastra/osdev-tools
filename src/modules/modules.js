import * as x86PagingTool from './x86_paging/x86-paging.js';
import * as x86PageFaultTool from './x86_page_fault/x86-page-fault.js';

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
        module: x86PageFaultTool
    }
]