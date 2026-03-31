import content from './content.html?raw';
export { content };

import { BitfieldComponent } from '../common/bitfield-component';

function pte(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: 'If enabled (bit 11 in the EFER register) and the bit is set, execution at addresses within the page is not allowed. Otherwise it will be. If disabled, the XD bit is reserved and must be set to 0.', type: 'flag' },
        { name: 'PK', extName: 'Protection Key', desc: 'A 4-bit value used to control user-mode and supervisor-mode memory access for multiple page entries across different address spaces. If bit 22 in CR4 is set, the PKRU register is used for determining access rights for user-mode based on the protection key. If bit 24 in CR4 is set, the PKRS register is used for determining access rights for supervisor-mode based on the protection key.', size: 4, type: 'data' },
        { name: 'Available', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 7 },
        { name: 'Reserved', desc: 'Must be set to 0.', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: 'Physical address of a 4 KiB-aligned frame. Note that this field actually only stores bits 12th to the physical address width.', type: 'address', size: (m-12) },
        { name: 'Available', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 3 },
        { name: 'G', extName: 'Global', desc: 'If set, the CPU will not invalidate the TLB entry corresponding to the marked page. Note that bit 7 in CR4 must be set to enable global pages.', type: 'flag' },
        { name: 'PAT', extName: 'Page Attribute Table', desc: 'If supported, indicates the memory caching type along with CD and WT bits. Otherwise it is reserved and must be set to 0.', type: 'data' },
        { name: 'D', extName: 'Dirty', desc: 'If the bit is set, the page has been written to.', type: 'flag' },
        { name: 'A', extName: 'Accessed', desc: 'If the bit is set, the page has been read during virtual address translation. Note that the bit will not be cleared by the CPU.', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: 'If the bit is set, the page will not be cached. Otherwise it will be.', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: 'If the bit is set, write-through caching is enabled. Otherwise write-back is enabled.', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: 'If the bit is set, the page may be accessed by all privilege levels. Otherwise the supervisor privilege level is necessary to access it. The U/S bit of the parent tables is also checked: if any are 0, the page is treated as supervisor.', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: 'If the bit is set, the page is read/write. Otherwise the page is read-only. The R/W bit of the parent tables is also checked: if any are 0, the page is treated as read-only.', type: 'flag' },
        { name: 'P', extName: 'Present', desc: 'If the bit is set, the page is actually in physical memory at the moment. If a page is called, but not present, a page fault will occur, and the OS should handle it.', type: 'flag' },
    ]; 
}

function normalPde(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: 'If enabled (bit 11 in the EFER register) and the bit is set, execution at addresses within the page is not allowed. Otherwise it will be. If disabled, the XD bit is reserved and must be set to 0.', type: 'flag' },
        { name: 'Available', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 11 },
        { name: 'Reserved', desc: 'Must be set to 0.', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: 'Physical address of a 4 KiB-aligned page table. Note that this field actually only stores bits 12th to the physical address width.', type: 'address', size: (m-12) },
        { name: 'Available', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 4 },
        { name: 'PS', extName: 'Page Size', desc: 'This bit should be not set in normal-sized PDE, PML4 entries and PML5 entries. If set, you are probably looking at a huge PDE instead and you need to change the Entry Type to either huge PDE (2 MiB) or huge PDPTE (1 GiB).', type: 'flag' },
        { name: 'AVL', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.' },
        { name: 'A', extName: 'Accessed', desc: 'If the bit is set, the page has been read during virtual address translation. Note that the bit will not be cleared by the CPU.', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: 'If the bit is set, the page will not be cached. Otherwise it will be.', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: 'If the bit is set, write-through caching is enabled. Otherwise write-back is enabled.', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: 'If the bit is set, the page may be accessed by all privilege levels. Otherwise the supervisor privilege level is necessary to access it. The U/S bit of the parent tables is also checked: if any are 0, the page is treated as supervisor.', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: 'If the bit is set, the page is read/write. Otherwise the page is read-only. The R/W bit of the parent tables is also checked: if any are 0, the page is treated as read-only.', type: 'flag' },
        { name: 'P', extName: 'Present', desc: 'If the bit is set, the page is actually in physical memory at the moment. If a page is called, but not present, a page fault will occur, and the OS should handle it.', type: 'flag' },
    ];
}

function hugePde(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: 'If enabled (bit 11 in the EFER register) and the bit is set, execution at addresses within the page is not allowed. Otherwise it will be. If disabled, the XD bit is reserved and must be set to 0.', type: 'flag' },
        { name: 'PK', extName: 'Protection Key', desc: 'A 4-bit value used to control user-mode and supervisor-mode memory access for multiple page entries across different address spaces. If bit 22 in CR4 is set, the PKRU register is used for determining access rights for user-mode based on the protection key. If bit 24 in CR4 is set, the PKRS register is used for determining access rights for supervisor-mode based on the protection key.', size: 4, type: 'data' },
        { name: 'Available', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 7 },
        { name: 'Reserved', desc: 'Must be set to 0.', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: 'Physical address of a 2 MiB-aligned frame. Note that this field actually only stores bits 21st to the physical address width.', type: 'address', size: (m-21) },
        { name: 'Reserved', desc: 'Must be set to 0.', type: 'reserved', size: 8 },
        { name: 'PAT', extName: 'Page Attribute Table', desc: 'If supported, indicates the memory caching type along with CD and WT bits. Otherwise it is reserved and must be set to 0.', type: 'data' },
        { name: 'AVL', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 3 },
        { name: 'G', extName: 'Global', desc: 'If set, the CPU will not invalidate the TLB entry corresponding to the marked page. Note that bit 7 in CR4 must be set to enable global pages.', type: 'flag' },
        { name: 'PS', extName: 'Page Size', desc: 'This bit should be set in a huge PDE. If not set, you are probably looking at a normal-sized PDE instead and you need to change the Entry Type to Normal PDE.', type: 'flag' },
        { name: 'D', extName: 'Dirty', desc: 'If the bit is set, the page has been written to.', type: 'flag' },
        { name: 'A', extName: 'Accessed', desc: 'If the bit is set, the page has been read during virtual address translation. Note that the bit will not be cleared by the CPU.', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: 'If the bit is set, the page will not be cached. Otherwise it will be.', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: 'If the bit is set, write-through caching is enabled. Otherwise write-back is enabled.', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: 'If the bit is set, the page may be accessed by all privilege levels. Otherwise the supervisor privilege level is necessary to access it. The U/S bit of the parent tables is also checked: if any are 0, the page is treated as supervisor.', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: 'If the bit is set, the page is read/write. Otherwise the page is read-only. The R/W bit of the parent tables is also checked: if any are 0, the page is treated as read-only.', type: 'flag' },
        { name: 'P', extName: 'Present', desc: 'If the bit is set, the page is actually in physical memory at the moment. If a page is called, but not present, a page fault will occur, and the OS should handle it.', type: 'flag' },
    ];
}

function hugePdpte(m) {
    return [
        { name: 'XD', extName: 'Execution Disable', desc: 'If enabled (bit 11 in the EFER register) and the bit is set, execution at addresses within the page is not allowed. Otherwise it will be. If disabled, the XD bit is reserved and must be set to 0.', type: 'flag' },
        { name: 'PK', extName: 'Protection Key', desc: 'A 4-bit value used to control user-mode and supervisor-mode memory access for multiple page entries across different address spaces. If bit 22 in CR4 is set, the PKRU register is used for determining access rights for user-mode based on the protection key. If bit 24 in CR4 is set, the PKRS register is used for determining access rights for supervisor-mode based on the protection key.', size: 4, type: 'data' },
        { name: 'Available', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 7 },
        { name: 'Reserved', desc: 'Must be set to 0.', type: 'reserved', size: Math.max(0, 64-m-12) },
        { name: 'Physical Frame Number', desc: 'Physical address of a 1 GiB-aligned frame. Note that this field actually only stores bits 30th to the physical address width.', type: 'address', size: (m-30) },
        { name: 'Reserved', desc: 'Must be set to 0.', type: 'reserved', size: 17 },
        { name: 'PAT', extName: 'Page Attribute Table', desc: 'If supported, indicates the memory caching type along with CD and WT bits. Otherwise it is reserved and must be set to 0.', type: 'data' },
        { name: 'AVL', extName: 'Available', desc: 'These bits are ignored by the CPU and can be used by the OS to store additional information. In some cases, an IOMMU may use some of these bits.', size: 3 },
        { name: 'G', extName: 'Global', desc: 'If set, the CPU will not invalidate the TLB entry corresponding to the marked page. Note that bit 7 in CR4 must be set to enable global pages.', type: 'flag' },
        { name: 'PS', extName: 'Page Size', desc: 'This bit should be set in a huge PDPTE. If not set, you are probably looking at a normal-sized PDE instead and you need to change the Entry Type to Normal PDE.', type: 'flag' },
        { name: 'D', extName: 'Dirty', desc: 'If the bit is set, the page has been written to.', type: 'flag' },
        { name: 'A', extName: 'Accessed', desc: 'If the bit is set, the page has been read during virtual address translation. Note that the bit will not be cleared by the CPU.', type: 'flag' },
        { name: 'CD', extName: 'Cache Disable', desc: 'If the bit is set, the page will not be cached. Otherwise it will be.', type: 'flag' },
        { name: 'WT', extName: 'Write-Through', desc: 'If the bit is set, write-through caching is enabled. Otherwise write-back is enabled.', type: 'flag' },
        { name: 'U/S', extName: 'User/Supervisor', desc: 'If the bit is set, the page may be accessed by all privilege levels. Otherwise the supervisor privilege level is necessary to access it. The U/S bit of the parent tables is also checked: if any are 0, the page is treated as supervisor.', type: 'flag' },
        { name: 'R/W', extName: 'Read/Write', desc: 'If the bit is set, the page is read/write. Otherwise the page is read-only. The R/W bit of the parent tables is also checked: if any are 0, the page is treated as read-only.', type: 'flag' },
        { name: 'P', extName: 'Present', desc: 'If the bit is set, the page is actually in physical memory at the moment. If a page is called, but not present, a page fault will occur, and the OS should handle it.', type: 'flag' },
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
