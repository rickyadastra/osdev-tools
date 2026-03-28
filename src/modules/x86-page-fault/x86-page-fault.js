import content from './content.html?raw';
export { content };

import { Bitfield } from '../common/bitfield';

const schema = [
    { name: 'Reserved', desc: 'Must be set to 0.', size: 16 },
    { name: 'SGX', extName: 'Software Guard Extensions', desc: 'When set, the fault was due to an SGX violation. The fault is unrelated to ordinary paging.', type: 'flag' },
    { name: 'Reserved', desc: 'Must be set to 0.', size: 8 },
    { name: 'SS', extName: 'Shadow Stack', desc: 'When set, the page fault was caused by a shadow stack access.', type: 'flag' },
    { name: 'PK', extName: 'Protection Key', desc: 'When set, the page fault was caused by a protection-key violation. The PKRU register (for user-mode accesses) or PKRS MSR (for supervisor-mode accesses) specifies the protection key rights.', type: 'flag' },
    { name: 'I', extName: 'Instruction Fetch', desc: 'When set, the page fault was caused by an instruction fetch. This only applies when the No-Execute bit is supported and enabled.', type: 'flag' },
    { name: 'R', extName: 'Reserved Write', desc: 'When set, one or more page directory entries contain reserved bits which are set to 1. This only applies when the PSE or PAE flags in CR4 are set to 1.', type: 'flag' },
    { name: 'U', extName: 'User', desc: 'When set, the page fault was caused while CPL = 3. This does not necessarily mean that the page fault was a privilege violation.', type: 'flag' },
    { name: 'W', extName: 'Write', desc: 'When set, the page fault was caused by a write access. When not set, it was caused by a read access.', type: 'flag' },
    { name: 'P', extName: 'Present', desc: 'When set, the page fault was caused by a page-protection violation. When not set, it was caused by a non-present page.', type: 'flag' },
];

export function init() {
    console.log('x86 page fault loaded');

    const container = document.getElementById('x86-page-fault');
    const bitfieldContainer = container.querySelector('#bitfield');
    const errContainer = container.querySelector('#error-code-div');
    const errVal = container.querySelector('#error-code');

    const descTitle = container.querySelector('#desc-title');
    const descBody = container.querySelector('#desc-body');

    const bitfield = new Bitfield(bitfieldContainer, schema, {
        initialValue: 0x00000001,
        onClick: (field) => {
            const single = field.to == field.from;
            const name = field.extName ?? field.name;

            descTitle.textContent = `${name} - bit${!single ? 's' : ''} ${field.to}${!single ? `:${field.from}` : ''}`;
            descBody.textContent = field.desc ?? '';
        }
    });

    errVal.addEventListener('input', () => {
        try {
            const val = BigInt(errVal.value);
            bitfield.setValue(val);
            errVal.ariaInvalid = false;
        } catch (err) {
            errVal.ariaInvalid = true;
            errContainer.setAttribute('data-tooltip', "Invalid hexadecimal value");
        }
    });
}