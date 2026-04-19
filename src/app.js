import { toolsRegistry } from "./modules/modules";
import { tagsRegistry, initFilters } from "./filters";
import { registerSW } from 'virtual:pwa-register'

const toolContainer = document.getElementById('tools-container');
const updateAppBtn = document.getElementById('update-app-btn');
const footerVersion = document.getElementById('footer-version');

const changelogDialog = document.getElementById('dialog-changelog');
const changelogCloseBtn = document.getElementById('changelog-close-btn');
const changelogVersion = document.getElementById('changelog-version');
const changelogBody = document.getElementById('changelog-body');
const changelogList = document.getElementById('changelog-list');
const LOCAL_STORAGE_VERSION_KEY = 'osdev_tools_version_seen';

const layoutToggleBtn = document.getElementById('layout-toggle-btn');
const LOCAL_STORAGE_LAYOUT_MODE = 'osdev_tools_layout';
let layout = 'columns';

const changelog = {
    version: '0.1.0',
    desc: 'First public release of OSDev Tools.',
    list: [
        { text: 'Added x86 Address Converter tool' },
        { text: 'Added x86 Exception Error Analyzer tool' },
        { text: 'Available as an offline web app' },
    ]
};

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
            wrapper.innerHTML = header.outerHTML + tool.module.content;

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
                component.tool.module.init(component.node);
            } catch (err) {
                console.error(`Failed to initialize tool ${component.tool.id}:`, err);
            }
        }
    }   
}

function showChangelog(updateVer = true) {
    const seenVer = localStorage.getItem(LOCAL_STORAGE_VERSION_KEY);

    if (!updateVer || seenVer !== changelog.version) {
        // Set seen version if it's first time opening the app
        if (seenVer === null) {
            localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, changelog.version);
            return;
        }

        changelogVersion.textContent = changelog.version;
        changelogBody.textContent = changelog.desc;
        changelogList.innerHTML = '';
    
        changelog.list.forEach(l => {
            const li = document.createElement('li');
            li.innerHTML = l.text;
    
            if (l.author) {
                if (l.authorLink) li.innerHTML += ` (<a href="${l.authorLink}" class="btn-link p-0 h-auto">${l.author}</a>)`;
                else li.innerHTML += ` (${l.author})`;
            }
    
            changelogList.appendChild(li);
        });
    
        changelogDialog.showModal();
    }
}

function closeChangelogDialog(updateVer = true) {
    changelogDialog.close();
    if (updateVer) localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, changelog.version);
}

function addChangelogListeners() {
    changelogDialog.addEventListener('click', (e) => { if (e.target === changelogDialog) closeChangelogDialog(); });
    changelogCloseBtn.addEventListener('click', closeChangelogDialog);
}

function setFooterVersion() {
    footerVersion.innerText = `Version ${changelog.version}`;
    footerVersion.addEventListener('click', () => showChangelog(false));
}

function setLayoutToggle(_layout) {
    console.log(_layout);
    const layoutToggleCols = document.getElementById('layout-toggle-columns');
    const layoutToggleWide = document.getElementById('layout-toggle-wide');
    
    switch (_layout) {
        case 'wide':
            toolContainer.classList.remove('xl:columns-2');
            toolContainer.classList.add('xl:columns-1');
            layoutToggleCols.classList.remove('hidden');
            layoutToggleWide.classList.add('hidden');
            break;
            
        case 'columns':
        default:
            toolContainer.classList.remove('xl:columns-1');
            toolContainer.classList.add('xl:columns-2');
            layoutToggleCols.classList.add('hidden');
            layoutToggleWide.classList.remove('hidden');
            break;
    }

    layout = _layout;
    localStorage.setItem(LOCAL_STORAGE_LAYOUT_MODE, layout);
}

function initLayoutToggle() {
    layout = localStorage.getItem(LOCAL_STORAGE_LAYOUT_MODE) ?? 'columns';
    setLayoutToggle(layout);

    layoutToggleBtn.addEventListener('click', () => {
        setLayoutToggle((layout === 'columns') ? 'wide' : 'columns');
    });
}

// Load tools and init filters on document load complete
document.addEventListener('DOMContentLoaded', async () => {
    let filters = {};
    
    showAndInitTools(filters);
    initFilters(filters);
    
    initThemeSwitcher();
    initLayoutToggle();

    // Create Lucide Icons
    lucide.createIcons();

    showChangelog();
    addChangelogListeners();
    setFooterVersion();
});
