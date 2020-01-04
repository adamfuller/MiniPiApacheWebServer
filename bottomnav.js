window.addEventListener('load', function () {
    // Grab the current URL and then remove the http://
    var currentURL = document.URL.replace("http://", "");

    // Split up the path
    var subs = currentURL.split("/");

    // Add a line break
    document.body.appendChild(document.createElement("br"));

    // Iterate through all the path sections
    for (let i = 0; i < subs.length; i++) {

        if (subs[i] == '') continue;

        // make a new anchor element
        var elem = document.createElement("a");

        // name it the last part of the path add back in the missing /
        elem.innerHTML = subs[i] + "/";

        var ref = "http://";
        // Iterate through the rest of the url to build the reference
        for (let j = 0; j <= i; j++) ref += subs[j] + (subs[j] != '' ? "/" : '');

        // Assign the reference
        elem.href = ref;

        // Make it all green
        elem.style.color = "rgb(39, 240, 21)";

        // Add it to the page
        document.body.appendChild(elem);
    }
})
