import { toolsRegistry } from "./modules/modules.js";

// Filter constants
const LOCAL_STORAGE_FILTERS_KEY = 'osdev_tools_filters';
const toolContainer = document.getElementById('tools-container');
const toolFilterContainer = document.getElementById('tools-filter-container');
const filterForm = document.getElementById('tools-filter-container');
const filterResetBtn = document.getElementById('tools-filter-reset');
const allTags = [];

// Theme switcher - see https://basecoatui.com/components/theme-switcher
function initThemeSwitcher() {
    try {
        const stored = localStorage.getItem('themeMode');
        if (stored ? stored === 'dark'
                    : matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
    } catch (_) {}
    
    const apply = dark => {
        document.documentElement.classList.toggle('dark', dark);
        try { localStorage.setItem('themeMode', dark ? 'dark' : 'light'); } catch (_) {}
    };
    
    document.addEventListener('basecoat:theme', (event) => {
        const mode = event.detail?.mode;
        apply(mode === 'dark' ? true
                : mode === 'light' ? false
                : !document.documentElement.classList.contains('dark'));
    });
}

function getToolsFetchPromises() {
    return toolsRegistry.map(async (tool) => {
        try {
            const response = await fetch(tool.module.template);
            if (!response.ok) console.error(`Failed to load tool ${tool.id}:`);
            const html = await response.text();

            const wrapper = document.createElement('div');
            wrapper.id = `tool-wrapper-${tool.id}`;
            wrapper.innerHTML = html;
            wrapper.setAttribute('tool-tags', tool.tags.join(','));
            wrapper.classList = 'break-inside-avoid-column';

            return {tool, node: wrapper};
        } catch (err) {
            console.error(`Failed to load tool ${tool.id}:`, err);
        }
    });
}

async function showAndInitTools(filters) {
    const loadedTools = await Promise.all(getToolsFetchPromises());

    for (const component of loadedTools) {
        if (!component) return;

        // Add child to container
        toolContainer.appendChild(component.node);

        // Extract tags to filters
        for (const tag of component.tool.tags) {
            if (tag in filters) filters[tag]++;
            else filters[tag] = 1;
        }

        // Run init function
        if (typeof component.tool.module.init === 'function') {
            try {
                component.tool.module.init();
            } catch (err) {
                console.error(`Failed to initialize tool ${component.tool.id}:`, err);
            }
        }
    }   
}

function initFilters(filters) {
    // Add filters to popover
    for (const tag in filters) {
        allTags.push(tag);

        const div = document.createElement('div');
        div.classList = "flex items-start gap-2";
        div.id = `tool-filter-${tag}`;
        div.innerHTML = `
        <input type="checkbox" id="${tag}" name="tag" class="input" value="${tag}" checked>
        <label class="label" for="${tag}">${tag}</label>
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

// Load tools and init filters on document load complete
document.addEventListener('DOMContentLoaded', async () => {
    let filters = {};
    
    await showAndInitTools(filters);
    initFilters(filters);
    
    // Create Lucide Icons
    initThemeSwitcher();
    lucide.createIcons();
});
