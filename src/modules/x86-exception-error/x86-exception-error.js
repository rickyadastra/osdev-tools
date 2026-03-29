import content from './content.html?raw';
export { content };

import { BitfieldComponent } from '../common/bitfield-component';

const pageFaultError = [
    { name: 'Reserved', desc: 'Must be set to 0.', size: 16, type: 'reserved' },
    { name: 'SGX', extName: 'Software Guard Extensions', desc: 'When set, the fault was due to an SGX violation. The fault is unrelated to ordinary paging.', type: 'flag' },
    { name: 'Reserved', desc: 'Must be set to 0.', size: 8, type: 'reserved' },
    { name: 'SS', extName: 'Shadow Stack', desc: 'When set, the page fault was caused by a shadow stack access.', type: 'flag' },
    { name: 'PK', extName: 'Protection Key', desc: 'When set, the page fault was caused by a protection-key violation. The PKRU register (for user-mode accesses) or PKRS MSR (for supervisor-mode accesses) specifies the protection key rights.', type: 'flag' },
    { name: 'I', extName: 'Instruction Fetch', desc: 'When set, the page fault was caused by an instruction fetch. This only applies when the No-Execute bit is supported and enabled.', type: 'flag' },
    { name: 'R', extName: 'Reserved Write', desc: 'When set, one or more page directory entries contain reserved bits which are set to 1. This only applies when the PSE or PAE flags in CR4 are set to 1.', type: 'flag' },
    { name: 'U', extName: 'User', desc: 'When set, the page fault was caused while CPL = 3. This does not necessarily mean that the page fault was a privilege violation.', type: 'flag' },
    { name: 'W', extName: 'Write', desc: 'When set, the page fault was caused by a write access. When not set, it was caused by a read access.', type: 'flag' },
    { name: 'P', extName: 'Present', desc: 'When set, the page fault was caused by a page-protection violation. When not set, it was caused by a non-present page.', type: 'flag' },
];

const segmentSelector = [
    { name: 'Reserved', desc: 'Must be set to 0.', size: 16, type: 'reserved' },
    { name: 'Selector Index', desc: 'The index in the GDT, IDT or LDT.', size: 13, type: 'data' },
    { name: 'TI', extName: 'Table Indicator', desc: 'When set, indicates the Selector Index refers to the LDT. When clear, refers to the GDT. Only valid if IDT bit is 0.', type: 'type' },
    { name: 'IDT', extName: 'IDT Indicator', desc: 'When set, indicates the Selector Index refers to a gate descriptor in the IDT. When clear, refers to the GDT or the LDT depending on the Table Indicator.', type: 'type' },
    { name: 'EXT', extName: 'External', desc: 'When set, the exception originated externally to the processor.', type: 'flag' },

];

export function init(container) {
    console.log('x86 exception error loaded');

    const bitfieldComponent = new BitfieldComponent(container.querySelector('BitfieldComponent'), {
        schema: pageFaultError
    });

    const errContainer = container.querySelector('#error-code-div');
    const errVal = container.querySelector('#error-code');
    const excType = container.querySelector('#exception-type');

    excType.addEventListener('change', (e) => {
        e.target.ariaInvalid = false;
        
        switch (e.target.value) {
            case 'page-fault':
                bitfieldComponent.setSchema(pageFaultError);
                break;
            case 'segment-selector':
                bitfieldComponent.setSchema(segmentSelector);
                break;
            default:
                e.target.ariaInvalid = true;
        }
    });

    errVal.addEventListener('input', () => {
        try {
            errContainer.removeAttribute('data-tooltip');
            errVal.ariaInvalid = false;
            bitfieldComponent.setValue(BigInt(errVal.value));
        } catch (err) {
            errVal.ariaInvalid = true;
            errContainer.setAttribute('data-tooltip', "Invalid hexadecimal value");
        }
    });
}
