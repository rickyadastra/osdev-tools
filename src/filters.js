const LOCAL_STORAGE_FILTERS_KEY = 'osdev_tools_filters';
const toolFilterContainer = document.getElementById('tools-filter-container');
const filterForm = document.getElementById('tools-filter-container');
const filterResetBtn = document.getElementById('tools-filter-reset');
const allTags = [];

export const tagsRegistry = {
    'x86': {
        text: 'x86',
        icon: 'cpu',
        classes: ''
    },
    'paging': {
        text: 'Paging',
        icon: 'memory-stick',
        classes: 'bg-blue-700 dark:bg-blue-300 dark:text-blue-950'
    },
    'exception': {
        text: 'Exception',
        icon: 'bomb',
        classes: 'bg-red-700 dark:bg-red-300 dark:text-red-950'
    }
};

function initFilters(filters) {
    // Add filters to popover
    for (const tag in filters) {
        allTags.push(tag);

        const tagData = tagsRegistry[tag];
        if (tagData === undefined) {
            console.warn(`Tag '${tag}' is undefined`);
            continue;
        }

        const div = document.createElement('div');
        div.classList = "flex items-start gap-2";
        div.id = `tool-filter-${tag}`;
        div.innerHTML = `
        <input type="checkbox" id="${tag}" name="tag" class="input" value="${tag}" checked>
        <label class="label" for="${tag}">${tagsRegistry[tag].text}</label>
        <p class="label font-normal text-sm text-muted-foreground">(${filters[tag]} tool${filters[tag] > 1 ? 's' : ''})</p>`;
        toolFilterContainer.appendChild(div);
    }

    // Load active filters
    let storageTags = localStorage.getItem(LOCAL_STORAGE_FILTERS_KEY);
    let activeTags = [];

    if (storageTags) {
        activeTags = JSON.parse(storageTags);
        updateFilterCheckboxes(activeTags);
    } else {
        activeTags = allTags;
    }

    // Update view with active tags from storage
    updateToolsView(activeTags);

    // Update view on filters change
    filterForm.addEventListener('change', () => {
        const data = new FormData(filterForm);
        const selectedTags = data.getAll("tag");

        localStorage.setItem(LOCAL_STORAGE_FILTERS_KEY, JSON.stringify(selectedTags));
        updateToolsView(selectedTags);
    });

    filterResetBtn.addEventListener('click', () => {
        // Check all checkboxes
        updateFilterCheckboxes(allTags);
        // Update view
        updateToolsView(allTags);
        // Save new filters
        localStorage.setItem(LOCAL_STORAGE_FILTERS_KEY, JSON.stringify(allTags));
    });
}

function updateFilterCheckboxes(filters) {
    const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => { cb.checked = filters.includes(cb.value); });
}

function updateToolsView(filters=[]) {
    const toolContainer = document.getElementById('tools-container');
    const noneContainer = document.getElementById('tools-container-none');
    let count = 0;
    
    for (const child of toolContainer.children) {
        const tags = child.getAttribute('tool-tags').split(',');

        if (tags.some(r => filters.includes(r))) {
            child.classList.remove('hidden');
            count++;
        } else {
            child.classList.add('hidden');
        }
    }

    if (count == 0) {
        noneContainer.classList.remove('hidden');
    } else {
        noneContainer.classList.add('hidden');
    }
}

export { initFilters };
