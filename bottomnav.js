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

        // Put some space on the left
        if (i==0) elem.style.marginLeft = "10px";

        // Add it to the page
        document.lastElementChild.appendChild(elem);
    }

    // Append the last modified date
    var lastUpdated = this.document.createElement("p");
    lastUpdated.innerHTML = "Last updated: " + this.document.lastModified;
    lastUpdated.style.color = "grey";
    lastUpdated.style.marginLeft = "10px";
    document.lastElementChild.appendChild(lastUpdated);
})
