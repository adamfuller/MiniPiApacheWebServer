/*
<!- dropdown menu class ->
        <div class="dropdown" id="dropdown">
          <button class="dropbtn" id="dropbtn" onclick="window.location.href='../index.html'">Home</button>
          <div class="dropdown-content">
            <!- contents of dropdown menu (they're hyperlinks) ->
            <a href="../planets">Planets</a>
            <a href="../life">Life</a>
            <a href="../blobs">Blobs</a>
            <a href="../blocks">Blocks</a>
            <a href='../nothing.html'>Games</a>
            <a href="../mandelbrot">Mandelbrot</a>
          </div>
        </div>

        <!- mobile-menu class ->
        <br />
          <nav class="mobile-menu" id="mobile-menu">
            <a href="../index.html">Home</a>
            <a href="../planets">Planets</a>
            <a href="../life">Life</a>
            <a href="../blobs">Blobs</a>
          </nav>
          </br>
*/
var mainthtml = document.getElementById("mainhtml");
var dropdown = document.createElement("div")
var dropbtn = dropdown.createElement("button");
dropbtn.innerHTML = "Home"
dropbtn.onclick = function () {
    window.location.href = 'www.octalbyte.com';
    return false;
};

document.appendChild(dropdown);

// create dropdown divider

// create dropbtn

// set dropbtn onclick

// create dropdown-content divider

// create links

// append links to dropdown-content divider

// append dropbtn to dropdown divider

// append dropdown-content to dropdown divider

