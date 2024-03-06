addEventListener("DOMContentLoaded", () => {
    image_preview();
});

let option_counter = 0;

function extend_form(code) {
    let header_element = document.querySelector(`#${code}-form-header`);
    let parent_element = document.querySelector(`#${code}-form`);
    let content_element = document.querySelector(`#${code}-content-form`);
    header_element.onClick = function() {
        window.reduce_form(code);
    }
    parent_element.classList.toggle('extend');
    content_element.style.maxHeight = content_element.scrollHeight + "px";
}

function reduce_form(code) {
    let header_element = document.querySelector(`#${code}-form-header`);
    let content_element = document.querySelector(`#${code}-content-form`);
    let parent_element = document.querySelector(`#${code}-form`);
    parent_element.classList.toggle('extend');
    header_element.onClick = function() {
        window.extend_form(code);
    }
    content_element.style.maxHeight = 0;
}

function image_preview() {
    let image_input = document.querySelector('#display-image-input');
    let image_container = document.querySelector('#display-image-preview');

    image_input.onchange = () => {
        if (image_input.files[0]) {
            let src = URL.createObjectURL(image_input.files[0]);
            document.querySelector('#image-preview-container').style.display = 'block';
            image_container.innerHTML = `
                <img class="image-preview" src="${src}">
            `
            document.querySelector('#display-content-form').style.maxHeight = document.querySelector('#display-content-form').scrollHeight + "px";
        }
    }
}

function add_option() {
    let option_parent_container = document.querySelector('#option-parent-container');
    let option_content = document.querySelector('#option-content-form');
    option_counter += 1;
    option_parent_container.innerHTML += `
        <div class="option-container" id="option-container-${option_counter}">
            <div class="option-container-header">
                <div class="option-title">Option ${option_counter}</div>
                <button class="red-button" onClick="delete_option(${option_counter})">Delete Option</button>
            </div>
            <div form-input-container>
                <div class="form-input-container">
                    <label for="option-name-input-${option_counter}">Name</label>
                    <input id="option-name-input-${option_counter}" type="text">
                </div>
                <div class="form-input-container">
                    <label for="option-image-input-${option_counter}">Image</label>
                    <input type="file" id="option-image-input-${option_counter}" class="image-input" onchange="preview_image(${option_counter})">
                </div>
                <div class="form-input-container option-image-preview-container" id="option-image-preview-container-${option_counter}">
                    <div class="image-preview-label">Image Preview</div>
                    <div id="option-image-preview-${option_counter}" class="image-preview-container"></div>
                </div>
            </div>
        </div>
    `
    option_content.style.maxHeight = option_content.scrollHeight + "px";
}

function preview_image(option_id) {
    let image_input = document.querySelector(`#option-image-input-${option_id}`);
    let image_container = document.querySelector(`#option-image-preview-${option_id}`);
    let option_content = document.querySelector('#option-content-form');

    let src = URL.createObjectURL(image_input.files[0]);
    document.querySelector(`#option-image-preview-container-${option_id}`).style.display = 'block';
    image_container.innerHTML = `
        <img class="image-preview" src="${src}">
    `
    option_content.style.maxHeight = option_content.scrollHeight + "px";
}

function delete_option(option_id) {
    let option_container = document.querySelector(`#option-container-${option_id}`);
    let option_content = document.querySelector('#option-content-form');
    option_container.style.animationPlayState = 'running';
    option_container.addEventListener('animationend', () => {
        option_container.remove();
    })
    option_content.style.maxHeight = option_content.scrollHeight + "px";
}
