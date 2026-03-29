import content from './content.html?raw';
export { content };

import { Bitfield, formatForField } from '../common/bitfield';
import { setClipboard } from '../common/common';

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

let curField;
let container;

export function init(c) {
    console.log('x86 exception error loaded');

    container = c;
    const bitfieldContainer = container.querySelector('#bitfield');
    const errContainer = container.querySelector('#error-code-div');
    const errVal = container.querySelector('#error-code');
    const excType = container.querySelector('#exception-type');

    const descTitle = container.querySelector('#desc-title');
    const descBody = container.querySelector('#desc-body');
    const descValue = container.querySelector('#desc-value');

    const copyHexBtn = container.querySelector('#copy-hex-btn');
    const copyDecBtn = container.querySelector('#copy-dec-btn');
    const copyBinBtn = container.querySelector('#copy-bin-btn');

    const bitfield = new Bitfield(bitfieldContainer, pageFaultError, {
        initialValue: 0x00000001,
        onClick: (field) => {
            const size = field.from - field.to + 1;
            const single = size === 1;
            const name = field.extName ?? field.name;

            descTitle.textContent = `${name} - bit${!single ? 's' : ''} ${field.to}${!single ? `:${field.from}` : ''}`;
            descBody.textContent = field.desc ?? '';
            
            updateFieldDescValue(field);
            curField = field;
        }
    });

    excType.addEventListener('change', (e) => {
        e.target.ariaInvalid = false;
        
        switch (e.target.value) {
            case 'page-fault':
                bitfield.setSchema(pageFaultError);
                break;
            case 'segment-selector':
                bitfield.setSchema(segmentSelector);
                break;
            default:
                e.target.ariaInvalid = true;
        }
    });

    errVal.addEventListener('input', () => {
        errContainer.removeAttribute('data-tooltip');
        try {
            const val = BigInt(errVal.value);
            bitfield.setValue(val);
            errVal.ariaInvalid = false;
            if (curField) updateFieldDescValue(curField);
        } catch (err) {
            errVal.ariaInvalid = true;
            errContainer.setAttribute('data-tooltip', "Invalid hexadecimal value");
        }
    });

    copyHexBtn.addEventListener('click', () => { setClipboard(descValue.value); });
    copyDecBtn.addEventListener('click', () => { setClipboard(BigInt(descValue.value).toString()); });
    copyBinBtn.addEventListener('click', () => { setClipboard(BigInt(descValue.value).toString(2)); });
}

function updateFieldDescValue(field) {
    const descValueDiv = container.querySelector('#desc-value-div');
    const descValue = container.querySelector('#desc-value');
    const errVal = container.querySelector('#error-code');
    const single = field.from == field.to;
    
    descValue.value = '';

    if (!single && field.type != 'reserved') {
        try {
            const val = BigInt(errVal.value);
            const fieldVal = formatForField(val, field.from, field.to);
            descValueDiv.classList.remove('hidden');
            descValue.value = `0x${fieldVal.toString(16)}`;
        } catch (_) {}

    } else {
        descValueDiv.classList.add('hidden');
    }
}
