/**  by zhangruidong   **/

handle.creatTree();

(function () {
    var file=document.getElementById("file");
    var files=file.querySelector(".files");
    var lis=files.getElementsByTagName("li");
    for (var i = 0; i < lis.length; i++) {
        lis[i].style.backgroundColor="red"
    }
    document.querySelector("header").onclick=function () {
        console.log(lis.length)
    }
})();