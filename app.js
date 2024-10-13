// Récupération de l'élément input
const fileInput = document.getElementById('file');
let content = {};

const updateContent = (content, title, key, value) => {
    const app_index = content.apps.findIndex(app => app.title === title);
    content.apps[app_index][key] = value;
    console.log(content);
}

const generateApp = (appTitle) => {
    const app = content.apps.find(app => app.title === appTitle);
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const categories = Object.keys(content.categories);

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('categoryDiv');
        categoryDiv.innerHTML = `<h2>${category}</h2>`;
        appDiv.appendChild(categoryDiv);

        const keys = content.categories[category];
        keys.forEach(key => {
            const inputdiv = document.createElement('div');
            inputdiv.classList.add('inputdiv');
            const input = document.createElement('input');
            input.classList.add('input_text');
            input.type = 'text';
            input.value = app[key] ?? 'N/A';
            input.readOnly = key === 'title';
            input.addEventListener('input', (event) => {
                updateContent(content, app.title, key, event.target.value);
            });
            const inputLabel = document.createElement('label');
            inputLabel.innerHTML = app[key]?.includes('http') ? `<a class="inputLabel" href="${app[key]}">${key}</a>` : key;
            inputLabel.classList.add('inputLabel');
            inputdiv.appendChild(input);
            inputdiv.appendChild(inputLabel);
            categoryDiv.appendChild(inputdiv);
        });
    });
}

const initPage = () => {
    const apps_title = content.apps.map(app => app.title);
    const configTestArea = document.getElementById('config_textarea');
    configTestArea.value = JSON.stringify(content.categories, undefined, 2);
    const select = document.getElementById('select');
    select.innerHTML = apps_title.map(title => `<option value="${title}">${title}</option>`).join('');
    generateApp(select.value);
    select.addEventListener('change', (event) => {
        generateApp(event.target.value);
    });


}

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        content = JSON.parse(event.target.result);
        initPage();
    });
    reader.readAsText(file);
});


const exportDataButton = document.getElementById('button_export_data');
exportDataButton.addEventListener('click', () => {
    const data = JSON.stringify(content,undefined,2);
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', "data.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});

const updateConfigButton = document.getElementById('button_update_config');
updateConfigButton.addEventListener('click', () => {
    const configTestArea = document.getElementById('config_textarea');
    content.categories = JSON.parse(configTestArea.value);
    initPage();
});

const switchConfigCheckbox = document.getElementById('switch_config');
switchConfigCheckbox.addEventListener('change', (event) => {
    const configTextArea = document.getElementById('config_textarea');
    const buttonUpdateConfig = document.getElementById('button_update_config');
    configTextArea.style.display = !event.target.checked ? 'none' : 'block';
    buttonUpdateConfig.style.display = !event.target.checked ? 'none' : 'block';
});