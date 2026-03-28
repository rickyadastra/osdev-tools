const colSpan = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    13: 'col-span-13',
    14: 'col-span-14',
    15: 'col-span-15',
    16: 'col-span-16',
    17: 'col-span-17',
    18: 'col-span-18',
    19: 'col-span-19',
    20: 'col-span-20',
    21: 'col-span-21',
    22: 'col-span-22',
    23: 'col-span-23',
    24: 'col-span-24',
    25: 'col-span-25',
    26: 'col-span-26',
    27: 'col-span-27',
    28: 'col-span-28',
    29: 'col-span-29',
    30: 'col-span-30',
    31: 'col-span-31',
    32: 'col-span-32',
};

const colStart = {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
    13: 'col-start-13',
    14: 'col-start-14',
    15: 'col-start-15',
    16: 'col-start-16',
    17: 'col-start-17',
    18: 'col-start-18',
    19: 'col-start-19',
    20: 'col-start-20',
    21: 'col-start-21',
    22: 'col-start-22',
    23: 'col-start-23',
    24: 'col-start-24',
    25: 'col-start-25',
    26: 'col-start-26',
    27: 'col-start-27',
    28: 'col-start-28',
    29: 'col-start-29',
    30: 'col-start-30',
    31: 'col-start-31',
    32: 'col-start-32',
    '@xl': {
        1: '@xl:col-start-1',
        2: '@xl:col-start-2',
        3: '@xl:col-start-3',
        4: '@xl:col-start-4',
        5: '@xl:col-start-5',
        6: '@xl:col-start-6',
        7: '@xl:col-start-7',
        8: '@xl:col-start-8',
        9: '@xl:col-start-9',
        10: '@xl:col-start-10',
        11: '@xl:col-start-11',
        12: '@xl:col-start-12',
        13: '@xl:col-start-13',
        14: '@xl:col-start-14',
        15: '@xl:col-start-15',
        16: '@xl:col-start-16',
        17: '@xl:col-start-17',
        18: '@xl:col-start-18',
        19: '@xl:col-start-19',
        20: '@xl:col-start-20',
        21: '@xl:col-start-21',
        22: '@xl:col-start-22',
        23: '@xl:col-start-23',
        24: '@xl:col-start-24',
        25: '@xl:col-start-25',
        26: '@xl:col-start-26',
        27: '@xl:col-start-27',
        28: '@xl:col-start-28',
        29: '@xl:col-start-29',
        30: '@xl:col-start-30',
        31: '@xl:col-start-31',
        32: '@xl:col-start-32',
    },
    '@4xl': {
        1: '@4xl:col-start-1',
        2: '@4xl:col-start-2',
        3: '@4xl:col-start-3',
        4: '@4xl:col-start-4',
        5: '@4xl:col-start-5',
        6: '@4xl:col-start-6',
        7: '@4xl:col-start-7',
        8: '@4xl:col-start-8',
        9: '@4xl:col-start-9',
        10: '@4xl:col-start-10',
        11: '@4xl:col-start-11',
        12: '@4xl:col-start-12',
        13: '@4xl:col-start-13',
        14: '@4xl:col-start-14',
        15: '@4xl:col-start-15',
        16: '@4xl:col-start-16',
        17: '@4xl:col-start-17',
        18: '@4xl:col-start-18',
        19: '@4xl:col-start-19',
        20: '@4xl:col-start-20',
        21: '@4xl:col-start-21',
        22: '@4xl:col-start-22',
        23: '@4xl:col-start-23',
        24: '@4xl:col-start-24',
        25: '@4xl:col-start-25',
        26: '@4xl:col-start-26',
        27: '@4xl:col-start-27',
        28: '@4xl:col-start-28',
        29: '@4xl:col-start-29',
        30: '@4xl:col-start-30',
        31: '@4xl:col-start-31',
        32: '@4xl:col-start-32',
    }
};

export class Bitfield {
    /**
     * @param {HTMLElement} container
     * @param {Array} schema
     * @param {Object} options
     */
    constructor(container, schema, options = {}) {
        this.container = container;
        this.schema = schema;
        this.value = BigInt(options.initialValue || 0);
        this.onClick = options.onClick || null;

        this.bitElements = new Array();
        this.init();
    }

    init() {
        this.container.classList.add('@container');
        this.setSchema(this.schema);
    }

    createSingleBitField(field, bitIndex, extraClasses = '', isFirst = false) {
        const fieldEl = document.createElement('bitfield');
        extraClasses.split(' ').filter(String).forEach(c => fieldEl.classList.add(c));
        if (isFirst) fieldEl.classList += ' ' + getColStartClasses(bitIndex);
        if (field.type !== undefined) fieldEl.classList.add(`bitfield-${field.type}`);
        if (this.onClick) {
            fieldEl.classList.add('cursor-pointer');
            fieldEl.addEventListener('click', () => this.onClick({...field, from: bitIndex, to: bitIndex}));
        }

        fieldEl.innerHTML = `
        <p class="bitfield-value">0</p>
        <p class="truncate">${field.name}</p>
        <p class="bitfield-bit">${bitIndex}</p>
        `;

        this.bitElements.push({elem: fieldEl, from: bitIndex, to: bitIndex});
        return fieldEl;
    }

    createMultiBitFields(field, bitIndex, extraClasses = '', isFirst = false) {
        if (field.size == 1) return [this.createSingleBitField(field, bitIndex, extraClasses, isFirst)];

        const fit8 = field.size <= 8 && fitGroup(bitIndex, bitIndex-field.size+1, 8);
        const fit16 = fit8 || (field.size <= 16 && fitGroup(bitIndex, bitIndex-field.size+1, 16));
        const fit32 = fit16 || (field.size <= 32 && fitGroup(bitIndex, bitIndex-field.size+1, 32));
         
        let fields = new Array();
        const statrClasses = isFirst ? getColStartClasses(bitIndex) : '';
        const typeClass = field.type !== undefined ? `bitfield-${field.type}` : '';
        const cursorClass = this.onClick ? 'cursor-pointer' : '';
        const fullClasses = [extraClasses, statrClasses, typeClass, cursorClass].filter(String).join(' ');

        if (fit8) { // Field fits in 8 bit span, add only one field
            const fieldEl = createMultibitField(field, bitIndex, fullClasses);
            fields.push(fieldEl);
            this.bitElements.push({elem: fieldEl, from: bitIndex, to: bitIndex-field.size+1});
            if (this.onClick) fieldEl.addEventListener('click', () => this.onClick({...field, from: bitIndex, to: bitIndex-field.size+1}));

        } else if (fit16) { // Field fits 16 bits but not 8, need split    
            const remainder = bitIndex%8 + 1;

            // Add large field 
            const fieldEl = createMultibitField(field, bitIndex, `${fullClasses} hidden @xl:flex`);
            fields.push(fieldEl);
            this.bitElements.push({elem: fieldEl, from: bitIndex, to: bitIndex-field.size+1});
            if (this.onClick) fieldEl.addEventListener('click', () => this.onClick({...field, from: bitIndex, to: bitIndex-field.size+1}));

            // Split field recursively
            this.createMultiBitFields({...field, size: remainder}, bitIndex, `${extraClasses} @xl:hidden`, isFirst)
                .forEach(e => fields.push(e));
            this.createMultiBitFields({...field, size: field.size-remainder}, bitIndex-remainder, `${extraClasses} @xl:hidden`, isFirst)
                .forEach(e => fields.push(e));

        } else if (fit32) { // Field fits 32 bits but not 8 nor 16, need split
            const remainder = bitIndex%16 + 1;

            // Again, add large field
            const fieldEl = createMultibitField(field, bitIndex, `${fullClasses} hidden @4xl:flex`);
            fields.push(fieldEl);
            this.bitElements.push({elem: fieldEl, from: bitIndex, to: bitIndex-field.size+1});
            if (this.onClick) fieldEl.addEventListener('click', () => this.onClick({...field, from: bitIndex, to: bitIndex-field.size+1}));

            // And split recursively
            this.createMultiBitFields({...field, size: remainder}, bitIndex, `${extraClasses} @4xl:hidden`, isFirst)
                .forEach(e => fields.push(e));
            this.createMultiBitFields({...field, size: field.size-remainder}, bitIndex-remainder, `${extraClasses} @4xl:hidden`, isFirst)
                .forEach(e => fields.push(e));
        
        } else { // Every field larger than 32 bits needs split
            const remainder = bitIndex%32 + 1;

            this.createMultiBitFields({...field, size: remainder}, bitIndex, `${extraClasses}`, isFirst)
                .forEach(e => fields.push(e));
            this.createMultiBitFields({...field, size: field.size-remainder}, bitIndex-remainder, `${extraClasses}`, isFirst)
                .forEach(e => fields.push(e));
        }

        return fields;
    }

    setValue(nvalue) {
        this.value = nvalue;
        this.update();
    }

    setSchema(schema) {
        this.container.innerHTML = '';
        const group = document.createElement('bitgroup');

        const totalSize = schema.reduce((acc, field) => acc + (field.size || 1), 0);
        let currentBit = totalSize - 1;
        let firstField = true;
        
        schema.forEach(field => {
            const size = field.size || 1;
            
            if (size === 1) {
                const fieldEl = this.createSingleBitField(field, currentBit, '', firstField);
                group.appendChild(fieldEl);

                currentBit -= 1;
            } else {
                const fieldEls = this.createMultiBitFields(field, currentBit, '', firstField);
                fieldEls.forEach(el => group.appendChild(el));
                
                currentBit -= size;
            }

            firstField = false;
        });

        this.container.appendChild(group);
        this.update();
    }

    update() {
        this.bitElements.forEach((field) => {
            const valueSpan = field.elem.querySelector('.bitfield-value');
            const len = field.from - field.to + 1;
            const mask = ((1n << BigInt(len)) - 1n) << BigInt(field.to);

            const isHex = len >= 8;
            const text = ((this.value & mask) >> BigInt(field.to))
                .toString(isHex ? 16 : 2)
                .padStart(isHex ? len / 4 : len, '0');

            valueSpan.innerHTML = `${isHex ? '<span class="text-foreground/30 text-sm">0x</span>' : ''}${text}`;
        });
    }
}

function fitGroup(num, num2, size) {
    return Math.floor(num / size) == Math.floor(num2 / size);
}

function getColStartClasses(bitIndex) {
    return `${colStart[8 - (bitIndex % 8)]} ${colStart['@xl'][16 - (bitIndex % 16)]} ${colStart['@4xl'][32 - (bitIndex % 32)]}`;
}

function createMultibitField(field, bitIndex, extraClasses = '') {
    const fieldEl = document.createElement('bitfield');
    fieldEl.classList.add(colSpan[field.size]);
    extraClasses.split(' ').filter(String).forEach(c => fieldEl.classList.add(c));

    fieldEl.innerHTML = `
    <p class="bitfield-value">0</p>
    <p class="truncate">${field.name}</p>
    <div class="flex flex-row">
        <p class="bitfield-bit">${bitIndex}</p>
        <p class="bitfield-bit">${bitIndex-field.size + 1}</p>
    </div>
    `

    return fieldEl;
}
