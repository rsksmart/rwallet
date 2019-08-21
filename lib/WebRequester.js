function http_simple_get(url){
    return fetch(url);
}

function http_simple_put(url, body){
    return fetch(url, {
        method: 'PUT',
        body: body,
        headers:{
            'Content-Type': 'application/json'
        }
    });
}

function http_simple_post(url, body){
    return fetch(url, {
        method: 'POST',
        body: body,
        headers:{
            'Content-Type': 'application/json'
        }
    });
}

module.exports.http_get_request = http_simple_get;
module.exports.http_put_request = http_simple_put;
module.exports.http_post_request = http_simple_post;
