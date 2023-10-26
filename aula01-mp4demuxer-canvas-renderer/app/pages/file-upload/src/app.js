import Clock from './deps/clock.js';
import View from './view.js';

const view = new View();
const clock = new Clock();
let took = '';

const worker = new Worker('./src/worker/worker.js', {
    type: 'module'
});

worker.onerror = (error) => {
    console.error("Erro", error)
}
worker.onmessage = ({ data }) => {
    if(data.status !== 'done') return;

    clock.stop()
    view.updateElapsedTime(`Process took ${took.replace("ago", "")}`, 5000)
}

worker.postMessage("Enviado do Pai!!!")

view.configureOnFileChange(file => {
    worker.postMessage({
        file
    })

    clock.start((time) => {
        took = time;

        view.updateElapsedTime(`Process started ${time}`)
    })
})

// Isso daqui cria um upload do arquivo presente na pasta vídeos.
async function fakeFetch() {
    const filePath = '/videos/frag_bunny.mp4'
    const response = await fetch(filePath)

    /*Traz o tamanho do arquivo.
    const response = await fetch(filePath, {
        method: "HEAD"
    })
    response.headers.get('content-length')
    debugger*/

    const file = new File([await response.blob()], filePath, {
        type: 'video/mp4',
        lastModified: Date.now()
    })

    const event = new Event('change')
    Reflect.defineProperty(
        event,
        'target',
        { value: { files: [file] }}
    )

    // Esse código está aqui apenas por fins de Debug.
    document.getElementById('fileUpload').dispatchEvent(event)
}

fakeFetch()