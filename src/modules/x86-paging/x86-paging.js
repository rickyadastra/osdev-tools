import content from './content.html?raw';
export { content };

const B32_PAE = '32-bit-pae';
const B64_4LV = '64-bit-4-levels';
const B64_5LV = '64-bit-5-levels';
const MAX_32B = (1n << 32n) - 1n;

let modeSelector, uppercaseAddr, vaddr, vaddrDiv;
let pml5id, pml4id, pdptId, pdId, ptId;
let pml5hex, pml4hex, pdptHex, pdHex, ptHex, pageOffset;

let mode = B64_4LV;
let addrUppercase = false;
let cachedOffset;
let isUpdatingAddr = false;

export function init(container) {
    modeSelector = container.querySelector('#paging-mode');
    uppercaseAddr = container.querySelector('#address-uppercase');

    vaddr = container.querySelector('#vaddr');
    vaddrDiv = container.querySelector('#vaddr-div');

    pml5id = container.querySelector('#index-pml5');
    pml5hex = container.querySelector('#index-pml5-hex');
    pml4id = container.querySelector('#index-pml4');
    pml4hex = container.querySelector('#index-pml4-hex');
    pdptId = container.querySelector('#index-pdpt');
    pdptHex = container.querySelector('#index-pdpt-hex');
    pdId = container.querySelector('#index-pd');
    pdHex = container.querySelector('#index-pd-hex');
    ptId = container.querySelector('#index-pt');
    ptHex = container.querySelector('#index-pt-hex');
    pageOffset = container.querySelector('#page-offset-hex');
    cachedOffset = BigInt(pageOffset.value);
    
    // Mode selector change event
    modeSelector.addEventListener('change', () => 
        { updatePagingMode(); });

    // Address uppercase change event
    uppercaseAddr.addEventListener('change', () => {
        addrUppercase = uppercaseAddr.checked;
        pageOffset.value = formatHexNumber(cachedOffset, 3);
        updateIndices();
    });

    pml5id.addEventListener('input', () => { updatePml5(); });
    pml4id.addEventListener('input', () => { updatePml4(); });
    pdptId.addEventListener('input', () => { updatePdpt(); });
    pdId.addEventListener('input', () => { updatePd(); });
    ptId.addEventListener('input', () => { updatePt(); });
    pageOffset.addEventListener('input', () => { updatePageOffset(); });

    vaddr.addEventListener('input', () => { updateAddressToIndices(); });  
    
    console.log("x86 address converter loaded");
}

function formatHexNumber(val, pads) {
    if (val === null || val === undefined) return '';
    let s = val.toString(16).replace('0x','').padStart(pads, '0');
    return `0x${addrUppercase ? s.toUpperCase() : s}`;
}

function updateAddressToIndices() {
    const str = vaddr.value.toLowerCase().replace('0x','').trim();
    const valid = isHex(str);

    vaddr.ariaInvalid = !valid;

    if (valid) {
        const val = BigInt(`0x${str}`);

        isUpdatingAddr = true;
        
        // 32 bit addresses are 32 bits long, 
        // while 64 bit addresses in 4 level paging are 48 bits long
        updateVirtAddrWarning(val);

        const offset = val & 0xfffn;
        const pti = (val >> 12n) & 0x1ffn;
        const pdi = (val >> 21n) & 0x1ffn;
        const pdpti = (val >> 30n) & 0x1ffn;
        const pml4i = (val >> 39n) & 0x1ffn;
        const pml5i = (val >> 48n) & 0x1ffn;

        if (mode == B64_5LV) pml5id.value = pml5i;
        if (mode == B64_4LV || mode == B64_5LV) pml4id.value = pml4i;
        pdptId.value = pdpti;
        pdId.value = pdi;
        ptId.value = pti;
        pageOffset.value = cachedOffset = formatHexNumber(offset, 3);
        updateIndices();

        isUpdatingAddr = false;
        
    } else {
        vaddrDiv.setAttribute('data-tooltip', "Invalid hexadecimal address");
    }
}

function updateVirtAddrWarning(val) {
    if (mode == B32_PAE && val > MAX_32B) {
        vaddrDiv.setAttribute('data-tooltip', "Address is too big for 32 bit paging mode");
        vaddr.ariaInvalid = true;
        return;
    } else if (mode == B64_4LV) {
        if (!checkCanonicalForm(val, 48n)) {
            vaddrDiv.setAttribute('data-tooltip', "Address is not in canonical form");
            vaddr.ariaInvalid = true;
            return;
        }

    } else if (mode == B64_5LV) {
        if (!checkCanonicalForm(val, 56n)) {
            vaddrDiv.setAttribute('data-tooltip', "Address is not in canonical form");
            vaddr.ariaInvalid = true;
            return;
        }
    }

    vaddrDiv.removeAttribute('data-tooltip');
    vaddr.ariaInvalid = false;
}

function checkCanonicalForm(val, highBit) {
    const msb = (val >> (highBit-1n)) & 1n;
    const bits = (val >> highBit);
    const REQBITS = msb == 1n ? (1n << (64n-highBit)) - 1n : 0n;

    if (bits != REQBITS) {
        
        return false;
    }

    return true;
}

function isHex(str) {
    return str.match(/^[0-9a-f]+$/i);
}

function updatePagingMode() {
    mode = modeSelector.value;

    switch (mode) {
        case B32_PAE:
            pml5id.disabled = true;
            pml4id.disabled = true;
            pdptId.max = 3;
            pml5id.value = 0;
            pml4id.value = 0;
            updatePml5();
            updatePml4();
            break;
        
        case B64_4LV:
            pml5id.disabled = true;
            pml4id.disabled = false;
            pdptId.max = 511;
            pml5id.value = 0;
            updatePml5();
            break;
        
        case B64_5LV:
            pml5id.disabled = false;
            pml4id.disabled = false;
            pdptId.max = 511;
            break;
    }

    updateAddressToIndices();
}

function updateIndices() {
    updatePml5();
    updatePml4();
    updatePdpt();
    updatePd();
    updatePt();
}

function updatePml5() {
    const idElem = pml5id;
    const hexElem = pml5hex;
    let value = BigInt(idElem.value);

    idElem.ariaInvalid = value > idElem.max;

    if (value <= idElem.max) {
        hexElem.innerText = formatHexNumber(value, 3);
        indicesToAddr();
    }
}

function updatePml4() {
    const idElem = pml4id;
    const hexElem = pml4hex;
    let value = BigInt(idElem.value);
    
    idElem.ariaInvalid = value > idElem.max;

    if (value <= idElem.max) {
        hexElem.innerText = formatHexNumber(value, 3);
        indicesToAddr();
    }
}

function updatePdpt() {
    const idElem = pdptId;
    const hexElem = pdptHex;
    let value = BigInt(idElem.value);
    
    idElem.ariaInvalid = value > idElem.max;

    if (value <= idElem.max) {
        hexElem.innerText = formatHexNumber(value, 3);
        indicesToAddr();
    }
}

function updatePd() {
    const idElem = pdId;
    const hexElem = pdHex;
    let value = BigInt(idElem.value);
    
    idElem.ariaInvalid = value > idElem.max;

    if (value <= idElem.max) {
        hexElem.innerText = formatHexNumber(value, 3);
        indicesToAddr();
    }
}

function updatePt() {
    const idElem = ptId;
    const hexElem = ptHex;
    let value = BigInt(idElem.value);
    
    idElem.ariaInvalid = value > idElem.max;

    if (value <= idElem.max) {
        hexElem.innerText = formatHexNumber(value, 3);
        indicesToAddr();
    }
}

function updatePageOffset() {
    if (!isHex(pageOffset.value.replace('0x',''))) {
        pageOffset.ariaInvalid = true;
        return;
    }

    let value = BigInt(pageOffset.value);

    pageOffset.ariaInvalid = value > 0xfffn;
    if (value > 0xfffn) return;

    indicesToAddr();
}

function indicesToAddr() {
    if (isUpdatingAddr) return;

    let addr = (BigInt(pdptId.value) << 30n) | 
                (BigInt(pdId.value) << 21n) | 
                (BigInt(ptId.value) << 12n) | 
                (BigInt(pageOffset.value) & 0xfffn);

    switch (mode) {
        case B64_5LV:
            addr |= (BigInt(pml5id.value) << 48n);
        case B64_4LV:
            addr |= (BigInt(pml4id.value) << 39n);
    }
    
    const highBit = mode == B64_4LV ? 48n : 56n;
    if (!checkCanonicalForm(addr, highBit)) {
        addr = (((1n << (64n - highBit)) - 1n) << highBit) | addr;
    }

    vaddr.value = formatHexNumber(addr);
    updateVirtAddrWarning(addr);
}
