const $ = document;
const $form = $.querySelector(`form`);
const $loading = $.querySelector(`.loading`);
const $croaks = $.querySelector(`.croaks`);

const API_URL =`http://localhost:5000/croaks`;

$loading.style.display =``;

listAllCroaks();

$form.addEventListener(`submit`, (e) => {
    event.preventDefault()
    const formData = new FormData($form);
    const name = formData.get(`name`);
    const content = formData.get(`content`);

    const croak = {
        name,
        content
    };

    $form.style.display = `none`;
    $loading.style.display = ``;

    fetch(API_URL, {
        method: `POST`,
        body: JSON.stringify(croak),
        headers: {
            'content-type' : 'application/json'
        }
    }).then( response => response.json())
        .then(createdCroak => {
            console.log(createdCroak)
            listAllCroaks();

            $form.reset()
            setTimeout(() =>{
                $form.style.display = ``;
                $loading.style.display = `none`;
            }, 10000)
            
        })
})

function listAllCroaks(){
    $croaks.innerHTML = ``;
    fetch(API_URL)
        .then(response => response.json())
        .then(croaks => {
            console.log(croaks);
            croaks.reverse();
            croaks.forEach( croak => {
                const $div = $.createElement(`div`);
                const $header = $.createElement(`h5`);
                const $content = $.createElement(`p`);
                const $date = $.createElement(`small`);

                $header.textContent = croak.name;
                $content.textContent = croak.content;
                $date.textContent = new Date(croak.created).toLocaleDateString(`en-US`,  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric' });

                $div.appendChild($header);
                $div.appendChild($date);
                $div.appendChild($content);

                $div.classList.add(`croak`);

                $croaks.appendChild($div);

            });
            $loading.style.display = `none`;

        });
}