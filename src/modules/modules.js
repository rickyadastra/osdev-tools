import * as x86PagingTool from './x86_paging/x86-paging.js';
import * as x86PageFaultTool from './x86_page_fault/x86-page-fault.js';

export const toolsRegistry = [
    {
        id: 'x86-paging',
        tags: ['x86', 'Paging'],
        module: x86PagingTool
    },
    {
        id: 'x86-page-fault',
        tags: ['x86', 'Paging', 'Exception'],
        module: x86PageFaultTool
    }
]