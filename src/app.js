import { toolsRegistry } from "./modules/modules.js";
import { tagsRegistry } from "./modules/tags.js";
import { registerSW } from 'virtual:pwa-register'

// Filter constants
const LOCAL_STORAGE_FILTERS_KEY = 'osdev_tools_filters';
const toolContainer = document.getElementById('tools-container');
const toolFilterContainer = document.getElementById('tools-filter-container');
const filterForm = document.getElementById('tools-filter-container');
const filterResetBtn = document.getElementById('tools-filter-reset');
const updateAppBtn = document.getElementById('update-app-btn');
const allTags = [];

const updateSW = registerSW({
    onNeedRefresh() {
        console.log('aggiorna');
        updateAppBtn.classList.remove('hidden');
        updateAppBtn.addEventListener('click', () => updateSW(true));
    },
    onOfflineReady() {
        console.log('OSDev Tools PWA installed');
    }
});

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

function getToolsWrappers() {
    return toolsRegistry.map((tool) => {
        try {
            // Create tags dynamically
            let tagsHtml = tool.tags.map(tag => {
                const tagData = tagsRegistry[tag];
                if (tagData === undefined) {
                    console.warn(`Tag '${tag}' is undefined`);
                    return '';
                }
                
                const tagElement = document.createElement('span');
                tagElement.innerHTML = `<i data-lucide="${tagData.icon}"></i>${tagData.text}`;
                tagElement.classList = ['badge', tagData.classes].filter(s => s).join(' ');
                
                return tagElement.outerHTML; 
            }).join('');

            // Create header part
            const header = document.createElement('header');
            header.classList = 'flex flex-col space-y-1.5';
            header.innerHTML = `
            <div class="flex flex-row self-stretch">
                <div class="grow">
                    <h2 class="label text-xl">${tool.title}</h2>
                </div>
                <div class="flex flex-row flex-wrap flex-row-reverse gap-1.5 select-none">
                    ${tagsHtml}
                </div>
            </div>
            <p class="text-muted-foreground text-sm">${tool.description}</p>`;

            // Create tool wrapper card
            const wrapper = document.createElement('div');
            wrapper.id = tool.id;
            wrapper.classList = 'card flex flex-col break-inside-avoid-column';
            wrapper.setAttribute('tool-tags', tool.tags.join(','));
            wrapper.innerHTML = header.outerHTML + tool.module.template;

            return {tool, node: wrapper};
        } catch (err) {
            console.error(`Failed to load tool ${tool.id}:`, err);
        }
    });
}

function showAndInitTools(filters) {
    const loadedTools = getToolsWrappers();

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

// Load tools and init filters on document load complete
document.addEventListener('DOMContentLoaded', async () => {
    let filters = {};
    
    await showAndInitTools(filters);
    initFilters(filters);
    
    // Create Lucide Icons
    initThemeSwitcher();
    lucide.createIcons();
});
