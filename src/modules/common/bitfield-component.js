import content from './bitfield-template.html?raw';

import { Bitfield, formatForField } from '../common/bitfield';
import { setClipboard } from '../common/common';

export class BitfieldComponent {
    constructor(container, config) {
        this.container = container;
        this.container.innerHTML = content;

        const bitfieldContainer = container.querySelector('#bitfield');
        const descTitle = container.querySelector('#desc-title');
        const descBody = container.querySelector('#desc-body');
        const descValue = container.querySelector('#desc-value');
        const copyHexBtn = container.querySelector('#copy-hex-btn');
        const copyDecBtn = container.querySelector('#copy-dec-btn');
        const copyBinBtn = container.querySelector('#copy-bin-btn');

        this.bitfield = new Bitfield(bitfieldContainer, config.schema, {
            initialValue: config.initialValue ?? 0n,
            onClick: (field) => {
                const size = field.from - field.to + 1;
                const single = size === 1;
                const name = field.extName ?? field.name;
    
                descTitle.textContent = `${name} - bit${!single ? 's' : ''} ${field.to}${!single ? `:${field.from}` : ''}`;
                descBody.textContent = field.desc ?? '';
                
                updateFieldDescValue(this.container, field, this.bitfield.value);
                this.descField = field;
            }
        });

        copyHexBtn.addEventListener('click', () => { setClipboard(descValue.value); });
        copyDecBtn.addEventListener('click', () => { setClipboard(BigInt(descValue.value).toString()); });
        copyBinBtn.addEventListener('click', () => { setClipboard(BigInt(descValue.value).toString(2)); });
    }

    setSchema(schema) {
        this.bitfield.setSchema(schema);
    }

    setValue(value) {
        this.bitfield.setValue(value);
        if (this.descField) updateFieldDescValue(this.container, this.descField, this.bitfield.value);
    }
}

function updateFieldDescValue(container, field, value) {
    const descValueDiv = container.querySelector('#desc-value-div');
    const descValue = container.querySelector('#desc-value');
    const single = field.from == field.to;
    
    descValue.value = '';

    if (!single && field.type != 'reserved') {
        try {
            const fieldVal = formatForField(value, field.from, field.to);
            descValueDiv.classList.remove('hidden');
            descValue.value = `0x${fieldVal.toString(16)}`;
        } catch (err) {
            console.log(err);
        }

    } else {
        descValueDiv.classList.add('hidden');
    }
}
