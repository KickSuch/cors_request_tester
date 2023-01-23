// HTML elements this program interacts with
const method_input = document.querySelector('#method_input');
const url_input = document.querySelector('#url_input');
const headers_input = document.querySelector('#headers_input');
const body_input = document.querySelector('#body_input');
const output = document.querySelector('#output');

function add_paragraf_to_output(paragraf) {
    output.innerHTML += paragraf;
    output.innerHTML += "\n\n";
    output.scrollTop = output.scrollHeight;
}

function parse_data() {
    data = new Object();
    data.method = method_input.value;
    data.url = url_input.value;
    if (headers_input.value == "") {
        data.headers = null;
    }
    else {
        data.headers = JSON.parse(headers_input.value);
    }
    if (body_input.value == "") {
        data.body = null;
    }
    else {
        data.body = JSON.parse(body_input.value);
    }
    return data;
}

async function fetch_request(data) {
    headers = new Headers();
    for (var key in data.headers) {
        headers.append(key, data.headers[key]);
    }
    let response;
    if (data.method == "GET" || data.method == "HEAD") {
        response = await fetch(data.url, {
            method: data.method,
            mode: 'cors',
            headers: headers
        });
    }
    else {
        response = await fetch(data.url, {
            method: data.method,
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(data.body)
        });
    }
    return response.json();
}

async function make_request() {
    data = parse_data();    
    add_paragraf_to_output("Sending request with this data:\n" + JSON.stringify(data, null, 4));
    try {
        await fetch_request(data).then((json_data) => {
            add_paragraf_to_output("Request returned:\n" + JSON.stringify(json_data, null, 4));
        });
    }
    catch(err) {
        error_message = err.name + ": " + err.message;
        add_paragraf_to_output(error_message);
    }
}

// when you click SEND button
document.querySelector('#send').onclick = function(event) {
    try {
        make_request();
    }
    catch(err) {
        error_message = err.name + ": " + err.message;
        add_paragraf_to_output(error_message);
        throw err; // to see it in console as well as in output
    }
}
