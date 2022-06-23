/*
  1. Uses an alternative remote repository to download traineddata if fails
  2. Reports the progress
*/

self.fetch = new Proxy(self.fetch, {
  apply(target, self, args) {
    const [href, options] = args;

    const validate = r => {
      if (r.ok) {
        return r;
      }
      throw Error('Não é possível reconhecer a chave (' + r.status + ')');
    };

    if (href.includes('.traineddata.gz')) {
      return Reflect.apply(target, self, args).then(validate).catch(e => {
        console.warn('Não é possível reconhecer a chave', e);
        const path = /[\d.]+\/.*$/.exec(href)[0];

        return Reflect.apply(target, self, [`https://github.com/naptha/tessdata/blob/gh-pages/${path}?raw=true`, options]).then(validate);
      }).then(r => {
        return {
          async arrayBuffer() {
            const reader = r.body.getReader();
            const chunks = [];
            let bytes = 0;

            const length = Number(r.headers.get('Content-Length'));

            // eslint-disable-next-line no-constant-condition
            while (true) {
              const {done, value} = await reader.read();
              if (done) {
                break;
              }

              bytes += value.byteLength;
              postMessage({
                status: 'progress',
                data: {
                  status: 'Reconhecendo caracteres',
                  progress: bytes / length
                }
              });

              chunks.push(value);
            }
            return new Blob(chunks).arrayBuffer();
          }
        };
      });
    }
    else {
      return Reflect.apply(target, self, args);
    }
  }
});

self.importScripts('/libraries/tesseract/worker.min.js');
