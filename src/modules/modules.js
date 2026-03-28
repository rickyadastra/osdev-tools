import * as x86PagingTool from './x86-paging/x86-paging.js';
import * as x86PageFaultTool from './x86-exception-error/x86-exception-error.js';

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
        id: 'x86-exception-error',
        tags: ['x86', 'paging', 'exception'],
        title: 'Exception Error Analyzer',
        description: 'This tool provides an interactive way to understand what the code pushed on the \
        stack by an exception means. Select the error type, input the value and see its breakdown in \
        the area below. The Segment Selector error code is output by many exceptions, like General \
        Protection Fault and Invalid TSS.',
        module: x86PageFaultTool
    }
]