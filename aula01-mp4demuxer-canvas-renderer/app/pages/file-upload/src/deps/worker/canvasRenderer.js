/** @param {HTMLCanvasElement} canvas  */
let _canvas = {} // Elemento Canvas
let _context = {} // Contexto do Canvas

export default class CanvasRenderer {

    // Função que vai desenhar o Canvas na tela.
    /** @param {VideoFrame} frame */
    static draw(frame) {
        const { displayHeight, displayWidth } = frame;

        _canvas.height = displayHeight;
        _canvas.width = displayWidth;

        _context.drawImage(
            frame, 
            0, // Posição em que ele vai começar a ser exibido no eixo x.
            0, // Posição na qual ele vai começar a ser exibido no eixo y.
            displayWidth, // Largura do Frame
            displayHeight // Altura do Frame
        )

        frame.close(); // Elimino o Frame com o objetivo de limpar a memória.
    }

    // Função responsável pela renderização de frames.
    /** @param {HTMLCanvasElement} canvas  */
    static getRenderer(canvas) {
        _canvas = canvas
        _context = canvas.getContext('2d')
        
        const renderer = this
        let pendingFrame = null // Responsável por buscar o frame pendente.

        return frame => {
            // Função responsável por renderizar o conteúdo de fato.
            const renderAnimationFrame = () => {
                // Vai renderizar o próximo Frame
                renderer.draw(pendingFrame);
                // Coloco ele como nulo depois de usá-lo.
                pendingFrame = null
            }
            if(!pendingFrame) {
                // O requestAnimationFrame renderiza mais de 60 frames por segundo
                requestAnimationFrame(renderAnimationFrame)
            } else {                
                pendingFrame.close();
            }

            pendingFrame = frame;
        }
    }
}