export default class VideoProcessor {
    #mp4Demuxer
    /**
     * 
     * @param {object} options
     * @param {import('./MP4Demuxer.js').default} options.mp4Demuxer
     */

    constructor({ mp4Demuxer }) {
        this.#mp4Demuxer = mp4Demuxer
    }

    /** @returns {ReadableStream} */
    mp4Decoder(encoderConfig, stream) {
        return new ReadableStream({
            start: async (controller) => {
                const decoder = new VideoDecoder({
                    /** @param {VideoFrame} frame */
                   output(frame) {
                       controller.enqueue(frame);
                   },
       
                   error(e) {
                       console.error("Erro no MP4 Decoder.", e);
                       controller.error(e);
                   }
               });
       
               /** @param {EncodedVideoChunk} chunk */
               return this.#mp4Demuxer.run(stream, {
                   onConfig(config) {
                       decoder.configure(config);
                   },
                   onChunk(chunk) {
                       decoder.decode(chunk)
                   }
               }).then(() => {
                    setTimeout(() => {
                        controller.close();
                    }, 3000)
               })
            }
        });     
    }

    async start({ file, encoderConfig }) {
        const stream = file.stream();
        const fileName = file.name.split('/')
                                  .pop()
                                  .replace('.mp4', '');
        
        
        await this.mp4Decoder(encoderConfig, stream, renderFrame)
            .pipeTo(new WritableStream({
                write(frame) {
                    renderFrame(frame)
                }
            }))
    }
}