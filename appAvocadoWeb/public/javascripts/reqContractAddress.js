document.getElementById("body").onload = function() {reqContractAdd()};

function reqContractAdd() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      	document.getElementById("divAnswer").innerHTML = xhttp.responseText;
    }
  };
  var x = document.getElementById("h1Address").innerHTML;
  xhttp.open("GET", "/getMyContract/dirs/:"+x, true);
  xhttp.send();
}
