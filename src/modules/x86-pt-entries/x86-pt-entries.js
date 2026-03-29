import content from './content.html?raw';
export { content };

import { BitfieldComponent } from '../common/bitfield-component';

function pte(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: '', type: 'flag' },
        { name: 'PK', extName: 'Protection Key', desc: '', size: 4, type: 'data' },
        { name: 'Available', extName: 'Available', desc: '', size: 7 },
        { name: 'Reserved', desc: '', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: '', type: 'address', size: (m-12) },
        { name: 'Available', extName: 'Available', desc: '', size: 3 },
        { name: 'G', extName: 'Global', desc: '', type: 'flag' },
        { name: 'PAT', extName: 'Page Attribute Table', desc: '', type: 'data' },
        { name: 'D', extName: 'Dirty', desc: '', type: 'flag' },
        { name: 'A', extName: 'Accessed', desc: '', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: '', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: '', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: '', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: '', type: 'flag' },
        { name: 'P', extName: 'Present', desc: '', type: 'flag' },
    ]; 
}

function normalPde(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: '', type: 'flag' },
        { name: 'Available', extName: 'Available', desc: '', size: 11 },
        { name: 'Reserved', desc: '', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: '', type: 'address', size: (m-12) },
        { name: 'Available', extName: 'Available', desc: '', size: 4 },
        { name: 'PS', extName: 'Page Size', desc: '', type: 'flag' },
        { name: 'AVL', extName: 'Available', desc: '' },
        { name: 'A', extName: 'Accessed', desc: '', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: '', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: '', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: '', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: '', type: 'flag' },
        { name: 'P', extName: 'Present', desc: '', type: 'flag' },
    ];
}

function hugePde(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: '', type: 'flag' },
        { name: 'PK', extName: 'Protection Key', desc: '', size: 4, type: 'data' },
        { name: 'Available', extName: 'Available', desc: '', size: 7 },
        { name: 'Reserved', desc: '', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: '', type: 'address', size: (m-21) },
        { name: 'Reserved', extName: 'Reserved', desc: '', type: 'reserved', size: 8 },
        { name: 'PAT', extName: 'Page Attribute Table', desc: '', type: 'data' },
        { name: 'AVL', extName: 'Available', desc: '', size: 3 },
        { name: 'G', extName: 'Global', desc: '', type: 'flag' },
        { name: 'PS', extName: 'Page Size', desc: '', type: 'flag' },
        { name: 'D', extName: 'Dirty', desc: '', type: 'flag' },
        { name: 'A', extName: 'Accessed', desc: '', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: '', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: '', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: '', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: '', type: 'flag' },
        { name: 'P', extName: 'Present', desc: '', type: 'flag' },
    ];
}

function hugePdpte(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: '', type: 'flag' },
        { name: 'PK', extName: 'Protection Key', desc: '', size: 4, type: 'data' },
        { name: 'Available', extName: 'Available', desc: '', size: 7 },
        { name: 'Reserved', desc: '', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: '', type: 'address', size: (m-30) },
        { name: 'Reserved', extName: 'Reserved', desc: '', type: 'reserved', size: 17 },
        { name: 'PAT', extName: 'Page Attribute Table', desc: '', type: 'data' },
        { name: 'AVL', extName: 'Available', desc: '', size: 3 },
        { name: 'G', extName: 'Global', desc: '', type: 'flag' },
        { name: 'PS', extName: 'Page Size', desc: '', type: 'flag' },
        { name: 'D', extName: 'Dirty', desc: '', type: 'flag' },
        { name: 'A', extName: 'Accessed', desc: '', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: '', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: '', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: '', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: '', type: 'flag' },
        { name: 'P', extName: 'Present', desc: '', type: 'flag' },
    ];
}

function updateAddrWidth(bitfieldComponent, ptType, paddrLen) {
    const m = paddrLen.value || 52;
    
    paddrLen.ariaInvalid = false;
    if (m < parseInt(paddrLen.min) || m > parseInt(paddrLen.max)) {
        paddrLen.ariaInvalid = true;
        return;
    }
    
    ptType.ariaInvalid = false;
    switch (ptType.value) {
        case 'pte':
            bitfieldComponent.setSchema(pte(m));
            break;
        case 'pde':
            bitfieldComponent.setSchema(normalPde(m));
            break;
        case 'huge-pde':
            bitfieldComponent.setSchema(hugePde(m));
            break;
        case 'huge-pdpte':
            bitfieldComponent.setSchema(hugePdpte(m));
            break;
        default:
            ptType.ariaInvalid = true;
    }
}

export function init(container) {
    console.log('x86 page table entry visualizer loaded');

    const errContainer = container.querySelector('#page-entry-value-div');
    const ptVal = container.querySelector('#page-entry-value');
    const ptType = container.querySelector('#page-entry-type');
    const paddrLen = container.querySelector('#paddr-len-value');

    const bitfieldComponent = new BitfieldComponent(container.querySelector('BitfieldComponent'), {
        schema: pte(paddrLen.value ?? 52)
    });

    ptType.addEventListener('change', () => {
        updateAddrWidth(bitfieldComponent, ptType, paddrLen);
    });

    paddrLen.addEventListener('input', () => {
        updateAddrWidth(bitfieldComponent, ptType, paddrLen);
    });

    ptVal.addEventListener('input', () => {
        try {
            errContainer.removeAttribute('data-tooltip');
            ptVal.ariaInvalid = false;
            bitfieldComponent.setValue(BigInt(ptVal.value));
        } catch (err) {
            console.warn(err);
            ptVal.ariaInvalid = true;
            errContainer.setAttribute('data-tooltip', "Invalid hexadecimal value");
        }
    });
}
