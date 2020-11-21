import JSZip from 'jszip';

function loadZippedCT(filename: string): Promise<JSZip> {
  return new Promise<JSZip>((resolve, reject) => {
    fetch(filename)
      .then((res) => {
        res
          .blob()
          .then((blob: Blob) => {
            const zipproc = new JSZip();
            zipproc
              .loadAsync(blob)
              .then((zip) => {
                resolve(zip);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const unzipByFilename = (filename: string, progressCallback: Function): Promise<Blob[]> => {
  return new Promise<Blob[]>((resolve, reject) => {
    let d = 0;
    progressCallback(0);
    loadZippedCT(filename)
      .then((zip: JSZip) => {
        const promiseArray: Promise<Blob>[] = [];
        Object.keys(zip.files).forEach((file) => {
          const promise = new Promise<Blob>((res, rej) => {
            zip.files[file]
              .async('blob')
              .then((fileData) => {
                d += 1;
                progressCallback(d / promiseArray.length);
                res(fileData);
              })
              .catch((err) => {
                rej(err);
              });
          });
          promiseArray.push(promise);
        });

        Promise.all(promiseArray)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            // eslint-disable-next-line no-alert
            alert(`Failed to unzip - ${err}`);
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default unzipByFilename;
