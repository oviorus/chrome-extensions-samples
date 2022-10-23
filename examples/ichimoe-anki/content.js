function invoke(action, version, params={}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://localhost:8765');
        xhr.send(JSON.stringify({action, version, params}));
    });
}

document.querySelectorAll("dt").forEach(( item ) => {
  const regexpSize = /([0-9]+\. )?([^ ]+)( .+)?/;
  const match = item.textContent.match(regexpSize);
  invoke('findCards', 6, {
    "query": "Vocabulary-Kanji-Game:" + match[2]
  }).then((result) => {
    if(result != "")
    {
      console.log(`${match[2]}: ${result}`);
      item.style.backgroundColor = '#CFC'
    }
    else
    {
      console.log(`${match[2]}: not found`);
    }
  });
});

